"use client";

import { useQuery } from '@tanstack/react-query';
import { queryStatisticalStats } from '@dapp/services/supabase/marketplace';
import type { GlobalStats } from '../types/marketplace.types';

/**
 * Marketplace statistics data Hook (based on Supabase)
 * 
 * Responsibilities:
 * - Get statistics data from Supabase database
 * - Convert to frontend format
 * 
 * Features:
 * - Use React Query to get and cache data
 */
export const useStatisticalStats = () => {
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ['statistical-stats'],
        queryFn: async () => {
            const result = await queryStatisticalStats();

            if (result.error) {
                throw result.error;
            }

            if (!result.data) {
                return null;
            }

            // Convert to frontend format
            const stats: GlobalStats = {
                totalSupply: parseInt(result.data.total_supply || '0', 10),
                totalStoring: parseInt(result.data.status_0_supply || '0', 10),
                totalOnSale:
                    parseInt(result.data.status_1_supply || '0', 10) +
                    parseInt(result.data.status_2_supply || '0', 10),
                totalSwaping:
                    parseInt(result.data.status_3_supply || '0', 10) +
                    parseInt(result.data.status_4_supply || '0', 10),
                totalDelaying: parseInt(result.data.status_5_supply || '0', 10),
                totalPublished: parseInt(result.data.status_6_supply || '0', 10),
                totalGTV: 0, // TODO: calculate from token_total_amounts
            };

            return stats;
        },
        staleTime: 5 * 60000, // Do not re-query within 1 minute
    });

    return {
        data: data || null,
        isLoading,
        isFetching,
        isError: !!error,
        error: error || null,
        isSuccess: !error,
    };
};

