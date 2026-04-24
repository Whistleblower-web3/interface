import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Space, Typography, Select, Tabs, Row, Col, Alert } from 'antd';
import { useToken, useAllTokens, TokenName } from '@/config/tokenConfig';
import { useTokenPageContext } from './context/TokenPageContext';
import TokenWrapForm from './components/TokenWrapForm';
import TokenDepositForm from './components/TokenDepositForm';
import { useTokenOperations } from './hooks/useTokenOperations';

const { Text } = Typography;
const { Option } = Select;

const SecretTokenWrap: React.FC = () => {
    const supportedTokens = useAllTokens();
    const [activeTab, setActiveTab] = useState<string>('wrap');

    const {
        tokenPairs,
        selectedPair,
        selectedPairIndex,
        setSelectedPairIndex,
        pairsWithSecretBalance,
    } = useTokenPageContext();

    const { deposit, isLoading } = useTokenOperations();

    useEffect(() => {
        if (selectedPair?.isNativeROSE) {
            setActiveTab('deposit');
        } else if (selectedPair && !selectedPair.isNativeROSE) {
            setActiveTab('wrap');
        }
    }, [selectedPair]);

    const privacyContract = useMemo(() => {
        if (!selectedPair || !selectedPair.erc20Privacy?.address) return null;

        // Find the token metadata in the supported tokens list
        const foundToken = supportedTokens.find(
            (t) => t.address.toLowerCase() === selectedPair.erc20Privacy!.address.toLowerCase()
        );

        if (foundToken) return foundToken;

        // Fallback for wROSE if not found by address
        if (selectedPair.isNativeROSE) {
            return supportedTokens.find(t => t.tokenName === TokenName.WROSE_PRIVACY) || null;
        }

        return null;
    }, [selectedPair, supportedTokens]);

    const handleDeposit = useCallback(
        async (amount: string) => {
            if (!selectedPair || !selectedPair.erc20Privacy?.address) return;
            try {
                await deposit(selectedPair.erc20Privacy?.address, amount, selectedPair.erc20.decimals);
            } catch (error) {
                console.error('Deposit error:', error);
            }
        },
        [deposit, selectedPair]
    );

    if (!selectedPair) {
        return (
            <Card style={{ marginTop: '24px' }}>
                <Alert type="info" message="Please select a token pair to perform operations." showIcon />
            </Card>
        );
    }

    const tabItems: { key: string; label: string; children: React.ReactNode }[] = [];

    if (!selectedPair.isNativeROSE) {
        tabItems.push(
            {
                key: 'wrap',
                label: 'Wrap',
                children: (
                    <TokenWrapForm
                        tokenPairs={tokenPairs}
                        selectedPairIndex={selectedPairIndex}
                        onPairChange={setSelectedPairIndex}
                        isLoading={isLoading}
                    />
                ),
            },
        );
    } else {
        tabItems.push(
            {
                key: 'deposit',
                label: 'Deposit',
                children: (
                    <TokenDepositForm
                        selectedPair={selectedPair}
                        onDeposit={handleDeposit}
                        isLoading={isLoading}
                    />
                ),
            }
        );
    }

    return (
        <Card style={{ marginTop: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Col>
                    <Row align="middle">
                        <Text strong style={{ marginRight: '8px' }}>Select Token Pair: </Text>
                        <Select
                            value={selectedPairIndex}
                            onChange={setSelectedPairIndex}
                            style={{ width: '100%', maxWidth: '400px' }}
                            disabled={isLoading}
                        >
                            {tokenPairs.map((pair, index) => (
                                <Option key={index} value={index}>
                                    {pair.erc20.symbol}{pair.isNativeROSE && ' (Native ROSE)'} - {pair.erc20Privacy?.symbol || `${pair.erc20.symbol}.S`}
                                </Option>
                            ))}
                        </Select>
                    </Row>
                    <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
                        <Text strong>
                            {selectedPair.erc20.name} ({selectedPair.erc20.symbol})
                            {selectedPair.erc20Privacy && ` -> ${selectedPair.erc20Privacy.name} (${selectedPair.erc20Privacy.symbol})`}
                        </Text>
                        {selectedPair.erc20?.address && (
                            <Text type="secondary" copyable>
                                ERC20: {selectedPair.erc20?.address}
                            </Text>
                        )}
                        {selectedPair.erc20Privacy?.address && (
                            <Text type="secondary" copyable>
                                Secret: {selectedPair.erc20Privacy?.address}
                            </Text>
                        )}
                    </Space>
                </Col>

                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

                {selectedPair && !privacyContract && (
                    <Alert
                        type="warning"
                        message="Secret contract configuration not found for this token pair. Please check contract configuration."
                        showIcon
                    />
                )}
            </Space>
        </Card>
    );
};

export default SecretTokenWrap;
