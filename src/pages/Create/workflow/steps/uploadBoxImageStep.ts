import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadBoxImageOutput } from '../../types/stepType';
import { mintDataUpload } from '../utils/commonUpload';

export function createUploadBoxImageStep(): WorkflowStep<WorkflowPayload, UploadBoxImageOutput> {
  return {
    name: 'uploadBoxImage',
    description: 'Upload Box Image to IPFS',

    validate: (input) => {
      if (!input.boxImages || input.boxImages.length === 0) {
        console.error('Upload Box Image: boxImages is missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadBoxImage');
      });

      try {
        const image = input.boxImages[0];
        // Renaming or wrapping file if necessary, but here we just upload
        const cid = await mintDataUpload(image, input.isTestMode);

        const result: UploadBoxImageOutput = {
          box_image_cid: cid,
        };

        context.updateStore(stores => {
          stores.nft.updateUploadBoxImageOutput(result);
        });

        return result;
      } catch (error: any) {
        throw new Error(`Upload box image failed: ${error.message}`);
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadBoxImage_status', 'success');
        stores.workflow.addCompletedStep('uploadBoxImage');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadBoxImage_status', 'error');
        stores.workflow.updateCreateProgress('uploadBoxImage_Error', error.message);
      });
    },
  };
}
