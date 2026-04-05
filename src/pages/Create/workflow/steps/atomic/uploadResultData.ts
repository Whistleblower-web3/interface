import { metadataService } from '@dapp/services/metadata/metadataService';
import { objToJson } from '@dapp/services/createJsonFile/objToJson';
import { fileNameCreate } from '@/pages/Create/workflow/utils/fileName';
import { saveAs } from 'file-saver';
import { resultDataUpload } from '../../utils/commonUpload';
import { BoxInfoFormType } from '../../../types/stateType';
import { AllStepOutputs, UploadResultDataOutput } from '../../../types/stepType';

export interface UploadResultDataParams {
  boxInfo: BoxInfoFormType;
  allStepOutputs: AllStepOutputs;
  isTestMode: boolean;
}

/**
 * Step 7: Upload result data (audit log) to IPFS.
 * This is a non-critical step that doesn't block completion.
 */
export const step_UploadResultData = async (
  { boxInfo, allStepOutputs, isTestMode }: UploadResultDataParams
): Promise<UploadResultDataOutput> => {
  const cidList: string[] = [
    ...allStepOutputs.file_cid_list,
    allStepOutputs.slices_metadata_cid,
    allStepOutputs.box_image_cid,
    allStepOutputs.metadata_box_cid,
  ].filter(Boolean);

  try {
    const resultData = metadataService.createResultData(
      boxInfo.mint_method,
      cidList,
      true,
      String(allStepOutputs.current_time.timestamp ?? Date.now())
    );

    const resultDataFile = objToJson(resultData, fileNameCreate.resultDataName());

    if (import.meta.env.VITE_CREATE_SAVE_FILE === 'true') {
      saveAs(resultDataFile, fileNameCreate.resultDataName());
    }

    if (isTestMode) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('[Step 7: Result Data] Test Mode: Skipping IPFS upload for audit log');
      return { result_data_cid: 'mock-result-data-cid' };
    }

    const resultDataCid = await resultDataUpload(resultDataFile, isTestMode);

    return { result_data_cid: resultDataCid };
  } catch (error: any) {
    console.warn('Upload result data failed (non-critical):', error.message);
    return { result_data_cid: '' };
  }
};
