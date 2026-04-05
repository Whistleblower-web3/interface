import { StepNameType, allSteps } from '../../types/workflowStateType';
import { generateExecutionPlan } from './executionPlan';
import { useNFTCreateStore, } from '../../store/useNFTCreateStore';
import { useCreateWorkflowStore } from '../../store/useCreateWorkflowStore';
import { step_CompressFiles } from '../steps/atomic/compressFiles';
import { step_UploadFiles } from '../steps/atomic/uploadFiles';
import { step_EncryptData } from '../steps/atomic/encryptData';
import { step_UploadBoxImage } from '../steps/atomic/uploadBoxImage';
import { step_MetadataBox } from '../steps/atomic/metadataBox';
import { step_Mint } from '../steps/atomic/mint';
import { step_UploadResultData } from '../steps/atomic/uploadResultData';

interface WorkflowRunnerDeps {
  writeCustorm: (params: any) => Promise<string>;
  contractConfig: any;
  decimals?: number;
}

/**
 * Error class for workflow cancellation
 */
class WorkflowCancelledError extends Error {
  constructor() {
    super('Workflow cancelled by user');
    this.name = 'WorkflowCancelledError';
  }
}

/**
 * Main Workflow Orchestrator (Functional)
 * Executes the 7 steps of Truth Box creation.
 */
export const executeCreateWorkflow = async (deps: WorkflowRunnerDeps) => {
  const nftStore = useNFTCreateStore.getState();
  const workflowStore = useCreateWorkflowStore.getState();
  const { boxInfoForm, fileData, isTestMode, all_step_outputs, changedFields } = nftStore;

  // Helper: check for cancellation
  const checkCancel = () => {
    if (useCreateWorkflowStore.getState().isCancel) {
      throw new WorkflowCancelledError();
    }
  };

  // 1. Identify affected steps based on PRE-COMMITTED changedFields
  // (The tracker has already updated changedFields by comparing current values vs OLD baseline)
  const { executionSteps, skippableSteps } = generateExecutionPlan(
    workflowStore.completedSteps,
    changedFields
  );

  // 2. Lock current values as the NEW baseline for this run (and potential restarts)
  nftStore.commitBaseline();

  workflowStore.startWorkflow();

  // Convert list to a set for fast lookup
  const affectedStepsSet = new Set(executionSteps);

  if (isTestMode) {
    console.log('%c [TRUTH BOX] 🧪 TEST MODE ACTIVE ', 'background: #ffcc00; color: #000; font-weight: bold; padding: 4px;');
    console.log(`[WorkflowRunner] completedSteps:`, workflowStore.completedSteps);
    console.log(`[WorkflowRunner] Changed fields detected:`, changedFields);
    console.log(`[WorkflowRunner] Execution Plan:`, executionSteps);
    console.log(`[WorkflowRunner] Skippable Steps:`, skippableSteps);
  }

  // Update progress for skippable steps to 'skipped'
  skippableSteps.forEach(step => updateStepStatus(step, 'skipped'));

  // Ensure execution steps are in 'pending' status before starting
  workflowStore.resetCreateProgressList(executionSteps);

  try {
    checkCancel();

    // --- STEP 1: Compress Files ---
    const needsCompress = affectedStepsSet.has('compressFiles');

    let currentOutputs = { ...all_step_outputs };

    if (needsCompress) {
      updateStepStatus('compressFiles', 'processing');
      const files = fileData.file_list.map(f => f.originFileObj as File).filter(Boolean);
      const compressResult = await step_CompressFiles({ files, mintMethod: boxInfoForm.mint_method as any, isTestMode });
      currentOutputs = { ...currentOutputs, ...compressResult };
      nftStore.updateStepOutput(compressResult);
      updateStepStatus('compressFiles', 'success');
    }

    // --- STEP 2: Upload Files ---
    const needsUploadFiles = affectedStepsSet.has('uploadFiles');
    if (needsUploadFiles) {
      checkCancel();
      updateStepStatus('uploadFiles', 'processing');
      const uploadOutput = await step_UploadFiles({
        fileChunks: currentOutputs.file_chunks,
        fileName: currentOutputs.file_name,
        slicesMetadata: currentOutputs.slices_metadata_file,
        mintMethod: boxInfoForm.mint_method as any,
        isTestMode,
      });
      currentOutputs = { ...currentOutputs, ...uploadOutput };
      nftStore.updateStepOutput(uploadOutput);
      updateStepStatus('uploadFiles', 'success');
    }

    // --- STEP 3: Encrypt Data ---
    const needsEncrypt = affectedStepsSet.has('encryptData');
    if (needsEncrypt) {
      checkCancel();
      updateStepStatus('encryptData', 'processing');
      const encryptOutput = await step_EncryptData({
        fileCidList: currentOutputs.file_cid_list,
        password: currentOutputs.password,
        slicesMetadataCid: currentOutputs.slices_metadata_cid,
        mintMethod: boxInfoForm.mint_method as any,
        isTestMode,
      });
      currentOutputs = { ...currentOutputs, ...encryptOutput };
      nftStore.updateStepOutput(encryptOutput);
      updateStepStatus('encryptData', 'success');
    }

    // --- STEP 4: Upload Box Image ---
    const needsUploadBoxImage = affectedStepsSet.has('uploadBoxImage');
    if (needsUploadBoxImage) {
      checkCancel();
      updateStepStatus('uploadBoxImage', 'processing');
      const uploadIconOutput = await step_UploadBoxImage({
        boxImage: fileData.box_image_list[0].originFileObj as File,
        isTestMode,
      });
      currentOutputs = { ...currentOutputs, ...uploadIconOutput };
      nftStore.updateStepOutput(uploadIconOutput);
      updateStepStatus('uploadBoxImage', 'success');
    }

    // --- STEP 5: Metadata Box ---
    const needsMetadata = affectedStepsSet.has('metadataBox');
    if (needsMetadata) {
      checkCancel();
      updateStepStatus('metadataBox', 'processing');
      const metaOutput = await step_MetadataBox({
        boxInfo: boxInfoForm,
        allStepOutputs: currentOutputs,
        isTestMode,
      });
      currentOutputs = { ...currentOutputs, ...metaOutput };
      nftStore.updateStepOutput(metaOutput);
      updateStepStatus('metadataBox', 'success');
    }

    // --- STEP 6: Mint ---
    const needsMint = affectedStepsSet.has('mint');
    if (needsMint) {
      checkCancel();
      updateStepStatus('mint', 'processing');
      const mintOutput = await step_Mint({
        boxInfo: boxInfoForm,
        allStepOutputs: currentOutputs,
        writeCustorm: deps.writeCustorm,
        contractConfig: deps.contractConfig,
        decimals: deps.decimals,
        isTestMode,
      });
      currentOutputs = { ...currentOutputs, ...mintOutput };
      nftStore.updateStepOutput(mintOutput);
      updateStepStatus('mint', 'success');
    }

    // --- STEP 7: Upload Result Data ---
    const needsUploadResult = affectedStepsSet.has('uploadResultData');
    if (needsUploadResult) {
      checkCancel();
      updateStepStatus('uploadResultData', 'processing');
      const resultOutput = await step_UploadResultData({
        boxInfo: boxInfoForm,
        allStepOutputs: currentOutputs,
        isTestMode,
      });
      currentOutputs = { ...currentOutputs, ...resultOutput };
      nftStore.updateStepOutput(resultOutput);
      updateStepStatus('uploadResultData', 'success');
    }

    // Finalize
    workflowStore.completeWorkflow();
    // nftStore.resetAllCreateStore(); // REMOVED: Don't reset yet, summary modal needs this data!

  } catch (error: any) {
    if (error instanceof WorkflowCancelledError) {
      console.log('[WorkflowRunner] Workflow execution stopped by user.');
      return;
    }
    console.error('[WorkflowRunner] Error:', error);
    workflowStore.failWorkflow(error.message);
    throw error;
  }
};

function updateStepStatus(step: StepNameType, status: 'processing' | 'success' | 'error' | 'skipped') {
  const workflowStore = useCreateWorkflowStore.getState();

  if (status === 'processing') {
    workflowStore.setCurrentStep(step);
  }

  workflowStore.updateCreateProgress(`${step}_status` as any, status);

  if (status === 'success' || status === 'skipped') {
    workflowStore.addCompletedStep(step);
  }
}
