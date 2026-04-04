import { Abi } from 'viem';
import { SupportedChainId } from '../../chainConfig/types';

export type TokenType = 'ERC20' | 'Privacy';

export type TokenSymbolType =
  'WTRC' |
  'WTRC.Privacy' |
  'wROSE' |
  'wROSE.Privacy' |
  'USDC' |
  'USDC.Privacy' |
  'WBTC' |
  'WBTC.Privacy' |
  'WETH' |
  'WETH.Privacy';

/**
 * Token metadata interface
 */
export interface TokenMetadata {
  name: string;
  symbol: TokenSymbolType;
  decimals: number;
  precision: number; // Precision, used to display the number of decimal places
  address: `0x${string}`;
  mappingAddress: `0x${string}`;
  logo?: string;
  types: TokenType;
  usdPrice?: number;
  isAccepted: boolean; // sell and auction can accept other token
  domainName?: string;
  mintPeriod?: number; // seconds only official token
  tokenName: TokenName;
  abi: Abi;
}


export enum TokenName {
  // Token contracts
  OFFICIAL_TOKEN = 'OfficialToken',
  OFFICIAL_TOKEN_PRIVACY = 'OfficialToken_Privacy',
  WROSE_PRIVACY = 'wROSE_Privacy',
  WROSE = 'wROSE',
}

export type TokenAddresses = {
  [key in TokenName]: `0x${string}`;
};

export type NetworkTokenMap = {
  [chainId in SupportedChainId]: TokenAddresses;
};

export const tokenEmpty: TokenMetadata = {
  name: '',
  symbol: 'WTRC',
  decimals: 0,
  precision: 0,
  address: '0x0000000000000000000000000000000000000000',
  mappingAddress: '0x0000000000000000000000000000000000000000',
  types: 'ERC20',
  isAccepted: false,
  tokenName: TokenName.OFFICIAL_TOKEN,
  abi: [],
}
