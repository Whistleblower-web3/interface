"use client"

import React, { useMemo, useEffect } from 'react';
import CardProfile, { 
    CardProfileData, 
    CardProfileActions 
} from '@/components/cardProfile';
import { FundsData } from '@/components/fundsSection';
import { BoxData } from '@dapp/pages/Profile/types/profile.types';
import { useFunds } from '@Profile/hooks/useFunds';
import { useWithdrawStore, SelectableItem } from '@Profile/store/withdrawStore';
import { useAccountStore } from '@dapp/store/accountStore';
import { CHAIN_ID } from '@dapp/config/contractsConfig';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';

export interface CardProfileContainerProps {
    data: BoxData;
    userId?: string | null;
    onCardClick?: () => void;
    className?: string;
    prefetchedOrderAmounts?: BoxUserOrderAmountData[];
}

const CardProfileContainer: React.FC<CardProfileContainerProps> = ({
    data: box,
    userId,
    onCardClick,
    className,
    prefetchedOrderAmounts
}) => {
    const boxId = useMemo(() => String(box.id), [box.id]);
    const { funds, isLoading, hasClaimableFunds } = useFunds({
        box,
        userId,
        prefetchedOrderAmounts
    });
    const hasWithdrawInteraction = useAccountStore((state) => state.hasWithdrawInteraction);
    const { address } = useWalletContext();

    // Subscribe to withdrawInteractions changes to trigger re-render when withdrawal succeeds
    const withdrawInteractions = useAccountStore(
        useMemo(() => {
            if (!address || !CHAIN_ID) {
                return () => [];
            }
            const normalizedAddress = address.toLowerCase();
            return (state) => 
                state.accounts[CHAIN_ID]?.[normalizedAddress]?.withdrawInteractions || [];
        }, [address])
    );

    const {
        withdrawData,
        handleRadioSelect,
        handleRadioDeselect,
        isRadioSelected,
        registerSelectableItem,
        unregisterSelectableItem
    } = useWithdrawStore();

    useEffect(() => {
        if (!hasClaimableFunds) return;

        const validTokens = funds.tokens.filter((token) => token.hasValidAmount);

        validTokens.forEach((token) => {
            const item: SelectableItem = {
                boxId,
                tokenSymbol: token.symbol,
                tokenAddress: token.address,
                tokenDecimals: token.decimals,
                type: funds.type,
                claimMethod: funds.claimMethod,
                amount: token.amount,
                hasValidAmount: token.hasValidAmount,
            };
            registerSelectableItem(item);
        });

        return () => {
            validTokens.forEach((token) => {
                unregisterSelectableItem(boxId, token.symbol);
            });
        };
    }, [
        boxId,
        funds.tokens,
        funds.type,
        funds.claimMethod,
        hasClaimableFunds,
        registerSelectableItem,
        unregisterSelectableItem
    ]);

    const cardData: CardProfileData = useMemo(() => ({
        tokenId: box.token_id,
        title: box.title || `Box #${box.token_id}`,
        description: box.description || 'No description available',
        boxImage: box.box_image ?? box.nft_image ?? undefined,
        status: box.status,
        country: box.country ?? undefined,
        state: box.state ?? undefined,
        eventDate: box.event_date ?? undefined,
    }), [box]);

    const cardFunds: FundsData[] = useMemo(() => {
        return funds.tokens.map((token) => {
            // Check if this token has been withdrawn (based on claimMethod and tokenAddress)
            const hasInteraction = token.address 
                ? hasWithdrawInteraction(funds.claimMethod, token.address)
                : false;
            
            // If withdrawn, hide the token by setting amount to 0 and disabled to true
            if (hasInteraction) {
                return {
                    amount: '0',
                    symbol: token.symbol,
                    type: funds.type,
                    decimals: token.decimals,
                    disabled: true,
                };
            }
            
            // Normal case
            return {
                amount: token.amount,
                symbol: token.symbol,
                type: funds.type,
                decimals: token.decimals,
                disabled: !token.hasValidAmount || !hasClaimableFunds,
            };
        });
    }, [funds.tokens, funds.claimMethod, funds.type, hasClaimableFunds, hasWithdrawInteraction, withdrawInteractions]);

    const tokenSymbols = useMemo(() => funds.tokens.map((token) => token.symbol), [funds.tokens]);

    const selectedTokenSymbol = useMemo(() => {
        for (const symbol of tokenSymbols) {
            if (isRadioSelected(boxId, symbol)) {
                return symbol;
            }
        }
        return '';
    }, [boxId, tokenSymbols, withdrawData.selectedBoxes, isRadioSelected]);

    const cardActions: CardProfileActions = useMemo(() => ({
        selectedTokenSymbol,
        onCardClick,
        onSelect: (tokenSymbol: string) => {
            const token = funds.tokens.find((item) => item.symbol === tokenSymbol);
            if (!token || !token.hasValidAmount) return;

            handleRadioSelect(
                boxId,
                tokenSymbol,
                funds.type,
                funds.claimMethod,
                token.amount
            );
        },
        onDeselect: () => {
            handleRadioDeselect(boxId);
        }
    }), [
        onCardClick,
        selectedTokenSymbol,
        funds.tokens,
        funds.type,
        funds.claimMethod,
        boxId,
        handleRadioSelect,
        handleRadioDeselect
    ]);

    return (
        <CardProfile
            data={cardData}
            funds={cardFunds}
            actions={cardActions}
            className={className}
        />
    );
};

export default CardProfileContainer;
