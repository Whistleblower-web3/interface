
export interface TokenInfo {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
}

// Token pair
export interface TokenPair {
    erc20: TokenInfo;
    erc20Privacy: TokenInfo | null;
    isNativeROSE: boolean; // Whether it is a native ROSE -> wROSE.Privacy
}

// Operation button status
export type ActiveButton = 'transfer' | 'burn' | 'wrap' | 'unwrap' | 'deposit' | 'withdraw' | 'approve' | null;

export type writeStatus = 'idle' | 'pending' | 'success' | 'error'; // Same as the status type of useWriteToken

