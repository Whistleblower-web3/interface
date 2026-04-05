import { AllInputFieldNames } from '../../types/stateType';
import { StepNameType, allSteps } from '../../types/workflowStateType';

export interface PlanResult {
  executionSteps: StepNameType[];
  skippableSteps: StepNameType[];
}

/**
 * Field impact mapping table
 */
export const FIELD_IMPACT_MAP: Record<AllInputFieldNames, StepNameType[]> = {
  title: ['metadataBox', 'mint', 'uploadResultData'],
  description: ['metadataBox', 'mint', 'uploadResultData'],
  type_of_crime: ['metadataBox', 'mint', 'uploadResultData'],
  label: ['metadataBox', 'mint', 'uploadResultData'],
  country: ['metadataBox', 'mint', 'uploadResultData'],
  state: ['metadataBox', 'mint', 'uploadResultData'],
  event_date: ['metadataBox', 'mint', 'uploadResultData'],
  price: ['mint', 'uploadResultData'],
  mint_method: ['compressFiles', 'uploadFiles', 'encryptData', 'metadataBox', 'mint', 'uploadResultData'],
  box_image_list: ['uploadBoxImage', 'metadataBox', 'mint', 'uploadResultData'],
  file_list: ['compressFiles', 'uploadFiles', 'encryptData', 'metadataBox', 'mint', 'uploadResultData'],
};

export function getFieldImpact(fieldId: AllInputFieldNames): StepNameType[] {
  return FIELD_IMPACT_MAP[fieldId] || [];
}


export function getAffectedSteps(changedFields: AllInputFieldNames[]): StepNameType[] {
  const affectedSteps = new Set<StepNameType>();
  changedFields.forEach(field => {
    const impact = getFieldImpact(field);
    impact.forEach(step => affectedSteps.add(step));
  });

  const orderedAffectedSteps = allSteps.filter(step => affectedSteps.has(step));
  return orderedAffectedSteps;
}

/**
 * The core logic:
 * 1. Get the steps that have not been completed + the steps affected by field changes, which are the steps to be executed.
 * 2. Exclude the steps to be executed from allSteps, and the remaining steps are the steps to be skipped.
 */
export function generateExecutionPlan(
  completedSteps: StepNameType[] = [],
  changedFields: AllInputFieldNames[] = [],
): PlanResult {
  // 1. get not completed steps
  const completedSet = new Set<StepNameType>(completedSteps);
  const notCompletedSteps = allSteps.filter(step => !completedSet.has(step));
  // 2. get steps affected by field changes
  const directlyAffected = getAffectedSteps(changedFields);

  // 3. allExecutionSteps = notCompletedSteps + directlyAffected
  const allExecutionSteps = [...new Set([...notCompletedSteps, ...directlyAffected])];

  const executionSteps = allSteps.filter(step => allExecutionSteps.includes(step));
  const skippableSteps = allSteps.filter(step => !allExecutionSteps.includes(step));

  return {
    executionSteps,
    skippableSteps,
  };
}
