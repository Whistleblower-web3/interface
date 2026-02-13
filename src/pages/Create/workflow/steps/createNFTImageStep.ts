import { WorkflowStep, WorkflowPayload } from '../core/types';
import { CreateNFTImageOutput, TimeType } from '../../types/stepType';
import { filterNftData } from '../utils/filterNftData'
import CreateNftImage from '@dapp/services/createNftImage';
import backgroundImg from '@assets/nft/nft-light-1.jpg';
import { nameService } from '@/utils/nameService';
import { openNFTPreview } from '@dapp/components/html/nftPreviewTemplate';
import { timeToDate } from '@dapp/utils/time';

export function createCreateNFTImageStep(): WorkflowStep<WorkflowPayload, CreateNFTImageOutput> {
  return {
    name: 'createNFTImage',
    description: 'Create NFT Image',

    validate: (input) => {
      const { boxInfo, boxImages } = input;
      if (!boxInfo.type_of_crime || !boxInfo.title || !boxInfo.country || !boxInfo.event_date) {
        console.error('Create NFT Image: missing required box info fields');
        return false;
      }
      if (!boxImages || boxImages.length === 0) {
        console.error('Create NFT Image: images are missing');
        return false;
      }
      return true;
    },

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('createNFTImage');
      });

      const timestamp = Date.now();
      const createDate = timeToDate(timestamp);
      const currentTime:TimeType = { create_date:createDate, timestamp };

      const nftData = filterNftData({
        typeOfCrime: input.boxInfo.type_of_crime,
        title: input.boxInfo.title,
        country: input.boxInfo.country,
        state: input.boxInfo.state,
        eventDate: input.boxInfo.event_date,
        createDate,
      });

      const imageName = nameService.nftImageName();
      
      // Open preview window BEFORE async operation to avoid popup blocker
      // This ensures the window.open() is called in the user interaction context
      let previewWindow: Window | null = null;
      if (!input.isTestMode) {
        previewWindow = window.open('', '_blank');
        if (previewWindow) {
          // Show loading message while generating NFT image
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <title>NFT Preview - ${imageName}</title>
                <style>
                  body {
                    margin: 0;
                    padding: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    color: #fff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  }
                  .loading {
                    text-align: center;
                  }
                  .spinner {
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid #fff;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                  }
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                </style>
              </head>
              <body>
                <div class="loading">
                  <div class="spinner"></div>
                  <p>Generating NFT Preview...</p>
                </div>
              </body>
            </html>
          `);
          previewWindow.document.close();
        } else {
          console.warn('[NFT Preview] Failed to open preview window - popup may be blocked');
        }
      }

      // Perform async NFT image creation
      const { image, dataUrl } = await CreateNftImage(nftData, imageName, backgroundImg, input.boxImages[0]);

      const output: CreateNFTImageOutput = {
        nft_image: image,
        current_time: currentTime,
      };

      context.updateStore(stores => {
        stores.nft.updateCreateNFTImageOutput(output);
      });

      // Fill the preview window with actual content after async operation completes
      if (!input.isTestMode) {
        if (previewWindow && !previewWindow.closed) {
          // Use existing window to avoid popup blocker
          openNFTPreview(dataUrl, imageName, previewWindow);
        } else {
          // Fallback: try to open new window (may still be blocked)
          openNFTPreview(dataUrl, imageName);
        }
      }

      return output;
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('createNFTImage_status', 'success');
        stores.workflow.addCompletedStep('createNFTImage');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('createNFTImage_status', 'error');
        stores.workflow.updateCreateProgress('createNFTImage_Error', error.message);
        // stores.workflow.updateCreateProgress('workflowStatus', 'error');
      });
    },
  };
}
