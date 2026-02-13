import { WorkflowStep, WorkflowPayload } from '../core/types';
import { MintOutput } from '../../types/stepType';
import { parseUnits } from 'viem';

export interface MintStepDependencies {
  writeCustorm: (params: any) => Promise<string>;
  contractConfig: any;
  decimals?: number ;
}

export function createMintStep(deps: MintStepDependencies): WorkflowStep<WorkflowPayload, MintOutput> {
  const { writeCustorm, contractConfig, decimals } = deps;

  return {
    name: 'mint',
    description: 'Mint Truth Box and NFT',

    validate: (input) => {
      const outputs = input.all_step_outputs;
      if (!outputs.metadata_box_cid) {
        console.error('Mint: metadata_box_cid is missing');
        return false;
      }
      if (!outputs.metadata_nft_cid) {
        console.error('Mint: metadata_nft_cid is missing');
        return false;
      }
      if (!input.boxInfo.nft_owner) {
        console.error('Mint: nft_owner is missing');
        return false;
      }
      if (input.boxInfo.mint_method === 'create') {
        if (!input.boxInfo.price) {
          console.error('Mint: price is missing');
          return false;
        }
        if (!outputs.key_pair?.private_key_minter) {
          console.error('Mint: key pair is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('mint');
      });

      const outputs = input.all_step_outputs;
      const { nft_owner, price, mint_method } = input.boxInfo;

      try {
        let functionName: string;
        let args: any[];

        if (mint_method === 'create') {
          if (!price || typeof price !== 'string') {
            throw new Error(`Invalid price: ${price} (type: ${typeof price})`);
          }
          if (!outputs.key_pair?.private_key_minter) {
            throw new Error('key_pair.private_key_minter is missing');
          }
          
          const priceInWei = parseUnits(price, decimals || 18);
          functionName = 'create';
          args = [
            nft_owner,
            outputs.metadata_nft_cid,
            outputs.metadata_box_cid,
            outputs.key_pair.private_key_minter,
            priceInWei,
          ];
        } else {
          functionName = 'createAndPublish';
          args = [nft_owner, outputs.metadata_nft_cid, outputs.metadata_box_cid];
        }

        const invalidArgs = args.map((arg, index) => ({ 
          index, 
          arg, 
          isUndefined: arg === undefined,
          isNull: arg === null,
          type: typeof arg,
        }));
        const hasInvalid = invalidArgs.some(item => item.isUndefined || item.isNull);
        if (hasInvalid) {
          console.error('Mint: Some arguments are invalid:', invalidArgs);
          console.error('Mint: Full args array:', args);
          throw new Error(`Cannot mint: some arguments are invalid. Args: ${JSON.stringify(invalidArgs)}`);
        }

        if (!contractConfig || !contractConfig.address || !contractConfig.abi) {
          console.error('Mint: Invalid contractConfig:', contractConfig);
          throw new Error(`Invalid contractConfig: ${JSON.stringify(contractConfig)}`);
        }

        context.throwIfCancelled();
        const transaction_hash = await writeCustorm({
          contract: contractConfig,
          functionName: functionName as any,
          args: args as any,
        });

        const result: MintOutput = {
          transaction_hash,
          token_id: '',
        };

        context.updateStore(stores => {
          stores.nft.updateMintOutput(result);
        });

        return result;
      } catch (error: any) {
        throw new Error(`Mint failed: ${error.message}`);
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('mint_status', 'success');
        stores.workflow.addCompletedStep('mint');
        stores.workflow.updateCreateProgress('workflowStatus', 'success');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('mint_status', 'error');
        stores.workflow.updateCreateProgress('mint_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
