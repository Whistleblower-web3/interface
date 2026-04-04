import { useChainId } from "wagmi";
import { useEffect } from "react";
import { getChainConfig, sapphireTestnet } from "./chains";

export let CHAIN_ID = 23295;
export let CHAIN_CONFIG = sapphireTestnet;

/**
 * Listen for changes in the current chain, 
 * Called by the top-level component, used to get the current chain configuration
 */
export function useSetCurrentChainConfig() {
    const chainId = useChainId();
    useEffect(() => {
        const chainConfig = getChainConfig(chainId);
        if (chainConfig) {
            // if(import.meta.env.DEV) {
            //   console.log('currentChainConfig:', chainConfig);
            // }
            CHAIN_CONFIG = chainConfig;
        }
        CHAIN_ID = chainId;

    }, [chainId]);

}
