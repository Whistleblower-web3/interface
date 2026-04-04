import { useChainId } from "wagmi";
import { useEffect } from "react";

import {
    getProtocolConstants,
    ProtocolConstantsType,
    SAPPHIRE_TESTNET
} from "./ProtocolConstants";

export let PROTOCOL_CONSTANTS: ProtocolConstantsType = SAPPHIRE_TESTNET;

/**
 * Listen for changes in the current chain, 
 * Called by the top-level component, used to get the current chain configuration
 */
export function useSetProtocolConstants() {
    const chainId = useChainId();
    useEffect(() => {
        if (chainId) {
            PROTOCOL_CONSTANTS = getProtocolConstants(chainId);
        }

    }, [chainId]);

}
