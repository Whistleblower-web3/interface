/**
 * React Hooks - Used to get contract configurations in components
 */

import { useMemo } from 'react';
import {
  ContractName,
  ContractConfig,
  ContractConfigs,
  ContractAddresses,
  ChainConfig,
} from './types';
import {
  getContract,
  getAllContractAddresses,
  getAllContracts,
} from './config';
import { CHAIN_ID } from '../chainConfig/current';

export function useAllContractAddresses(): ContractAddresses {
  return useMemo(() => {
    return getAllContractAddresses(CHAIN_ID);
  }, [CHAIN_ID]);
}


export function useContract(contractName: ContractName): ContractConfig {
  return useMemo(() => {
    return getContract(contractName, CHAIN_ID);
  }, [contractName, CHAIN_ID]);
}

export function useAllContracts(): ContractConfigs {
  return useMemo(() => {
    return getAllContracts(CHAIN_ID);
  }, [CHAIN_ID]);
}

export function useContractAddress(contractName: ContractName): `0x${string}` {
  const config = useContract(contractName);
  return config.address;
}
