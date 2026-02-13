import { WorkflowStep, WorkflowPayload } from '../core/types';
import { EncryptDataOutput } from '../../types/stepType';
import { CryptionService } from '@dapp/services/cryption';

export function createEncryptDataStep(): WorkflowStep<WorkflowPayload, EncryptDataOutput> {
  return {
    name: 'encryptData',
    description: 'Encrypt Data',

    canSkip: (input) => input.boxInfo.mint_method === 'createAndPublish',

    validate: (input) => {
      const file_cid_list = input.all_step_outputs.file_cid_list;
      if (!file_cid_list || file_cid_list.length === 0) {
        console.error('Encrypt Data: file_cid_list is missing');
        return false;
      }
      if (input.boxInfo.mint_method === 'create') {
        const password = input.all_step_outputs.password;
        const slices_metadata_cid = input.all_step_outputs.slices_metadata_cid;
        if (!password) {
          console.error('Encrypt Data: password is missing');
          return false;
        }
        if (!slices_metadata_cid) {
          console.error('Encrypt Data: slices_metadata_cid is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('encryptData');
      });

      if (input.boxInfo.mint_method === 'createAndPublish') {
        const empty: EncryptDataOutput = {
          encryption_slices_metadata_cid: {
            encryption_data: '',
            encryption_iv: '',
          },
          encryption_file_cid: [],
          encryption_passwords: {
            encryption_data: '',
            encryption_iv: '',
          },
          key_pair: {
            private_key_minter: '',
            public_key_minter: '',
          },
        };
        context.updateStore(stores => {
          stores.nft.updateEncryptDataOutput(empty);
        });
        return empty;
      }

      const file_cid_list = input.all_step_outputs.file_cid_list;
      const password = input.all_step_outputs.password;
      const slices_metadata_cid = input.all_step_outputs.slices_metadata_cid;

      const keyPair = await CryptionService.generateKeyPair();

      const metadataResult = await CryptionService.encryptList(
        keyPair.publicKey_bytes,
        keyPair.privateKey_bytes,
        slices_metadata_cid ? [slices_metadata_cid] : []
      );

      const cidResult = await CryptionService.encryptList(
        keyPair.publicKey_bytes,
        keyPair.privateKey_bytes,
        file_cid_list ?? []
      );

      const passwordResult = await CryptionService.encryptList(
        keyPair.publicKey_bytes,
        keyPair.privateKey_bytes,
        [password ?? '']
      );

      if (!cidResult.success || !cidResult.data || !passwordResult.success || !passwordResult.data) {
        throw new Error('Encrypt data failed');
      }

      const output: EncryptDataOutput = {
        encryption_slices_metadata_cid: {
          encryption_data: metadataResult.data?.[0]?.encrypted_bytes ?? '',
          encryption_iv: metadataResult.data?.[0]?.iv_bytes ?? '',
        },
        encryption_file_cid: cidResult.data.map(item => ({
          encryption_data: item.encrypted_bytes,
          encryption_iv: item.iv_bytes,
        })),
        encryption_passwords: {
          encryption_data: passwordResult.data[0].encrypted_bytes,
          encryption_iv: passwordResult.data[0].iv_bytes,
        },
        key_pair: {
          private_key_minter: keyPair.privateKey_bytes,
          public_key_minter: keyPair.publicKey_bytes,
        },
      };

      context.updateStore(stores => {
        stores.nft.updateEncryptDataOutput(output);
      });



      return output;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('encryptData_status', 'success');
        stores.workflow.addCompletedStep('encryptData');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('encryptData_status', 'error');
        stores.workflow.updateCreateProgress('encryptData_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
