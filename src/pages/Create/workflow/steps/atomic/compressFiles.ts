import { compressService } from '@dapp/services/zip/compressService';
import { zipFileService } from '@dapp/services/zip/zipFile';
import { CompressFilesOutput } from '../../../types/stepType';

export interface CompressFilesParams {
  files: File[];
  mintMethod: 'create' | 'createAndPublish';
}

/**
 * Step 1: Compress files into a ZIP archive.
 * For 'create' mode, password-protected encryption is applied before splitting.
 * For 'createAndPublish' mode, simple compression is used.
 */
export const step_CompressFiles = async (
  { files, mintMethod, isTestMode }: CompressFilesParams & { isTestMode?: boolean }
): Promise<CompressFilesOutput> => {
  if (isTestMode) {
    console.log(`[Step 1: Compress] Input Files: ${files.length}`, files.map(f => f.name));
  }

  if (!files || files.length === 0) {
    throw new Error('No files to compress');
  }

  // Map Files to a format compatible with the antd UploadFile service requirement
  const fileEntries = files.map((file, index) => ({
    uid: `file-${index}-${file.name}`,
    name: file.name,
    status: 'done' as const,
    originFileObj: file,
  }));

  if (mintMethod === 'create') {
    // Password-protected compression
    const { zipBlob, zipName, zipPassword } = await compressService.compressWithPassword(
      fileEntries as any,
      import.meta.env.VITE_CREATE_SAVE_FILE === 'true'
    );

    // Split the ZIP file for chunked upload
    const splitResult = await zipFileService.splitZipFile(
      zipBlob,
      zipName,
      Math.ceil(zipBlob.size / 2)
    );

    const result = {
      zip_file: zipBlob,
      file_name: zipName,
      password: zipPassword,
      file_chunks: splitResult.chunks,
      slices_metadata_file: splitResult.json,
    };

    if (isTestMode) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log(`[Step 1: Compress] create mode: Generated Password: ${zipPassword}`);
      console.log(`[Step 1: Compress] create mode: Output Chunks: ${splitResult.chunks.length}`);
    }

    return result;
  } else {
    // Standard compression (unprotected)
    const { zipBlob, zipName } = await compressService.compressWithoutPassword(
      fileEntries as any,
      import.meta.env.VITE_CREATE_SAVE_FILE === 'true'
    );

    if (isTestMode) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('[Step 1: Compress] createAndPublish mode: Standard compression complete (no password)');
    }

    return {
      zip_file: zipBlob,
      file_name: zipName,
      password: '',
      file_chunks: [zipBlob],
      slices_metadata_file: null,
    };
  }
};
