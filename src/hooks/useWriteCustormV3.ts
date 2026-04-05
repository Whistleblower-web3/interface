import { useEffect, useState } from 'react';
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useConfig
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { ContractConfig } from '@dapp/config/contractsConfig';
import { FunctionNameType_FundManager } from '@dapp/types/typesDapp/contracts';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { useAccountStore } from '@dapp/store/accountStore';

interface WriteContractConfig {
    contract: ContractConfig,
    functionName: string;
    tokenAddress: string;
    args: any[],
}

interface WriteContractResult {
    writeCustormV3: (config: WriteContractConfig) => Promise<`0x${string}`>;
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

export const useWriteCustormV3 = (): WriteContractResult => {
    const config = useConfig();
    const {
        writeContractAsync,
        data: hash,
        error,
        isPending,
        isError,
        isSuccess,
        status,
        reset
    } = useWriteContract();

    const { isSuccess: isSuccessed, isError: isReceiptError, error: receiptError, isLoading: isReceiptLoading } = useWaitForTransactionReceipt({
        hash,
    });

    const { address } = useWalletContext();
    const [functionName, setFunctionName] = useState<FunctionNameType_FundManager | null>(null);
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);

    const addWithdrawInteraction = useAccountStore(state => state.addWithdrawInteraction);

    const writeCustormV3 = async (
        contractConfig: WriteContractConfig
    ) => {
        const functionName = contractConfig.functionName as FunctionNameType_FundManager;
        setFunctionName(functionName);
        setTokenAddress(contractConfig.tokenAddress);

        try {
            const txHash = await writeContractAsync({
                address: contractConfig.contract.address,
                abi: contractConfig.contract.abi,
                functionName: contractConfig.functionName,
                args: contractConfig.args,
            });

            const receipt = await waitForTransactionReceipt(config, {
                hash: txHash,
                confirmations: 1,
            });

            if (receipt.status === 'reverted') {
                throw new Error('Transaction reverted on-chain.');
            }

            return txHash;
        } catch (err: any) {
            console.error('Contract write failed:', err);
            throw err;
        }
    };

    useEffect(() => {
        if (isSuccessed && functionName && address && tokenAddress) {
            addWithdrawInteraction(functionName, tokenAddress, hash);
        }
    }, [isSuccessed, functionName, address, tokenAddress, hash, addWithdrawInteraction]);

    return {
        writeCustormV3,
        hash,
        error: error || receiptError,
        isPending,
        isLoading: isPending || isReceiptLoading,
        isSuccess,
        status,
        isError: isError || isReceiptError,
        reset,
        isSuccessed,
    };
};
