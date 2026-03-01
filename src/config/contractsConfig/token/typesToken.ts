import { Abi } from 'viem';
import { ContractName } from '../types';

export type TokenSymbolType = 
'WTRC' | 
'WTRC.S' | 
'wROSE' | 
'wROSE.S' | 
'USDC' | 
'USDC.S' | 
'WBTC' | 
'WBTC.S' | 
'WETH' | 
'WETH.S';

/**
 * Token metadata interface
 */
export interface TokenMetadata {
  index: number;
  name: string;
  symbol: string;
  decimals: number;
  precision: number; // Precision, used to display the number of decimal places
  address: `0x${string}`;
  mappingAddress?: `0x${string}`; // erc20 -> secret, secret -> erc20
  logo?: string;
  types: 'ERC20' | 'Secret';
  usdPrice?: number;
  canAcceptToken: boolean; // sell and auction can accept other token
  domainName?: string;
  mintPeriod?: number; // seconds only official token
  contractName: ContractName;
  abi: Abi;
}


// export type TokenAddressType = 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000' | 
// '0x0000000000000000000000000000000000000000';