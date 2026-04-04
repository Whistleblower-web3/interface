import { SupportedChainId } from '../../chainConfig/types';
import { NETWORK_TOKENS } from '../contracts';
import { ABIS_Token } from '../chain-23295/abis_token';
import { CHAIN_ID } from '../../chainConfig/current';
import { OFFICIAL_TOKEN_CONFIG } from '../current';
import { TokenSymbolType, TokenMetadata, TokenName } from './typesToken';

export function getAllTokensByChainId(chainId: SupportedChainId): TokenMetadata[] {
  const addresses = NETWORK_TOKENS[chainId];

  return [
    {
      name: 'Wiki Truth Coin',
      symbol: 'WTRC',
      decimals: 18,
      precision: 3,
      address: addresses[TokenName.OFFICIAL_TOKEN],
      mappingAddress: addresses[TokenName.OFFICIAL_TOKEN_PRIVACY],
      types: 'ERC20',
      isAccepted: false,
      tokenName: TokenName.OFFICIAL_TOKEN,
      abi: ABIS_Token[TokenName.OFFICIAL_TOKEN],
    },
    {
      name: 'Wiki Truth Coin Privacy',
      symbol: 'WTRC.Privacy',
      decimals: 18,
      precision: 3,
      address: addresses[TokenName.OFFICIAL_TOKEN_PRIVACY],
      mappingAddress: addresses[TokenName.OFFICIAL_TOKEN],
      types: 'Privacy',
      isAccepted: true,
      domainName: "Secret ERC20 Token",
      tokenName: TokenName.OFFICIAL_TOKEN_PRIVACY,
      abi: ABIS_Token[TokenName.OFFICIAL_TOKEN_PRIVACY],
    },
    {
      name: 'Wrapped ROSE',
      symbol: 'wROSE',
      decimals: 18,
      precision: 3,
      address: addresses[TokenName.WROSE],
      mappingAddress: addresses[TokenName.WROSE_PRIVACY],
      types: 'ERC20',
      isAccepted: false,
      tokenName: TokenName.WROSE,
      abi: ABIS_Token[TokenName.WROSE],
    },
    {
      name: 'WROSE Privacy',
      symbol: 'wROSE.Privacy',
      decimals: 18,
      precision: 3,
      address: addresses[TokenName.WROSE_PRIVACY],
      mappingAddress: addresses[TokenName.WROSE],
      types: 'Privacy',
      isAccepted: true,
      domainName: "Secret ERC20 Token",
      tokenName: TokenName.WROSE_PRIVACY,
      abi: ABIS_Token[TokenName.WROSE_PRIVACY],
    },


    // TODO add more tokens here...
  ];
}

export function getOfficialTokenByChainId(chainId: SupportedChainId): TokenMetadata {
  return getAllTokensByChainId(chainId)[0];
}

export function getToken(name: TokenName, chainId: SupportedChainId = CHAIN_ID): TokenMetadata {
  const supportedTokens = getAllTokensByChainId(chainId);
  const foundToken = supportedTokens.find(token => token.tokenName === name);
  if (!foundToken) {
    return OFFICIAL_TOKEN_CONFIG;
  }
  return foundToken;
}

export function getTokenBySymbol(symbol: TokenSymbolType, chainId: SupportedChainId = CHAIN_ID): TokenMetadata {
  const supportedTokens = getAllTokensByChainId(chainId);
  const foundToken = supportedTokens.find(token => token.symbol === symbol);
  if (!foundToken) {
    return OFFICIAL_TOKEN_CONFIG;
  }
  return foundToken;
}


export function getTokenByAddress(tokenAddress: string, chainId: SupportedChainId = CHAIN_ID): TokenMetadata {

  const supportedTokens = getAllTokensByChainId(chainId);

  // Normalize address: convert to lowercase for comparison (Ethereum addresses are case-insensitive)
  const normalizedAddress = tokenAddress.toLowerCase();

  const foundToken = supportedTokens.find(token => token.address?.toLowerCase() === normalizedAddress);

  if (!foundToken) {
    return OFFICIAL_TOKEN_CONFIG;
  }

  return foundToken;
}

export function getAcceptedTokensByChainId(chainId: SupportedChainId): TokenMetadata[] {
  const supportedTokens = getAllTokensByChainId(chainId);
  return supportedTokens.filter(token => token.isAccepted);
}