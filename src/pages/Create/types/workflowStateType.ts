export interface MintProgressType {
    compressFiles_Progress: number;
    uploadFiles_Progress: number;
    encryptData_Progress: number;
    uploadBoxImage_Progress: number;
    metadataBox_Progress: number;
    mint_Progress: number;
    uploadResultData_Progress: number;
}

// Define step name type
export type StepNameType =
    'compressFiles' |
    'uploadFiles' |
    'encryptData' |
    'uploadBoxImage' |
    'metadataBox' |
    'mint' |
    'uploadResultData';

// All steps: in index order
export const allSteps: StepNameType[] = [
    'compressFiles', 'uploadFiles', 'encryptData',
    'uploadBoxImage', 'metadataBox', 'mint', 'uploadResultData'
];

export type StepStatus = 'pending' | 'processing' | 'success' | 'error' | 'skipped';
export type WorkflowStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';

/**
 * Mapped type for all step-specific status and error fields
 */
export type StepStateFields = {
    [K in StepNameType as `${K}_status`]: StepStatus;
} & {
    [K in StepNameType as `${K}_Error`]: string;
};

export interface ExtendedMintProgressType extends MintProgressType, StepStateFields { }
