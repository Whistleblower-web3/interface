import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Progress } from 'antd';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import ResultItem from '@/components/base/ResultItem';
import { useCreateWorkflow } from '../hooks/useCreateWorkflow';

interface ModalProps {
    onClose: () => void;
    onNext?: () => void;
}

const ModalDialogMintProgress: React.FC<ModalProps> = ({ onClose, onNext }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [retryLoading, setRetryLoading] = useState(false);

    const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
    const mintProgress = useCreateWorkflowStore(state => state.createProgress);
    const { run: startWorkflow } = useCreateWorkflow();

    // Use useRef to ensure execution only once on mount
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        startWorkflow();
    }, [startWorkflow]);

    const cancelWorkflow = useCreateWorkflowStore(state => state.cancelWorkflow);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const handleStop = () => {
        cancelWorkflow();
        setIsOpen(false);
        onClose();
    };

    const handleNext = () => {
        onNext?.();
        setIsOpen(false);
    };

    const handleRetry = async () => {
        if (workflowStatus === 'error') {
            setRetryLoading(true);
            await startWorkflow();
            setRetryLoading(false);
        }
    };

    /**
     * render the progress items with the new 'isSkipped' support
     */
    const renderProgressItems = () => {
        return (
            <div className="mt-4 space-y-3">
                <ResultItem
                    title="Compress Files"
                    isLoading={mintProgress.compressFiles_status === 'processing'}
                    isComplete={mintProgress.compressFiles_status === 'success'}
                    isSkipped={mintProgress.compressFiles_status === 'skipped'}
                    error={mintProgress.compressFiles_Error}
                />
                <ResultItem
                    title="Upload Main Files"
                    isLoading={mintProgress.uploadFiles_status === 'processing'}
                    isComplete={mintProgress.uploadFiles_status === 'success'}
                    isSkipped={mintProgress.uploadFiles_status === 'skipped'}
                    error={mintProgress.uploadFiles_Error}
                />
                <ResultItem
                    title="Encrypt Data"
                    isLoading={mintProgress.encryptData_status === 'processing'}
                    isComplete={mintProgress.encryptData_status === 'success'}
                    isSkipped={mintProgress.encryptData_status === 'skipped'}
                    error={mintProgress.encryptData_Error}
                />
                <ResultItem
                    title="Upload Box Image"
                    isLoading={mintProgress.uploadBoxImage_status === 'processing'}
                    isComplete={mintProgress.uploadBoxImage_status === 'success'}
                    isSkipped={mintProgress.uploadBoxImage_status === 'skipped'}
                    error={mintProgress.uploadBoxImage_Error}
                />
                <ResultItem
                    title="Generate Metadata"
                    isLoading={mintProgress.metadataBox_status === 'processing'}
                    isComplete={mintProgress.metadataBox_status === 'success'}
                    isSkipped={mintProgress.metadataBox_status === 'skipped'}
                    error={mintProgress.metadataBox_Error}
                />
                <ResultItem
                    title="Mint on Blockchain"
                    isLoading={mintProgress.mint_status === 'processing'}
                    isComplete={mintProgress.mint_status === 'success'}
                    isSkipped={mintProgress.mint_status === 'skipped'}
                    error={mintProgress.mint_Error}
                />
            </div>
        );
    };

    /**
     * calculate the total progress (count success and skipped as completed)
     */
    function calculateTotalProgress(): number {
        const statuses = [
            mintProgress.compressFiles_status,
            mintProgress.uploadFiles_status,
            mintProgress.encryptData_status,
            mintProgress.uploadBoxImage_status,
            mintProgress.metadataBox_status,
            mintProgress.mint_status
        ];

        const completedCount = statuses.filter(s => s === 'success' || s === 'skipped').length;
        return Math.round((completedCount / statuses.length) * 100);
    }

    return (
        <Modal
            title="Create Truth Box"
            open={isOpen}
            closable={workflowStatus !== 'processing'}
            onCancel={handleClose}
            maskClosable={false}
            destroyOnHidden={true}
            footer={[
                <Button
                    key="stop"
                    onClick={handleStop}
                    disabled={workflowStatus === 'success'}
                >
                    Stop
                </Button>,
                <Button
                    key="retry"
                    type="primary"
                    danger
                    onClick={handleRetry}
                    loading={retryLoading}
                    disabled={workflowStatus !== 'error'}
                >
                    Retry
                </Button>,
                <Button
                    key="next"
                    type="primary"
                    onClick={handleNext}
                    disabled={workflowStatus !== 'success'}
                >
                    Complete
                </Button>
            ]}
            width={520}
        >
            <div className="mb-6">
                <Progress
                    percent={workflowStatus === 'success' ? 100 : calculateTotalProgress()}
                    status={
                        workflowStatus === 'success' ? 'success' :
                            workflowStatus === 'error' ? 'exception' :
                                'active'
                    }
                />
            </div>

            {renderProgressItems()}
        </Modal>
    );
}

export default ModalDialogMintProgress;