import { useCallback } from 'react';
import { useWriteCustorm } from '@/hooks/useWriteCustorm';
import { useContract, ContractName } from '@/config/contractsConfig';
import { executeCreateWorkflow } from '../workflow/core/createWorkflowRunner';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { message } from 'antd';

/**
 * Hook to run the Create Truth Box workflow
 */
export const useCreateWorkflow = () => {
    const { writeCustorm } = useWriteCustorm();
    const truthBoxContract = useContract(ContractName.TRUTH_BOX);
    const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);

    const run = useCallback(async () => {
        if (workflowStatus === 'processing') return;

        try {
            await executeCreateWorkflow({
                writeCustorm,
                contractConfig: truthBoxContract,
                decimals: 18, // Default decimals for TruthBox
            });
            // message.success('Truth Box created successfully!'); // REMOVED
        } catch (error: any) {
            console.error('[useCreateWorkflow] Failed:', error);
            message.error(`Creation failed: ${error.message || 'Unknown error'}`);
        }
    }, [writeCustorm, workflowStatus]);

    return {
        run,
        isProcessing: workflowStatus === 'processing',
    };
};
