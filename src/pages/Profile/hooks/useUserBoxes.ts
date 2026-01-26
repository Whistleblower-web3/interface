"use client"

import { useInfiniteQuery } from '@tanstack/react-query';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import { queryUserBoxes } from '@dapp/services/supabase/profile';
import { convertBoxRowToMarketplaceBoxType } from '@/services/supabase/types/types';
import { FilterState } from '../types/profile.types';

/**
 * useUserBoxes - Get user related Box list (based on Supabase)
 */
export const useUserBoxes = (
    address: string, 
    filters: FilterState,
    userId: string
) => {
    const { network, layer } = CHAIN_CONFIG 

    return useInfiniteQuery({
        queryKey: ['user-boxes', network, layer, address, userId, filters],
        queryFn: async ({ pageParam }) => {
            if (!address) {
                return { items: [], hasMore: false };
            }

            const limit = 20;
            const result = await queryUserBoxes(
                address,
                userId,
                filters,
                limit,
                pageParam as number
            );

            if (result.error) {
                throw result.error;
            }

            // Use the unified converter
            const items = (result.data || []).map(item => convertBoxRowToMarketplaceBoxType(item));
            
            return {
                items,
                hasMore: items.length === limit,
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.hasMore) {
                return undefined;
            }
            return allPages.reduce((sum, page) => sum + page.items.length, 0);
        },
        enabled: !!address,
        staleTime: 30000,
    });
};
