"use client"

import { useQuery } from '@tanstack/react-query';
import { batchQuery_OrderAmountsData, type BoxUserOrderAmountData } from '@dapp/services/supabase/fundsBox';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import { useMemo } from 'react';

/**
 * useBatchOrderAmounts - Batch get order amounts for multiple boxes
 */
export const useBatchOrderAmounts = (
    boxIds: string[],
    userId: string,
    enabled: boolean = true
) => {
    const { network, layer } = CHAIN_CONFIG;

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['batch-box-order-amounts', network, layer, boxIds.sort().join(','), userId],
        queryFn: async () => {
            if (boxIds.length === 0) return { orderAmountsData: [] };
            
            const result = await batchQuery_OrderAmountsData(boxIds, userId);
            
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        staleTime: 5 * 60 * 1000,
        enabled: enabled && boxIds.length > 0 && !!userId && userId.trim() !== '',
    });

    // Create a map for quick lookup by boxId
    const orderAmountsMap = useMemo(() => {
        const map: Record<string, BoxUserOrderAmountData[]> = {};
        if (data?.orderAmountsData) {
            data.orderAmountsData.forEach(item => {
                if (!map[item.boxId]) {
                    map[item.boxId] = [];
                }
                map[item.boxId].push(item);
            });
        }
        return map;
    }, [data?.orderAmountsData]);

    return {
        orderAmountsMap,
        isLoading: isLoading || isFetching,
        error: error || null,
    };
};
