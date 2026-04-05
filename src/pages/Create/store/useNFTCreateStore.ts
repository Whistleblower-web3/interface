import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  BoxInfoFormType,
  initialBoxInfoForm,
  AllInputFieldNames,
} from '../types/stateType';
import {
  AllStepOutputs,
  createInitialAllStepOutputs,
} from '../types/stepType';
import type { UploadFile } from 'antd/es/upload/interface';

/**
 * Snapshot of inputs to determine if a workflow step needs re-running
 */
export interface WorkflowInputSnapshot {
  boxInfoForm: BoxInfoFormType;
  fileListUid: string;       // Condensed string of file UIDs + Size
  boxImageUid: string;      // Condensed string of box image UID + Size
}

// NFT Creation Process State Type
interface NFTCreateState {
  // Input data
  fileData: {
    file_list: UploadFile[];
    box_image_list: UploadFile[];
  };
  boxInfoForm: BoxInfoFormType;
  isTestMode: boolean;

  // Generated Data
  all_step_outputs: AllStepOutputs;

  // Snapshots for optimization (Smart Skip)
  baselineInputs: Partial<WorkflowInputSnapshot>;
  changedFields: AllInputFieldNames[];
  baselineVersion: number;
}

// Define State Modification Methods
interface NFTCreateActions {
  // Batch update for file data
  updateFileData: (data: Partial<NFTCreateState['fileData']>) => void;
  // Batch update for box info form
  setBoxInfoForm: (data: Partial<BoxInfoFormType>) => void;

  // Workflow Generated Data Updates
  updateStepOutput: (output: Partial<AllStepOutputs>) => void;
  setBaselineInputs: (snapshot: Partial<WorkflowInputSnapshot>) => void;
  setChangedFields: (fields: AllInputFieldNames[]) => void;
  commitBaseline: () => void;

  // Reset
  resetAllCreateStore: () => void;
}

// Combine State and Actions
type NFTCreateStore = NFTCreateState & NFTCreateActions;

// Initial State
const initialState: NFTCreateState = {
  fileData: {
    file_list: [],
    box_image_list: [],
  },
  boxInfoForm: initialBoxInfoForm,
  isTestMode: import.meta.env.VITE_CREATE_TEST_MODE === 'true',
  all_step_outputs: createInitialAllStepOutputs(),
  baselineInputs: {},
  changedFields: [],
  baselineVersion: 0,
};

// Create Store
export const useNFTCreateStore = create<NFTCreateStore>()(
  devtools(
    (set) => ({
      ...initialState,

      updateFileData: (info) =>
        set((state) => ({
          fileData: { ...state.fileData, ...info }
        }), false, 'updateFileData'),

      setBoxInfoForm: (info) =>
        set((state) => ({
          boxInfoForm: { ...state.boxInfoForm, ...info }
        }), false, 'setBoxInfoForm'),

      updateStepOutput: (output) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...output }
        }), false, 'updateStepOutput'),

      setBaselineInputs: (snapshot) =>
        set((state) => ({
          baselineInputs: snapshot
        }), false, 'setBaselineInputs'),

      setChangedFields: (fields) =>
        set((state) => ({
          changedFields: fields
        }), false, 'setChangedFields'),

      commitBaseline: () =>
        set((state) => {
          const currentSnapshot: WorkflowInputSnapshot = {
            boxInfoForm: { ...state.boxInfoForm },
            fileListUid: state.fileData.file_list.map(f => (f as any).uid || `${f.name}-${f.size}`).join(','),
            boxImageUid: state.fileData.box_image_list.length > 0 ? (state.fileData.box_image_list[0] as any).uid || `${state.fileData.box_image_list[0].name}-${state.fileData.box_image_list[0].size}` : '',
          };
          return {
            baselineInputs: currentSnapshot,
            changedFields: [], // Reset change tracking after committing baseline
            baselineVersion: state.baselineVersion + 1
          };
        }, false, 'commitBaseline'),

      resetAllCreateStore: () =>
        set(() => ({
          ...initialState,
        }), false, 'resetAllCreateStore'),

    }),
    { name: 'nft-create-store-v2' }
  )
);
