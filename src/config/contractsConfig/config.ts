
import {
  SupportedChainId,
  ContractName,
  ContractConfig,
  ContractConfigs,
  ContractAddresses
} from './types';
import { ABIS } from './chain-23295/abis';
import { NETWORK_CONTRACTS } from './contracts';
import { isSupportedChain } from '../chainConfig/chains';
import { CHAIN_CONFIG } from '../chainConfig/current';

/**
 * Configuration management class
 */
class ConfigManager {
  private currentChainId: SupportedChainId;

  constructor(initialChainId: SupportedChainId = CHAIN_CONFIG.id) {
    this.currentChainId = initialChainId;
  }

  /**
   * Get all contract addresses for the specified network
   */
  getAllContractAddresses(chainId?: number): ContractAddresses {
    const targetChainId = chainId ?? this.currentChainId;

    if (!isSupportedChain(targetChainId)) {
      console.warn(
        `Unsupported chain ID: ${targetChainId}. Using default chain: ${CHAIN_CONFIG.id}`
      );
      return NETWORK_CONTRACTS[CHAIN_CONFIG.id];
    }

    return NETWORK_CONTRACTS[targetChainId];
  }

  /**
   * Get the configuration of a single contract
   * 
   * Note: this method ensures that a valid configuration is always returned, and will not return undefined
   * Mainnet temporarily uses Testnet configuration to avoid returning empty values
   */
  getContract(
    contractName: ContractName,
    chainId?: number
  ): ContractConfig {
    const targetChainId = (chainId ?? this.currentChainId) as SupportedChainId;
    const addresses = this.getAllContractAddresses(targetChainId);
    const address = addresses[contractName];

    return {
      address,
      abi: ABIS[contractName],
      chainId: targetChainId,
    };
  }

  /**
   * Get the configuration of a contract by address
   */
  getContractByAddress(address: `0x${string}`): ContractConfig {
    const configs = this.getAllContracts();
    const config = Object.values(configs).find((config) => config.address === address);
    if (!config) {
      throw new Error(`Contract config not found for address: ${address}`);
    }
    return config;
  }

  /**
   * Get all contract configurations for the current network
   * 
   * Note: this method ensures that a complete configuration object is always returned
   */
  getAllContracts(chainId?: number): ContractConfigs {
    const targetChainId = chainId ?? this.currentChainId;
    const configs: Partial<ContractConfigs> = {};

    // Iterate through all contract names to generate configurations
    Object.values(ContractName).forEach((contractName) => {
      configs[contractName as ContractName] = this.getContract(
        contractName as ContractName,
        targetChainId
      );
    });

    return configs as ContractConfigs;
  }
}

/**
 * Export singleton instance
 */
export const configManager = new ConfigManager();

/**
 * Convenient function: get contract configuration
 */
export function getContract(
  contractName: ContractName,
  chainId?: number
): ContractConfig {
  return configManager.getContract(contractName, chainId);
}

/**
 * Convenient function: get contract address
 */
export function getContractAddress(
  contractName: ContractName,
  chainId?: number
): `0x${string}` {
  return configManager.getContract(contractName, chainId).address;
}

/**
 * Convenient function: get all contract addresses
 */
export function getAllContractAddresses(chainId?: number): ContractAddresses {
  return configManager.getAllContractAddresses(chainId);
}


export function getAllContracts(chainId?: number): ContractConfigs {
  return configManager.getAllContracts(chainId);
}

// Get contract configuration by address
export function getContractByAddress(address: `0x${string}`): ContractConfig {
  return configManager.getContractByAddress(address);
}