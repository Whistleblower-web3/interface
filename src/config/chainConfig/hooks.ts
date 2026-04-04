/**
 * React Hooks - Used to get contract configurations in components
 */

import { useMemo } from 'react';
import {
  ChainConfig,
} from './types';

import { getChainConfig } from './chains';
import { CHAIN_ID } from './current';


export function useChainConfig(): ChainConfig {
  return useMemo(() => {
    const chainConfig = getChainConfig(CHAIN_ID);
    if (!chainConfig) {
      throw new Error(`Chain config not found for chainId: ${CHAIN_ID}`);
    }
    return chainConfig;
  }, [CHAIN_ID]);
}