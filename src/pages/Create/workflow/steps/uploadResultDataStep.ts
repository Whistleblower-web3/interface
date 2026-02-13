import { WorkflowStep, WorkflowPayload } from '../core/types';
import { UploadResultDataOutput } from '../../types/stepType';
import { metadataService } from '@dapp/services/metadata/metadataService';
import { objToJson } from '@dapp/services/createJsonFile/objToJson';
import { nameService } from '@/utils/nameService';
// import { saveFile } from '@dapp/services/saveFile';
// import { pinataService } from '@dapp/services/pinata/pinataService';
import { resultDataUpload } from '../utils/commonUpload';

export function createUploadResultDataStep(): WorkflowStep<WorkflowPayload, UploadResultDataOutput> {
  return {
    name: 'uploadResultData',
    description: 'Upload Result Data',

    execute: async (input, context) => {
      context.throwIfCancelled();
      context.updateStore(stores => {
        stores.workflow.setCurrentStep('uploadResultData');
      });

      const outputs = input.all_step_outputs;

      try {
        const resultData = metadataService.createResultData(
          input.boxInfo.mint_method,
          outputs.file_cid_list,
          [
            outputs.box_image_cid && { cid: outputs.box_image_cid, isExisting: false },
            outputs.nft_image_cid && { cid: outputs.nft_image_cid, isExisting: false },
            outputs.metadata_box_cid && { cid: outputs.metadata_box_cid, isExisting: false },
            outputs.metadata_nft_cid && { cid: outputs.metadata_nft_cid, isExisting: false },
          ].filter(Boolean) as any,
          true,
          String(outputs.current_time.timestamp ?? Date.now())
        );

        const resultDataFile = objToJson(resultData, nameService.resultDataName());
        
        const resultDataCid = await resultDataUpload(resultDataFile, input.isTestMode);

        context.updateStore(stores => {
          stores.nft.updateUploadResultDataOutput({ result_data_cid: resultDataCid });
        });

        return { result_data_cid: resultDataCid };
      } catch (error: any) {
        context.log(`Result data upload failed (non-critical): ${error.message}`, 'warn');
        return { result_data_cid: '' };
      }
    },

    onSuccess: (_, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadResultData_status', 'success');
        stores.workflow.addCompletedStep('uploadResultData');
      });
    },

    onError: (error, context) => {
      context.updateStore(stores => {
        stores.workflow.updateCreateProgress('uploadResultData_status', 'error');
        stores.workflow.updateCreateProgress('uploadResultData_Error', error.message);
      });
    },
  };
}
