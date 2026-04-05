import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useConfig
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Abi } from 'viem';
import { useEffect } from 'react';

interface WriteContractConfig {
    contractAddress: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: any[];
}

interface WriteContractResult {
    writeCustorm: (config: WriteContractConfig) => Promise<`0x${string}`>;
    hash: `0x${string}` | undefined;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
    isPending: boolean;
    status: 'idle' | 'error' | 'pending' | 'success';
    isSuccessed: boolean;
    isLoading: boolean;
    reset: () => void;
}

export const useWriteCustorm = (): WriteContractResult => {
    const config = useConfig();
    const {
        writeContractAsync,
        data: hash,         // 
        error,             // 
        isPending,         // Whether the transaction is pending, waiting for wallet confirmation
        isError,           // Whether there is an error Boolean value
        isSuccess,         // Whether the transaction is successfully sent
        status,            // Transaction status, corresponding to isPending, isError, and isSuccess
        reset             // Function to reset the status
    } = useWriteContract();

    // Still use the hook for UI state updates if needed
    const { isSuccess: isSuccessed, isLoading: isReceiptLoading } = useWaitForTransactionReceipt({
        hash,
    });

    const writeCustorm = async (contractConfig: WriteContractConfig) => {
        try {
            // 1. Send the transaction and get the hash
            const txHash = await writeContractAsync({
                address: contractConfig.contractAddress,
                abi: contractConfig.abi,
                functionName: contractConfig.functionName,
                args: contractConfig.args,
            });

            // 2. Wait for the transaction to be confirmed on-chain
            const receipt = await waitForTransactionReceipt(config, {
                hash: txHash,
                confirmations: 1, // At least 1 block confirmation
            });

            // Check if the transaction reverted
            if (receipt.status === 'reverted') {
                throw new Error('Transaction reverted on-chain.');
            }

            console.log('Contract write successful and confirmed:', receipt.transactionHash);
            return txHash;
        } catch (err: any) {
            console.error('Contract write failed or reverted:', err);
            throw err;
        }
    };

    useEffect(() => {
        if (isError) {
            reset();
        }
    }, [isError, reset]);

    return {
        writeCustorm,
        hash,
        error,
        isPending,
        isSuccess,
        isError,
        status,
        isSuccessed,
        isLoading: isPending || isReceiptLoading,
        reset,
    };
};
