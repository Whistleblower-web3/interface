import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  BoxInfoFormType,
  initialBoxInfoForm,
  AllInputFieldNames,
} from '../types/stateType';
import {
  CompressFilesOutput,
  UploadFilesOutput,
  EncryptDataOutput,
  UploadBoxImageOutput,
  CreateNFTImageOutput,
  UploadNFTImageOutput,
  MetadataBoxOutput,
  MetadataNFTOutput,
  MintOutput,
  UploadResultDataOutput,
  AllStepOutputs,
  createInitialAllStepOutputs,
} from '../types/stepType';
import type { UploadFile } from 'antd/es/upload/interface';

// NFT Creation Process State Type
interface NFTCreateState {
  // Input data-------
  fileData: {
    file_list: UploadFile[];
    box_image_list: UploadFile[];
  };
  boxInfoForm: BoxInfoFormType;
  isTestMode:boolean; // Whether in test mode
  // ---------input change tracking-------
  changedFields: AllInputFieldNames[];
  baselineVersion: number;

  // ------ Workflow Generated Data --------
  all_step_outputs: AllStepOutputs;
}

// Define State Modification Methods
interface NFTCreateActions {
  // File Management
  updateFileList: (fileList: UploadFile[]) => void;
  updateBoxImageList: (boxImageList: UploadFile[]) => void;
  updateBoxInfoForm: (field: keyof BoxInfoFormType, value: any) => void;
  setChangedFields: (fields: AllInputFieldNames[]) => void;
  // Workflow Generated Data
  updateCompressFilesOutput: (compressFilesOutput: CompressFilesOutput) => void;
  updateUploadFilesOutput: (uploadFilesOutput: UploadFilesOutput) => void;
  updateEncryptDataOutput: (encryptDataOutput: EncryptDataOutput) => void;
  updateUploadBoxImageOutput: (uploadBoxImageOutput: UploadBoxImageOutput) => void;
  updateCreateNFTImageOutput: (createNFTImageOutput: CreateNFTImageOutput) => void;
  updateUploadNFTImageOutput: (uploadNFTImageOutput: UploadNFTImageOutput) => void;
  updateMetadataBoxOutput: (metadataBoxOutput: MetadataBoxOutput) => void;
  updateMetadataNFTOutput: (metadataNFTOutput: MetadataNFTOutput) => void;
  updateMintOutput: (mintOutput: MintOutput) => void;
  updateUploadResultDataOutput: (uploadResultDataOutput: UploadResultDataOutput) => void;


  // Reset
  resetAllCreateStore: () => void;
  markBaseline: () => void;
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
  isTestMode: false,
  // Changed fields list (fine-grained tracking)
  changedFields: [],
  baselineVersion: 0,
  all_step_outputs: createInitialAllStepOutputs(),
};

// Create Store
export const useNFTCreateStore = create<NFTCreateStore>()(
  devtools(
    (set) => ({
      ...initialState,
      // File Management Methods
      updateFileList: (file_list) =>
        set((state) => ({
          fileData: { ...state.fileData, file_list }
        }), false, 'updateFileList'),

      updateBoxImageList: (box_image_list) =>
        set((state) => ({
          fileData: { ...state.fileData, box_image_list }
        }), false, 'updateBoxImageList'),

      // BoxInfo Update Methods
      updateBoxInfoForm: (field, value) =>
        set((state) => ({
          boxInfoForm: { ...state.boxInfoForm, [field]: value }
        }), false, 'updateBoxInfoForm'),

      setChangedFields: (fields: AllInputFieldNames[]) =>
        set((state) => ({
          ...state,
          changedFields: fields,
        }), false, 'setChangedFields'),

      updateCompressFilesOutput: (compressFilesOutput: CompressFilesOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...compressFilesOutput }
        }), false, 'updateCompressFilesOutput'),

      updateUploadFilesOutput: (uploadFilesOutput: UploadFilesOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...uploadFilesOutput }
        }), false, 'updateUploadFilesOutput'),

      updateEncryptDataOutput: (encryptDataOutput: EncryptDataOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...encryptDataOutput }
        }), false, 'updateEncryptDataOutput'),

      updateUploadBoxImageOutput: (uploadBoxImageOutput: UploadBoxImageOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...uploadBoxImageOutput }
        }), false, 'updateUploadBoxImageOutput'),

      updateCreateNFTImageOutput: (createNFTImageOutput: CreateNFTImageOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...createNFTImageOutput }
        }), false, 'updateCreateNFTImageOutput'),

      updateUploadNFTImageOutput: (uploadNFTImageOutput: UploadNFTImageOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...uploadNFTImageOutput }
        }), false, 'updateUploadNFTImageOutput'),

      updateMetadataBoxOutput: (metadataBoxOutput: MetadataBoxOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...metadataBoxOutput }
        }), false, 'updateMetadataBoxOutput'),

      updateMetadataNFTOutput: (metadataNFTOutput: MetadataNFTOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...metadataNFTOutput }
        }), false, 'updateMetadataNFTOutput'),

      updateMintOutput: (mintOutput: MintOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...mintOutput }
        }), false, 'updateMintOutput'),

      updateUploadResultDataOutput: (uploadResultDataOutput: UploadResultDataOutput) =>
        set((state) => ({
          all_step_outputs: { ...state.all_step_outputs, ...uploadResultDataOutput }
        }), false, 'updateUploadResultDataOutput'),

      resetAllCreateStore: () =>
        set((state) => ({
          fileData: {
            file_list: [],
            box_image_list: [],
          },
          boxInfoForm: initialBoxInfoForm,
          changedFields: [],
          baselineVersion: state.baselineVersion + 1,
          all_step_outputs: createInitialAllStepOutputs(),
        }), false, 'resetAllCreateStore'),

      markBaseline: () =>
        set((state) => ({
          baselineVersion: state.baselineVersion + 1,
        }), false, 'markBaseline'),

    }),
    { name: 'nft-create-store' }
  )
); 
