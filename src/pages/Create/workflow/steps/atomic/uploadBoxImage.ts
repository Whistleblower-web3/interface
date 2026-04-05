import { mintDataUpload } from '../../utils/commonUpload';
import { UploadBoxImageOutput } from '../../../types/stepType';

export interface UploadBoxImageParams {
  boxImage: File;
  isTestMode: boolean;
}

/**
 * Step 4: Upload the Box Image to IPFS.
 */
export const step_UploadBoxImage = async (
  { boxImage, isTestMode }: UploadBoxImageParams
): Promise<UploadBoxImageOutput> => {
  if (!boxImage) {
    throw new Error('No box image to upload');
  }

  if (isTestMode) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('[Step 4: Box Image] Test Mode: Skipping IPFS upload for image:', boxImage.name);
    return {
      box_image_cid: 'mock-box-image-cid',
    };
  }

  const cid = await mintDataUpload(boxImage, isTestMode);

  return {
    box_image_cid: cid,
  };
};
