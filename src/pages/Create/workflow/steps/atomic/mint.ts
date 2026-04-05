import { parseUnits } from 'viem';
import { MintOutput, AllStepOutputs } from '../../../types/stepType';
import { BoxInfoFormType } from '../../../types/stateType';

export interface MintStepParams {
  boxInfo: BoxInfoFormType;
  allStepOutputs: AllStepOutputs;
  writeCustorm: (params: any) => Promise<string>;
  contractConfig: { address: `0x${string}`; abi: any };
  decimals?: number;
}

/**
 * Step 6: Mint the Truth Box on the blockchain.
 * Calls either 'create' or 'createAndPublish' based on mintMethod.
 */
export const step_Mint = async (
  { boxInfo, allStepOutputs, writeCustorm, contractConfig, decimals, isTestMode }: MintStepParams & { isTestMode?: boolean }
): Promise<MintOutput> => {
  const { price, mint_method } = boxInfo;
  const { metadata_box_cid, key_pair } = allStepOutputs;

  if (!metadata_box_cid) {
    throw new Error('Metadata Box CID is missing');
  }

  let functionName: string;
  let args: any[];

  if (mint_method === 'create') {
    if (!price || typeof price !== 'string') {
      throw new Error('Valid price is required for create mode');
    }
    if (!key_pair?.private_key_minter) {
      throw new Error('Minter private key is missing');
    }

    const priceInWei = parseUnits(price, decimals || 18);
    functionName = 'create';
    args = [
      metadata_box_cid,
      key_pair.private_key_minter,
      priceInWei,
    ];
  } else {
    functionName = 'createAndPublish';
    args = [metadata_box_cid];
  }

  // Validate args
  if (args.some(arg => arg === undefined || arg === null)) {
    throw new Error('Invalid arguments for minting');
  }

  if (isTestMode) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('[Step 6: Mint] Test Mode: Skipping real blockchain transaction');
    console.log('[Step 6: Mint] Contract Function:', functionName);
    console.log('[Step 6: Mint] Arguments:', args);
    return {
      transaction_hash: 'mock-tx-hash-0x-test-mode-success',
    };
  }

  const transaction_hash = await writeCustorm({
    contractAddress: contractConfig.address,
    abi: contractConfig.abi,
    functionName,
    args,
  });

  return {
    transaction_hash,
  };
};
