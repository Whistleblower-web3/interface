import { SupportedChainId } from './types';
import { TokenName, TokenAddresses, NetworkTokenMap } from './token/typesToken';
import tokenAddresses_23295 from './chain-23295/token_address.json';

/**
 * SAPPHIRE_TESTNET (23295) token addresses
 */
export const TESTNET_TOKEN_ADDRESSES: TokenAddresses = {
  [TokenName.OFFICIAL_TOKEN]: tokenAddresses_23295.OfficialToken as `0x${string}`,
  [TokenName.OFFICIAL_TOKEN_PRIVACY]: tokenAddresses_23295.OfficialToken_Privacy as `0x${string}`,
  [TokenName.WROSE]: tokenAddresses_23295.wROSE as `0x${string}`,
  [TokenName.WROSE_PRIVACY]: tokenAddresses_23295.WROSE_Privacy as `0x${string}`,
};

/**
 * SAPPHIRE_MAINNET (23294) token addresses
 * Note: Temporarily using Testnet addresses until Mainnet addresses are confirmed
 */
export const MAINNET_TOKEN_ADDRESSES: TokenAddresses = {
  ...TESTNET_TOKEN_ADDRESSES,
};

/**
 * Global mapping of token addresses by chain ID
 */
export const NETWORK_TOKENS: NetworkTokenMap = {
  [SupportedChainId.SAPPHIRE_TESTNET]: TESTNET_TOKEN_ADDRESSES,
  [SupportedChainId.SAPPHIRE_MAINNET]: MAINNET_TOKEN_ADDRESSES,
};
