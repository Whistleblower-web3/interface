import { evidenceCommonUpload } from '../../utils/commonUpload';
import { UploadFilesOutput } from '../../../types/stepType';

export interface UploadFilesParams {
  fileChunks: Blob[];
  fileName: string;
  slicesMetadata: Blob | null;
  mintMethod: 'create' | 'createAndPublish';
  isTestMode: boolean;
}

/**
 * Step 2: Upload file chunks and metadata to IPFS.
 */
export const step_UploadFiles = async (
  { fileChunks, fileName, slicesMetadata, mintMethod, isTestMode }: UploadFilesParams
): Promise<UploadFilesOutput> => {
  if (!fileChunks || fileChunks.length === 0) {
    throw new Error('No file chunks to upload');
  }

  if (mintMethod === 'create') {
    if (!slicesMetadata) {
      throw new Error('Slices metadata is missing for create mode');
    }

    if (isTestMode) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const mockCidList = fileChunks.map((_, i) => `mock-file-chunk-cid-${i + 1}`);
      const mockMetaCid = 'mock-slices-metadata-cid';
      console.log(`[Step 2: Upload] Test Mode: Skipping IPFS upload for ${fileChunks.length} chunks`);
      console.log(`[Step 2: Upload] Mock Meta CID: ${mockMetaCid}`);
      return {
        slices_metadata_cid: mockMetaCid,
        file_cid_list: mockCidList,
      };
    }

    // Upload parts
    const cidList: string[] = [];
    for (let i = 0; i < fileChunks.length; i++) {
      const partFile = new File([fileChunks[i]], `${fileName}.part${i + 1}`);
      const cid = await evidenceCommonUpload(partFile, isTestMode);
      cidList.push(cid);
    }

    // Upload meta
    const metaFile = new File([slicesMetadata], `${fileName}.metadata.json`, { type: 'application/json' });
    const metadataCid = await evidenceCommonUpload(metaFile, isTestMode);

    return {
      slices_metadata_cid: metadataCid,
      file_cid_list: cidList,
    };
  } else {
    if (isTestMode) {
      const mockCid = 'mock-single-file-cid';
      console.log('[Step 2: Upload] Test Mode: Skipping single file IPFS upload');
      return {
        slices_metadata_cid: '',
        file_cid_list: [mockCid],
      };
    }
    // Simple upload
    const file = new File([fileChunks[0]], fileName, { type: 'application/zip' });
    const cid = await evidenceCommonUpload(file, isTestMode);
    return {
      slices_metadata_cid: '',
      file_cid_list: [cid],
    };
  }
};
