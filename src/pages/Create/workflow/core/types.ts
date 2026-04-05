import { StepNameType } from "@Create/types/workflowStateType";
import { AllStepOutputs } from "@Create/types/stepType";

/**
 * NFT Creation Process Specific Data Types
 */
export interface WorkflowInitialData {
  // Basic Info
  boxInfo: {
    title: string;
    description: string;
    label: string[];
    country: string;
    state: string;
    type_of_crime: string;
    event_date: string;
    price: string;
    mint_method: 'create' | 'createAndPublish';
  };
  
  // File Data
  files: File[];
  boxImages: File[];
  isTestMode: boolean;
}

export type WorkflowPayload = WorkflowInitialData & {
  all_step_outputs: AllStepOutputs;
};

/**
 * Simple Cancellation Exception
 */
export class WorkflowCancelledError extends Error {
  constructor(message = 'Workflow was cancelled by user') {
    super(message);
    this.name = 'WorkflowCancelledError';
  }
}
