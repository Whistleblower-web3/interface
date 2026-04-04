import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Space, Typography, Select, Tabs, Row, Col, Alert } from 'antd';
import { useSupportedTokens, TokenName } from '@/config/tokenConfig';
import TokenUnwrapForm from './components/TokenUnwrapForm';
import TokenWithdrawForm from './components/TokenWithdrawForm';
import { useTokenOperations } from './hooks/useTokenOperations';
import { useTokenPairs2 } from './hooks/useTokenPairs2';
import { type TokenPair } from './types';

const { Text } = Typography;
const { Option } = Select;

const SecretTokenUnWrap: React.FC = () => {
    const supportedTokens = useSupportedTokens();
    const [activeTab, setActiveTab] = useState<string>('unwrap');
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

    const { tokenPairs } = useTokenPairs2();
    const { withdraw, unwrap, isLoading } = useTokenOperations();

    // Current selected token pair
    const selectedPair: TokenPair | null = useMemo(() => {
        return tokenPairs[selectedPairIndex] || null;
    }, [tokenPairs, selectedPairIndex]);

    // When tokenPairs changes, reset selectedPairIndex
    useEffect(() => {
        if (tokenPairs.length > 0 && selectedPairIndex >= tokenPairs.length) {
            setSelectedPairIndex(0);
        }
    }, [tokenPairs, selectedPairIndex]);

    // Set default tab based on selected token pair
    useEffect(() => {
        if (selectedPair?.isNativeROSE) {
            setActiveTab('withdraw');
        } else {
            setActiveTab('unwrap');
        }
    }, [selectedPair]);

    // Get Secret contract configuration
    const privacyContract = useMemo(() => {
        if (!selectedPair || !selectedPair.erc20Privacy?.address) return null;

        // Find the token metadata in the supported tokens list
        const foundToken = supportedTokens.find(
            (t) => t.address.toLowerCase() === selectedPair.erc20Privacy!.address.toLowerCase()
        );

        if (foundToken) return foundToken;

        // Fallback or explicit TokenName usage
        if (selectedPair.isNativeROSE) {
            return supportedTokens.find(t => t.tokenName === TokenName.WROSE_PRIVACY) || null;
        } else {
            return supportedTokens.find(t => t.tokenName === TokenName.OFFICIAL_TOKEN_PRIVACY) || null;
        }
    }, [selectedPair, supportedTokens]);

    // Withdraw operation: wROSE.S -> Native ROSE
    const handleWithdraw = useCallback(
        async (tokenAddress: `0x${string}`, amount: string) => {
            if (!selectedPair || !selectedPair.erc20Privacy?.address) return;
            try {
                await withdraw(selectedPair.erc20Privacy.address as `0x${string}`, amount, selectedPair.erc20Privacy.decimals);
            } catch (error) {
                console.error('Withdraw error:', error);
            }
        },
        [withdraw, selectedPair]
    );

    // Unwrap operation: Secret Token -> ERC20
    const handleUnwrap = useCallback(
        async (tokenAddress: `0x${string}`, amount: string) => {
            if (!selectedPair || !selectedPair.erc20Privacy?.address) return;
            try {
                await unwrap(selectedPair.erc20Privacy.address as `0x${string}`, amount, selectedPair.erc20Privacy.decimals);
            } catch (error) {
                console.error('Unwrap error:', error);
            }
        },
        [unwrap, selectedPair]
    );

    if (!selectedPair || tokenPairs.length === 0) {
        return (
            <Card style={{ marginTop: '24px' }}>
                <Alert type="info" message="Please select a token pair to perform operations." showIcon />
            </Card>
        );
    }

    // Build Tab items
    const tabItems: { key: string; label: string; children: React.ReactNode }[] = [];

    if (!selectedPair.isNativeROSE) {
        // Non-native ROSE: only Unwrap option (Secret Token -> ERC20)
        tabItems.push({
            key: 'unwrap',
            label: 'Unwrap',
            children: (
                <TokenUnwrapForm
                    selectedPair={selectedPair}
                    onUnwrap={handleUnwrap}
                    isLoading={isLoading}
                />
            ),
        });
    } else {
        // Native ROSE: has Unwrap and Withdraw two options
        tabItems.push(
            {
                key: 'withdraw',
                label: 'Withdraw',
                children: (
                    <TokenWithdrawForm
                        selectedPair={selectedPair}
                        onWithdraw={handleWithdraw}
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
                                    {pair.erc20Privacy?.symbol || `${pair.erc20.symbol}.S`} - {pair.erc20.symbol}
                                    {pair.isNativeROSE && ' (Native ROSE)'}
                                </Option>
                            ))}
                        </Select>
                    </Row>
                    <Space style={{ marginTop: '12px' }} direction="vertical" size="small">
                        <Text strong>
                            {selectedPair.erc20Privacy && selectedPair.erc20Privacy.name}
                            {` ---> ${selectedPair.erc20.name}`}
                        </Text>
                        {selectedPair.erc20Privacy?.address && (
                            <Text type="secondary" copyable>
                                Secret: {selectedPair.erc20Privacy.address}
                            </Text>
                        )}
                        {selectedPair.erc20?.address && (
                            <Text type="secondary" copyable>
                                ERC20: {selectedPair.erc20.address}
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

export default SecretTokenUnWrap;
