import React from 'react';
import { Modal, Button, message, Typography, Space, Divider, Card } from 'antd';
import {
    CopyOutlined,
    SafetyCertificateOutlined,
    EnvironmentOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNFTCreateStore } from '../store/useNFTCreateStore';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useTanStackForm } from '../context/TanStackFormContext';
import { initialBoxInfoForm } from '../types/stateType';
import { useChainConfig } from '@dapp/config/chainConfig';

const { Title, Text } = Typography;

interface ModalProps {
    onClose: () => void;
    onNext?: () => void;
}

const ModalDialogCompletedCreate: React.FC<ModalProps> = ({ onClose }) => {
    const workflowStore = useCreateWorkflowStore();
    const createStore = useNFTCreateStore();
    const form = useTanStackForm();
    const chainConfig = useChainConfig();

    const boxInfo = createStore.boxInfoForm;
    const all_step_outputs = createStore.all_step_outputs;

    const transactionHash = all_step_outputs.transaction_hash || '';
    const createDate = all_step_outputs.current_time?.create_date || '';

    const handleCopyTxHash = () => {
        if (!transactionHash) return;
        navigator.clipboard.writeText(transactionHash);
        message.success('Transaction hash copied!');
    };

    const handleViewOnExplorer = () => {
        if (!transactionHash) return;
        const explorerUrl = chainConfig.blockExplorers.default.url + '/tx/' + transactionHash;
        window.open(explorerUrl, '_blank');
    };

    const handleDone = () => {
        form.reset({
            title: initialBoxInfoForm.title,
            description: initialBoxInfoForm.description,
            type_of_crime: initialBoxInfoForm.type_of_crime,
            label: [...initialBoxInfoForm.label],
            country: initialBoxInfoForm.country,
            state: initialBoxInfoForm.state,
            event_date: initialBoxInfoForm.event_date,
            price: initialBoxInfoForm.price,
            mint_method: initialBoxInfoForm.mint_method,
            box_image_list: [],
            file_list: [],
        } as any);

        createStore.resetAllCreateStore();
        workflowStore.resetAllWorkflowStore();
        onClose();
    };

    return (
        <Modal
            open={true}
            closable={false}
            maskClosable={false}
            footer={null}
            width={480}
            centered
        >
            <div style={{
                textAlign: 'center',
                borderRadius: '8px 8px 0 0'
            }}>
                <Title type="success" level={2} >Creation Success!</Title>
                <Text type="secondary">Your truth box is now secured on the blockchain.</Text>
            </div>

            <div className='mt-4'>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* Main Info Card */}
                    <div className='p-3 md:p-4 rounded-md md:rounded-lg bg-primary/5 border border-primary/10 space-y-3 md:space-y-4'>
                        <div className='text-base md:text-lg text-white/80 line-clamp-3'>
                            {boxInfo.title}
                        </div>

                        <div className='grid grid-cols-2 gap-3 md:gap-4'>
                            <div>
                                <Space size={4} style={{ marginBottom: 4 }}><SafetyCertificateOutlined /><Text type="secondary" style={{ fontSize: 12 }}>Category</Text></Space>
                                <div><Text strong>{boxInfo.type_of_crime}</Text></div>
                            </div>
                            <div>
                                <Space size={4} style={{ marginBottom: 4 }}><EnvironmentOutlined /><Text type="secondary" style={{ fontSize: 12 }}>Location</Text></Space>
                                <div><Text strong>{boxInfo.country}</Text></div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info */}
                    <div className='flex items-center justify-between'>
                        <Space size={4}>
                            <Text type="success" style={{ fontSize: 13 }}>
                                Network: {chainConfig.name}
                            </Text>
                        </Space>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* Transaction Section */}
                    <div>
                        <div className='flex items-center justify-between'>
                            <Text strong style={{ fontSize: 13 }}>Transaction Record</Text>
                            <Button type="link" size="small" onClick={handleViewOnExplorer} style={{ padding: 0 }}>
                                View Explorer <ArrowRightOutlined style={{ fontSize: 10 }} />
                            </Button>
                        </div>
                        <div className='flex items-center justify-between'>
                            <Text code ellipsis style={{ maxWidth: '80%', margin: 0, background: 'transparent' }}>
                                {transactionHash || '0x0'}
                            </Text>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={handleCopyTxHash}
                            />
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={handleDone}
                    >
                        Done
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default ModalDialogCompletedCreate;
