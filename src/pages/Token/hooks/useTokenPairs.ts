import { useState, useEffect, useMemo } from 'react';
import { useAllTokens, type TokenMetadata } from '@dapp/config/tokenConfig';
import { TokenInfo, TokenPair } from '../types';

/**
 * Hook for managing token pairs
 * 
 */
export const useTokenPairs = (tokens: TokenInfo[]) => {
    const supportedTokens = useAllTokens();
    const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

    // Filter out ERC20 tokens and corresponding Secret token pairs
    const tokenPairs: TokenPair[] = useMemo(() => {
        const pairs: TokenPair[] = [];

        // Get all tokens (excluding .Privacy ending), including native tokens and ERC20 tokens
        const erc20Tokens = tokens.filter(token => !token.symbol.endsWith('.Privacy'));

        const supportedSecretTokens = supportedTokens.filter(token => token.types === 'Privacy');

        erc20Tokens.forEach(erc20Token => {
            // Check if it is a native token (address is zero address)
            const isNativeToken = erc20Token.address === '0x0000000000000000000000000000000000000000';

            // Check if it is a native wROSE/TEST -> wROSE.Privacy
            const isNativeROSE = isNativeToken && (
                erc20Token.symbol.toUpperCase() === 'wROSE' ||
                erc20Token.symbol.toUpperCase() === 'TEST'
            );

            let privacySymbol: string;
            let privacyTokenCurrent: TokenMetadata | null = null;
            let privacyToken: TokenInfo | null = null;

            // For native wROSE, need to find the actual address of wROSE in supportedTokens
            let erc20TokenAddress = erc20Token.address;

            if (isNativeROSE) {
                // Find the actual address of wROSE in supportedTokens
                const wROSEMetadata = supportedTokens.find(t => t.symbol === 'wROSE' && t.types === 'ERC20');
                if (wROSEMetadata) {
                    erc20TokenAddress = wROSEMetadata.address as `0x${string}`;
                }
                // Native wROSE/TEST -> wROSE.Privacy
                privacySymbol = 'wROSE.Privacy';
                privacyTokenCurrent = supportedSecretTokens.find(t => t.symbol === privacySymbol) || null;
            } else {
                // Ordinary ERC20 -> Secret Token
                privacySymbol = `${erc20Token.symbol}.Privacy`;
                privacyTokenCurrent = supportedSecretTokens.find(t => t.symbol === privacySymbol) || null;
            }

            if (privacyTokenCurrent) {
                privacyToken = {
                    address: privacyTokenCurrent.address,
                    symbol: privacyTokenCurrent.symbol,
                    name: privacyTokenCurrent.name,
                    decimals: privacyTokenCurrent.decimals,
                    balance: '0',
                };
            }

            // Use actual address to create erc20 TokenInfo (for native wROSE, use the address in supportedTokens)
            const erc20TokenInfo: TokenInfo = {
                ...erc20Token,
                address: erc20TokenAddress,
            };

            pairs.push({
                erc20: erc20TokenInfo,
                erc20Privacy: privacyToken || null,
                isNativeROSE,
            });
        });

        return pairs;
    }, [tokens, supportedTokens]);

    // When tokenPairs change, reset selectedPairIndex
    useEffect(() => {
        if (tokenPairs.length > 0 && selectedPairIndex >= tokenPairs.length) {
            setSelectedPairIndex(0);
        }
    }, [tokenPairs, selectedPairIndex]);

    // Current selected token pair
    const selectedPair: TokenPair | null = useMemo(() => {
        return tokenPairs[selectedPairIndex] || null;
    }, [tokenPairs, selectedPairIndex]);

    // Filter out token pairs with balance (for unwrap/withdraw)
    const pairsWithSecretBalance = useMemo(() => {
        return tokenPairs.filter(pair =>
            pair.erc20Privacy && parseFloat(pair.erc20Privacy.balance) > 0
        );
    }, [tokenPairs]);

    return {
        tokenPairs,
        selectedPair,
        selectedPairIndex,
        setSelectedPairIndex,
        pairsWithSecretBalance,
        supportedTokens, // Export supportedTokens for use by auxiliary functions
    };
};

