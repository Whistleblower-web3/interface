/**
 * React Hooks - Used to get contract configurations in components
 */

import { useMemo } from 'react';
import {
  getTokenByAddress,
  getAcceptedTokensByChainId,
  getAllTokensByChainId,
  getTokenBySymbol,
  getToken
} from './token/tokens';
import { TokenMetadata, TokenSymbolType, TokenName } from './token/typesToken';
import { CHAIN_ID } from '../chainConfig/current';

export function useToken(tokenName: TokenName): TokenMetadata {
  return useMemo(() => {
    return getToken(tokenName);
  }, [tokenName]);
}

export function useTokenByAddress(tokenAddress: string): TokenMetadata {
  return useMemo(() => {
    return getTokenByAddress(tokenAddress);
  }, [tokenAddress]);
}

export function useTokenBySymbol(symbol: TokenSymbolType): TokenMetadata {
  return useMemo(() => {
    return getTokenBySymbol(symbol);
  }, [symbol]);
}

export function useAcceptedTokens(): TokenMetadata[] {
  return useMemo(() => {
    return getAcceptedTokensByChainId(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useAllTokens(): TokenMetadata[] {
  return useMemo(() => {
    return getAllTokensByChainId(CHAIN_ID);
  }, [CHAIN_ID]);
}
