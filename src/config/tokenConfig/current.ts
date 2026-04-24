import { useChainId } from "wagmi";
import { TokenMetadata, TokenName } from "../tokenConfig/token/typesToken";
import { useEffect } from "react";
import tokenAddresses from "./chain-23295/token_address.json";
import {
    getAllTokensByChainId,
    getOfficialTokenByChainId,
    getAcceptedTokensByChainId
} from "../tokenConfig";

// Import ABIS_Token from the new tokenConfig location
import { ABIS_Token } from "../tokenConfig/chain-23295/abis_token";

export let ALL_TOKENS: TokenMetadata[] = [];
export let ACCEPTED_TOKENS: TokenMetadata[] = [];
export let OFFICIAL_TOKEN_CONFIG: TokenMetadata = {
    name: 'WikiTruth Coin',
    symbol: 'WTRC',
    precision: 3,
    decimals: 18,
    address: tokenAddresses.OfficialToken as `0x${string}`,
    mappingAddress: tokenAddresses.OfficialToken_Privacy as `0x${string}`,
    types: 'ERC20',
    isAccepted: false,
    tokenName: TokenName.OFFICIAL_TOKEN,
    abi: ABIS_Token[TokenName.OFFICIAL_TOKEN],
}


/**
 * Listen for changes in the current chain, 
 * Called by the top-level component, used to get the current chain configuration
 */
export function useSetCurrentTokenConfig() {
    const chainId = useChainId();
    useEffect(() => {
        if (chainId) {
            ALL_TOKENS = getAllTokensByChainId(chainId);
            OFFICIAL_TOKEN_CONFIG = getOfficialTokenByChainId(chainId);
            ACCEPTED_TOKENS = getAcceptedTokensByChainId(chainId);
        }

    }, [chainId]);

}
