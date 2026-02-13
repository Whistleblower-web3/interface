import { useEffect } from 'react';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { BoxRoleType } from '@dapp/types/typesDapp/account';
import { useBoxDetailStore } from '../store/boxDetailStore';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import { useAccountStore } from '@dapp/store/accountStore';
import { CHAIN_ID } from '@dapp/config/contractsConfig';
import { useSiweAuth } from '@dapp/hooks/SiweAuth';
import { Address_Admin } from '@/constants';

export const useLisenerRoles = () => {
    const { box, biddersIds } = useBoxDetailContext();
    const { address, isConnected,chainId} = useWalletContext() || {};
    const { isValidateSession } = useSiweAuth();

    const { 
        updateUserState, 
    } = useBoxDetailStore();

    // Use selector to listen for current account's userId changes
    const userId = useAccountStore((state) => {
        const targetChainId = chainId || CHAIN_ID;
        if (!targetChainId || !address) {
            return '';
        }
        
        const chainAccounts = state.accounts[targetChainId];
        if (!chainAccounts) {
            return '';
        }

        return (
            chainAccounts[address]?.userId ??
            chainAccounts[address.toLowerCase()]?.userId ??
            ''
        );
    });

    useEffect(() => {
        let roles: BoxRoleType[] = [];
        updateUserState({ roles: roles });
        if (!address || !isConnected || !box) {
            return;
        }

        if (!isValidateSession) {
            return;
        }

        if (import.meta.env.DEV) {
            console.log('userId-boxDetailPage:', userId);
        }

        // Convert to string for comparison, to avoid type mismatch problem
        const userIdStr = String(userId).trim();
        const sellerId = box.seller_id ? String(box.seller_id).trim() : '';
        const buyerId = box.buyer_id ? String(box.buyer_id).trim() : '';
        const minterId = box.minter_id ? String(box.minter_id).trim() : '';
        const completerId = box.completer_id ? String(box.completer_id).trim() : '';

        if (biddersIds && biddersIds.length > 0 && userIdStr && userIdStr !== '') {
            // bidders is now a string array
            const isBidder = biddersIds.some(bidderId => bidderId === userIdStr);
            if (isBidder && buyerId !== userIdStr) {
                roles.push('Bidder');
            }
        }

        const role = (): BoxRoleType[] => {
            if (address?.toLowerCase() === Address_Admin.toLowerCase()) {
                roles.push('Admin');
            };
            if (userIdStr && userIdStr !== '') {
                if (userIdStr === minterId) {
                    roles.push('Minter');
                };
                if (userIdStr === sellerId) roles.push('Seller');
                if (userIdStr === buyerId) {
                    roles.push('Buyer');
                };
                if (userIdStr === completerId) roles.push('Completer');
            }
            
            if (roles.length === 0) roles.push('Other');

            return roles;
        };
        updateUserState({ roles: role() });
    }, [address, isConnected, box, userId, isValidateSession]);

    return {};
};

