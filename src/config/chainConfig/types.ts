import { Abi } from 'viem';

/**
 * Supported chain IDs
 */
export enum SupportedChainId {
  SAPPHIRE_TESTNET = 23295,
  SAPPHIRE_MAINNET = 23294,
}

/**
 * Chain configuration interface
 */
export interface ChainConfig {
  id: SupportedChainId;
  name: string;
  network: 'testnet' | 'mainnet';
  layer: 'sapphire';
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
      webSocket?: string[];
    };
    public: {
      http: string[];
      webSocket?: string[];
    };
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet: boolean;
}


