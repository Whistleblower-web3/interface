"use client"

import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useSupportedTokens } from '@dapp/config/contractsConfig';
import { useBoxOrderAmounts } from './useBoxOrderAmounts';
import { ClaimableFund, ClaimMethodType, FundType, TokenData } from '../types/cardProfile.types';
import type { BoxData } from '../types/profile.types';
import { useProfileStore } from '../store/profileStore';
import { type BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';

export interface UseFundsParams {
    box: BoxData;
    userId?: string | null;
    prefetchedOrderAmounts?: BoxUserOrderAmountData[];
}

export interface UseFundsReturn {
    funds: ClaimableFund;
    isLoading: boolean;
    hasClaimableFunds: boolean;
}

const formatTokenAmount = (amount: bigint, decimals: number) => {
    if (amount === BigInt(0)) return '0.000';
    try {
        const value = formatUnits(amount, decimals);
        const [integer, fractional = '0'] = value.split('.');
        const trimmed = fractional.replace(/0+$/, '').slice(0, 4);
        return trimmed ? `${integer}.${trimmed}` : integer;
    } catch {
        return amount.toString();
    }
};

const fallbackSymbol = (address?: string) => {
    if (!address) return 'UNKNOWN';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const createTokenData = (params: {
    amount: bigint;
    symbol: string;
    address?: string;
    decimals: number;
}): TokenData => ({
    amount: params.amount.toString(),
    formattedAmount: formatTokenAmount(params.amount, params.decimals),
    symbol: params.symbol,
    address: params.address,
    decimals: params.decimals,
    hasValidAmount: params.amount > BigInt(0),
});

export const useFunds = ({ box, userId, prefetchedOrderAmounts }: UseFundsParams): UseFundsReturn => {
    const supportedTokens = useSupportedTokens();
    const selectedTab = useProfileStore((state) => state.filterState.selectedTab);

    const acceptedTokenMeta = useMemo(() => {
        if (!box.accepted_token) return null;
        return supportedTokens.find((token) => token.address.toLowerCase() === box.accepted_token?.toLowerCase());
    }, [box.accepted_token, supportedTokens]);

    // Use prefetched data if available, otherwise fetch it
    const { orderAmountsData: fetchedOrderAmounts, isLoading: isFetching } = useBoxOrderAmounts(
        box,
        userId ?? '',
        selectedTab,
        // Disable fetching if we already have prefetched data
        !!prefetchedOrderAmounts
    );

    const orderAmountsData = prefetchedOrderAmounts ?? fetchedOrderAmounts;
    const isLoading = prefetchedOrderAmounts ? false : isFetching;

    const result = useMemo(() => {
        const acceptedAddress = box.accepted_token ?? acceptedTokenMeta?.address;
        const decimals = acceptedTokenMeta?.decimals ?? 18;
        const symbol = acceptedTokenMeta?.symbol ?? fallbackSymbol(acceptedAddress);
        const tokens: TokenData[] = [];

        const hasOrderAmounts = Boolean(orderAmountsData && orderAmountsData.length > 0);

        if (hasOrderAmounts && orderAmountsData) {
            const totalRaw = orderAmountsData.reduce((acc: bigint, item: BoxUserOrderAmountData) => {
                try {
                    return acc + BigInt(item.amount || '0');
                } catch {
                    return acc;
                }
            }, BigInt(0));

            if (totalRaw > BigInt(0)) {
                tokens.push(
                    createTokenData({
                        amount: totalRaw,
                        symbol,
                        address: acceptedAddress ?? undefined,
                        decimals,
                    })
                );
            }
        }

        const isRefundEligible = Boolean(
            userId &&
            box.refund_permit &&
            box.buyer_id &&
            String(box.buyer_id) === String(userId)
        );

        const isOrderEligible = hasOrderAmounts || Boolean(
            userId &&
            (!box.buyer_id || String(box.buyer_id) !== String(userId)) &&
            box.bidders?.some((bidder) => String(bidder) === String(userId))
        );

        const hasAccess = isRefundEligible || isOrderEligible;
        const claimMethod: ClaimMethodType = isRefundEligible ? 'withdrawRefundAmounts' : 'withdrawOrderAmounts';
        const fundType: FundType = isRefundEligible ? 'Refund' : 'Order';

        return {
            funds: {
                boxId: box.id,
                type: fundType,
                claimMethod,
                tokens: hasAccess ? tokens : [],
            },
            hasClaimableFunds: hasAccess && tokens.some((token) => token.hasValidAmount),
        };
    }, [
        acceptedTokenMeta,
        box.id,
        box.accepted_token,
        box.bidders,
        box.buyer_id,
        box.refund_permit,
        orderAmountsData,
        userId,
    ]);

    return {
        funds: result?.funds,
        isLoading,
        hasClaimableFunds: result?.hasClaimableFunds,
    };
};
