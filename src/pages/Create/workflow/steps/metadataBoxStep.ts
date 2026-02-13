import { WorkflowStep, WorkflowPayload } from '../core/types';
import { MetadataBoxOutput } from '../../types/stepType';
import { metadataService } from '@dapp/services/metadata/metadataService';
import { objToJson } from '@dapp/services/createJsonFile/objToJson';
import { nameService } from '@/utils/nameService';
import { saveFile } from '@dapp/services/saveFile';
import { mintDataUpload } from '../utils/commonUpload';


export function createMetadataBoxStep(): WorkflowStep<WorkflowPayload, MetadataBoxOutput> {
  return {
    name: 'metadataBox',
    description: 'Create Metadata Box',

    validate: (input) => {
      const outputs = input.all_step_outputs;
      if (!outputs.box_image_cid) {
        console.error('Create Metadata: box_image_cid is missing');
        return false;
      }
      if (!outputs.nft_image_cid) {
        console.error('Create Metadata: nft_image_cid is missing');
        return false;
      }
      if (!outputs.file_cid_list || outputs.file_cid_list.length === 0) {
        console.error('Create Metadata: file_cid_list is missing');
        return false;
      }
      if (input.boxInfo.mint_method === 'create') {
        if (!outputs.encryption_slices_metadata_cid.encryption_data) {
          console.error('Create Metadata: encryption_slices_metadata_cid is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('metadataBox');
      });

      const outputs = input.all_step_outputs;

      const metadataBoxObj = await metadataService.createMetadataBox(input.boxInfo, outputs);

      const metadataBoxFile = objToJson(metadataBoxObj, nameService.metadataBoxName());

      if (import.meta.env.DEV) {
        // save file to local
        saveFile(metadataBoxFile, nameService.metadataBoxName());
      }


      const metadataBoxCid = await mintDataUpload(metadataBoxFile, input.isTestMode);

      const result: MetadataBoxOutput = {
        metadata_box_file: metadataBoxFile,
        metadata_box_cid: metadataBoxCid,
      };

      context.updateStore(stores => {
        stores.nft.updateMetadataBoxOutput(result);
      });


      return result;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('metadataBox_status', 'success');
        stores.workflow.addCompletedStep('metadataBox');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('metadataBox_status', 'error');
        stores.workflow.updateCreateProgress('metadataBox_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
