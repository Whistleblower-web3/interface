import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadNFTImageOutput } from '../../types/stepType';
import { mintDataUpload } from '../utils/commonUpload';

export function createUploadNFTImageStep(): WorkflowStep<WorkflowPayload, UploadNFTImageOutput> {
  return {
    name: 'uploadNFTImage',
    description: 'Upload NFT Image to IPFS',

    validate: (input) => {
      const image = input.all_step_outputs.nft_image;
      if (!image || image.size === 0) {
        console.error('Upload NFT Image: nft_image is missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadNFTImage');
      });

      try {
        const image = input.all_step_outputs.nft_image;
        const cid = await mintDataUpload(image!, input.isTestMode);

        const result: UploadNFTImageOutput = {
          nft_image_cid: cid,
        };

        context.updateStore(stores => {
          stores.nft.updateUploadNFTImageOutput(result);
        });

        return result;
      } catch (error: any) {
        throw new Error(`Upload NFT image failed: ${error.message}`);
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadNFTImage_status', 'success');
        stores.workflow.addCompletedStep('uploadNFTImage');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadNFTImage_status', 'error');
        stores.workflow.updateCreateProgress('uploadNFTImage_Error', error.message);
      });
    },
  };
}
