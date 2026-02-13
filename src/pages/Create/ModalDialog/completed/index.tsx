import React from 'react';
import { Modal, Button, message, Tag, Descriptions, Typography, Space, Alert } from 'antd';
import { CheckCircleOutlined, CopyOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNFTCreateStore } from '../../store/useNFTCreateStore';
import { useCreateWorkflowStore } from '../../store/useCreateWorkflowStore';
import { useCreateForm } from '../../context/CreateFormContext';
import { initialBoxInfoForm } from '../../types/stateType';
import { testBox } from '@dapp/store/testBox';
import { useChainConfig } from '@dapp/config/contractsConfig';

const { Title, Text } = Typography;

interface ModalProps {
    onClose: () => void;
    onNext?: () => void;
}


const ModalDialogCompletedCreate: React.FC<ModalProps> = ({ onClose, onNext }) => {
    const workflowStore = useCreateWorkflowStore();
    const createStore = useNFTCreateStore();
    const form = useCreateForm();

    const chainConfig = useChainConfig();

    // Get form data
    const boxInfo = createStore.boxInfoForm;
    const all_step_outputs = createStore.all_step_outputs;
    const isTestMode = createStore.isTestMode;

    // Get transaction hash
    const transactionHash = all_step_outputs.transaction_hash || '';

    // Get time info
    const createDate = all_step_outputs.current_time?.create_date || '';

    /**
     * Copy transaction hash
     */
    const handleCopyTxHash = () => {
        if (!transactionHash) return;
        navigator.clipboard.writeText(transactionHash);
        message.success('Transaction hash copied!');
    };

    /**
     * Open blockchain explorer
     */
    const handleViewOnExplorer = () => {
        if (!transactionHash) return;
        // TODO: Select correct explorer URL based on network
        const explorerUrl = chainConfig.blockExplorers.default.url + '/tx/' + transactionHash;
        // const explorerUrl = `https://explorer.emerald.oasis.dev/tx/${transactionHash}`;
        window.open(explorerUrl, '_blank');
    };


    /**
     * Complete creation and reset all data
     */
    const handleDone = () => {
        form.reset({
            title: initialBoxInfoForm.title,
            description: initialBoxInfoForm.description,
            type_of_crime: initialBoxInfoForm.type_of_crime,
            label: [...initialBoxInfoForm.label],
            country: initialBoxInfoForm.country,
            state: initialBoxInfoForm.state,
            event_date: initialBoxInfoForm.event_date,
            nft_owner: initialBoxInfoForm.nft_owner,
            price: initialBoxInfoForm.price,
            mint_method: initialBoxInfoForm.mint_method,
            box_image_list: [],
            file_list: [],
        });

        createStore.resetAllCreateStore();
        workflowStore.resetAllWorkflowStore();
        onClose();
    };

    return (
        <Modal
            title={
                <Space>
                    <CheckCircleOutlined style={{ fontSize: 24 }} />
                    <span>Creation Successful</span>
                </Space>
            }
            open={true}
            closable={false}
            maskClosable={false}
            footer={[
                <Button key="done" type="primary" size="middle" onClick={handleDone}>
                    Done
                </Button>
            ]}
            width={520}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Success Alert */}
                <Alert
                    message="Your truth box has been successfully created and minted on the blockchain!"
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                    style={{ marginTop: 10 }}
                />

                {/* Box Info */}
                <div>
                    <Title level={5} style={{ marginBottom: 16 }}>Box Information</Title>
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Title" span={2}>
                            <Text>{isTestMode ? testBox.title : boxInfo.title || 'N/A'}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Type of Crime">
                            <Text>{isTestMode ? testBox.type_of_crime : boxInfo.type_of_crime || 'N/A'}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Country">
                            <Space>
                                <GlobalOutlined />
                                <Text>{isTestMode ? testBox.country : boxInfo.country || 'N/A'}</Text>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="State">
                            <Text>{isTestMode ? testBox.state : boxInfo.state}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Event Date">
                            <Text>{isTestMode ? testBox.event_date : boxInfo.event_date}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Create Date">
                            <Text>{isTestMode ? testBox.create_date : createDate}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                <div>
                    <Title level={5} style={{ marginBottom: 12 }}>Transaction Hash</Title>
                    <Space.Compact block>
                        <Text code style={{ flex: 1, wordBreak: 'break-all' }}>
                            {isTestMode ? testBox.nft_image : transactionHash}
                        </Text>
                        <Button 
                            icon={<CopyOutlined />} 
                            onClick={handleCopyTxHash}
                            title="Copy"
                        />
                        <Button 
                            onClick={handleViewOnExplorer}
                            title="View on explorer"
                        >
                            View
                        </Button>
                    </Space.Compact>
                </div>

            </Space>
        </Modal>
    );
};

export default ModalDialogCompletedCreate;
