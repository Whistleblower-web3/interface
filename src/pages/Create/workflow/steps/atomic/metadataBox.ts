import { metadataService } from '@/services/metadata/metadataService';
import { objToJson } from '@/services/createJsonFile/objToJson';
import { fileNameCreate } from '@/pages/Create/workflow/utils/fileName';
import { saveAs } from 'file-saver';
import { mintDataUpload } from '../../utils/commonUpload';
import { BoxInfoFormType } from '../../../types/stateType';
import { AllStepOutputs, MetadataBoxOutput } from '../../../types/stepType';

export interface MetadataBoxParams {
  boxInfo: BoxInfoFormType;
  allStepOutputs: AllStepOutputs;
  isTestMode: boolean;
}

/**
 * Step 5: Generate the Metadata Box JSON file and upload it to IPFS.
 */
export const step_MetadataBox = async (
  { boxInfo, allStepOutputs, isTestMode }: MetadataBoxParams
): Promise<MetadataBoxOutput> => {
  // Generate metadata object
  const metadataBoxObj = await metadataService.createMetadataBox(boxInfo, allStepOutputs);

  // Convert to File object
  const metadataBoxFile = objToJson(metadataBoxObj, fileNameCreate.metadataBoxName());

  // Save locally if configured (for debugging/archive)
  if (import.meta.env.VITE_CREATE_SAVE_FILE === 'true') {
    saveAs(metadataBoxFile, fileNameCreate.metadataBoxName());
  }

  if (isTestMode) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('[Step 5: Metadata] Generated Metadata Object:', metadataBoxObj);
    return {
      metadata_box_file: metadataBoxFile,
      metadata_box_cid: 'mock-metadata-box-cid',
    };
  }

  // Upload to IPFS
  const metadataBoxCid = await mintDataUpload(metadataBoxFile, isTestMode);

  return {
    metadata_box_file: metadataBoxFile,
    metadata_box_cid: metadataBoxCid,
  };
};
