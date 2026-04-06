import React from 'react';
import { Modal, Button, Typography, Space, } from 'antd';
import {
    SafetyCertificateOutlined,
    EnvironmentOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { ChainConfig } from '@dapp/config/chainConfig';
import ParagraphList from './ParagraphList';

const { Title, Text } = Typography;

export interface DataType_Completed {
    title: string;
    type_of_crime: string;
    country: string;
    state: string;
    event_date: string;
    transaction_hash: string;
    create_date: string;
}

interface ModalProps {
    data: DataType_Completed;
    chainConfig: ChainConfig;
    onClose: () => void;
}

const ModalDialogCompleted: React.FC<ModalProps> = ({ data, chainConfig, onClose }) => {


    const handleViewOnExplorer = () => {
        if (!data.transaction_hash) return;
        const explorerUrl = chainConfig.blockExplorers.default.url + '/tx/' + data.transaction_hash;
        window.open(explorerUrl, '_blank');
    };

    const handleDone = () => {
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
                            {data.title}
                        </div>

                        <div className='grid grid-cols-2 gap-3 md:gap-4'>
                            <div>
                                <Space size={4} style={{ marginBottom: 4 }}><SafetyCertificateOutlined /><Text type="secondary" style={{ fontSize: 12 }}>Category</Text></Space>
                                <div><Text strong>{data.type_of_crime}</Text></div>
                            </div>
                            <div>
                                <Space size={4} style={{ marginBottom: 4 }}><EnvironmentOutlined /><Text type="secondary" style={{ fontSize: 12 }}>Location</Text></Space>
                                <div><Text strong>{data.country}</Text></div>
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

                    <hr className='w-full border-white/10 my-2 md:my-4' />

                    {/* Transaction Section */}
                    <div>
                        <div className='flex items-center justify-between'>
                            <Text strong style={{ fontSize: 13 }}>Transaction Record</Text>
                            <Button type="link" size="small" onClick={handleViewOnExplorer} style={{ padding: 0 }}>
                                View Explorer <ArrowRightOutlined style={{ fontSize: 10 }} />
                            </Button>
                        </div>
                        <ParagraphList
                            label='Transaction Hash'
                            type='text'
                            cidList={[data.transaction_hash || '0x0']}
                        />
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

export default ModalDialogCompleted;
