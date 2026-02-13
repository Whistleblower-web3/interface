import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadFilesOutput } from '../../types/stepType';
// import { pinataService } from '@/dapp/services/pinata/pinataService';
// import { saveAs } from 'file-saver';
import { evidenceCommonUpload } from '../utils/commonUpload';

export function createUploadFilesStep(): WorkflowStep<WorkflowPayload, UploadFilesOutput> {
  return {
    name: 'uploadFiles',
    description: 'Upload zip files to IPFS',

    validate: (input) => {
      const fileChunks = input.all_step_outputs.file_chunks;
      if (!fileChunks || fileChunks.length === 0) {
        console.error('Upload Files: fileChunks is missing');
        return false;
      }
      const fileName = input.all_step_outputs.file_name;
      if (!fileName) {
        console.error('Upload Files: fileName is missing');
        return false;
      }
      if (input.boxInfo.mint_method === 'create') {
        const slicesMetadata = input.all_step_outputs.slices_metadata_file;
        if (!slicesMetadata) {
          console.error('Upload Files: slicesMetadata is missing');
          return false;
        }
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadFiles');
      });

      const fileChunks =  input.all_step_outputs.file_chunks;
      const fileName = input.all_step_outputs.file_name;
      const slicesMetadata = input.all_step_outputs.slices_metadata_file;

      try {
        const result = input.boxInfo.mint_method === 'create'
          ? await handleCreateUpload(fileChunks!, fileName!, slicesMetadata as Blob, input.isTestMode)
          : await handlePublishUpload(fileChunks!, fileName!, input.isTestMode);

        context.updateStore(stores => {
          stores.nft.updateUploadFilesOutput(result);
        });


        return result;
      } catch (error: any) {
        throw new Error(`Upload files failed: ${error.message}`);
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadFiles_status', 'success');
        stores.workflow.addCompletedStep('uploadFiles');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadFiles_status', 'error');
        stores.workflow.updateCreateProgress('uploadFiles_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}

async function handleCreateUpload(
  fileChunks: Blob[],
  fileName: string,
  slicesMetadata: Blob,
  isTestMode: boolean
): Promise<UploadFilesOutput> {
  const cidList: string[] = [];
  
  for (let index = 0; index < fileChunks.length; index++) {
    const file = new File([fileChunks[index]], `${fileName}.part${index + 1}`);

    const cid = await evidenceCommonUpload(file, isTestMode);
    cidList.push(cid);
  }

  const metadataFile = new File([slicesMetadata], `${fileName}.metadata.json`, { type: 'application/json' });
  
  const metadataCid = await evidenceCommonUpload(metadataFile, isTestMode);

  return {
    slices_metadata_cid: metadataCid,
    file_cid_list: cidList,
  };
}

async function handlePublishUpload(
  fileChunks: Blob[],
  fileName: string,
  isTestMode: boolean
): Promise<UploadFilesOutput> {
  const file = new File([fileChunks[0]], fileName, { type: 'application/zip' });
  let cid = await evidenceCommonUpload(file, isTestMode);
  return {
    slices_metadata_cid: '',
    file_cid_list: [cid],
  };
}
