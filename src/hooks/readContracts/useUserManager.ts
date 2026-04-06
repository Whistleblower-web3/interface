'use client';

import { useReadContract } from './useReadContract';
import { ContractName } from '@dapp/config/contractsConfig';


export function useUserManager() {
    const { readContract } = useReadContract();

    // function myUserId(bytes memory token_) external view returns (uint256);
    const myUserId = async (siweToken: string): Promise<string> => {
        try {
            const tx = await readContract({
                contractName: ContractName.USER_MANAGER,
                functionName: 'myUserId',
                args: [siweToken],
            });
            return tx || '';
        } catch (error) {
            console.error('myUserId error:', error);
            return '';
        }
    };

    // function isBlacklisted(address user_) external view returns (bool);
    const isBlacklisted = async (user: string, force: boolean = false): Promise<boolean> => {
        try {
            const tx = await readContract({
                contractName: ContractName.USER_MANAGER,
                functionName: 'isBlacklisted',
                args: [user],
                force
            });
            return tx ? Boolean(tx) : false;
        } catch (error) {
            console.error('isBlacklisted error:', error);
            return false;
        }
    };

    return {
        myUserId,
        isBlacklisted,
    };
}

