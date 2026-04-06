import { useEffect } from 'react';
import { useStore } from '@tanstack/react-form';
import { useNFTCreateStore, WorkflowInputSnapshot } from '../store/useNFTCreateStore';
import { AllInputFieldNames, BOX_INFO_FIELDS } from '../types/stateType';
import { FormApi } from '@tanstack/react-form';

/**
 * useInputChangeTracker
 * 
 * Real-time comparison between current form values and the baseline (locked at workflow start).
 * Updates changedFields in the NFTCreateStore.
 */
export const useInputChangeTracker = (form: any) => {
    const nftStore = useNFTCreateStore();
    const values = useStore(form.store, (state: any) => state.values);
    const baseline = nftStore.baselineInputs;

    useEffect(() => {
        // If no baseline exists, it means we haven't started any workflow yet (or it's fully finished).
        // In this case, changedFields should be empty as there's nothing to "restart" or "skip".
        if (!baseline || !baseline.boxInfoForm) {
            if (nftStore.changedFields.length > 0) {
                nftStore.setChangedFields([]);
            }
            return;
        }

        const changed: AllInputFieldNames[] = [];

        // 1. Check Box Info Fields
        BOX_INFO_FIELDS.forEach((field) => {
            const currentVal = (values as any)[field];
            const baselineVal = (baseline.boxInfoForm as any)[field];

            if (!isEqual(currentVal, baselineVal)) {
                changed.push(field);
            }
        });

        // 2. Check File List
        const currentFileListUid = (values.file_list || []).map((f: any) => f.uid || `${f.name}-${f.size}`).join(',');
        if (currentFileListUid !== baseline.fileListUid) {
            changed.push('file_list');
        }

        // 3. Check Box Image
        const currentBoxImageUid = (values.box_image_list || []).length > 0 
            ? (values.box_image_list[0] as any).uid || `${values.box_image_list[0].name}-${values.box_image_list[0].size}` 
            : '';
        if (currentBoxImageUid !== baseline.boxImageUid) {
            changed.push('box_image_list');
        }

        // Update if different
        const sortedChanged = [...changed].sort();
        const sortedStoreChanged = [...nftStore.changedFields].sort();
        
        if (JSON.stringify(sortedChanged) !== JSON.stringify(sortedStoreChanged)) {
            nftStore.setChangedFields(changed);
        }
    }, [values, baseline, nftStore.setChangedFields]);
};

/**
 * Deep equality helper for arrays and primitives
 */
function isEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((val, index) => isEqual(val, b[index]));
    }
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
}
