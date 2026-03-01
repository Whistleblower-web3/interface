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

/**
 * Contract name enumeration
 */
export enum ContractName {
  // Token contracts
  OFFICIAL_TOKEN = 'OfficialToken',
  OFFICIAL_TOKEN_SECRET = 'OfficialTokenSecret',
  WROSE_SECRET = 'wROSE_Secret',
  ERC20_SECRET = 'ERC20_Secret',
  WROSE = 'wROSE',
  // USDC_SECRET = 'ERC20Secret',
  // WBTC_SECRET = 'WBTCSecret',
  // WETH_SECRET = 'WETHSercet',


  
  // Core contracts
  TRUTH_NFT = 'TruthNFT',
  EXCHANGE = 'Exchange',
  FUND_MANAGER = 'FundManager',
  TRUTH_BOX = 'TruthBox',
  ADDRESS_MANAGER = 'AddressManager',
  SIWE_AUTH = 'SiweAuth',
  USER_ID = 'UserId',
}

/**
 * Contract address mapping type
 */
export type ContractAddresses = {
  [key in ContractName]: `0x${string}`;
};

/**
 * Contract configuration interface
 */
export interface ContractConfig {
  address: `0x${string}`;
  abi: Abi;
  chainId: SupportedChainId;
}

/**
 * Complete contract configuration mapping
 */
export type ContractConfigs = {
  [key in ContractName]: ContractConfig;
};



/**
 * Network contract configuration mapping
 */
export type NetworkContractMap = {
  [chainId in SupportedChainId]: ContractAddresses;
};

