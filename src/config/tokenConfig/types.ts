
/**
 * Supported chain IDs
 */
export enum SupportedChainId {
  SAPPHIRE_TESTNET = 23295,
  SAPPHIRE_MAINNET = 23294,
}

/**
 * Common network configuration interface (Simplified for tokenConfig)
 */
export interface NetworkConfig {
  chainId: SupportedChainId;
  name: string;
}
