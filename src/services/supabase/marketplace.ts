import type { PostgrestError } from '@supabase/supabase-js';
import { supabase, Database  } from './config/supabase.config';
import type { MarketplaceFilters } from '@Marketplace/types/marketplace.types';
import type { SearchBoxesResult, StatisticalState } from './types/types';
import { CHAIN_CONFIG } from '@dapp/config/contractsConfig';
import { boxStatusMap_number } from "@dapp/types/typesDapp/contracts/truthBox";

const MAX_COUNT_LIMIT = 200;

type SearchBoxesArgs = Database['public']['Functions']['search_boxes']['Args'];
type QueryError = PostgrestError | Error | null;

const toTimestampSeconds = (value?: string): number | null => {
    if (!value) return null;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : Math.floor(timestamp / 1000);
};

const toNullableNumber = (value: number | undefined): number | null => {
    return typeof value === 'number' && !Number.isNaN(value) ? value : null;
};

const normalizeString = (value?: string | null): string => value?.trim() ?? '';

function convertFiltersToSearchParams(
    filters: MarketplaceFilters
): SearchBoxesArgs {
    // Default sort: by relevance if searching, otherwise by ID descending (newest first)
    let sort_by: SearchBoxesArgs['sort_by'] = filters.search ? 'relevance' : 'box_id';
    let sort_direction: SearchBoxesArgs['sort_direction'] = 'desc';

    switch (filters.sort) {
        case 'price_asc':
            sort_by = 'price';
            sort_direction = 'asc';
            break;
        case 'price_desc':
            sort_by = 'price';
            sort_direction = 'desc';
            break;
        case 'date_asc':
            sort_by = 'event_date';
            sort_direction = 'asc';
            break;
        case 'date_desc':
            sort_by = 'event_date';
            sort_direction = 'desc';
            break;
        case 'id_asc':
            sort_by = 'box_id';
            sort_direction = 'asc';
            break;
        case 'id_desc':
            sort_by = 'box_id';
            sort_direction = 'desc';
            break;
        case 'Default':
        default:
            break;
    }
    // process status filter to number
    const statusFilter = filters.status && filters.status !== 'Default'
        ? [boxStatusMap_number[filters.status]]
        : null;

    const countryFilter = normalizeString(filters.country);
    const priceRange = filters.priceRange ?? {};

    const { network, layer } = CHAIN_CONFIG;

    return {
        network_filter: network,
        layer_filter: layer,
        search_query: normalizeString(filters.search) || null,
        status_filter: statusFilter as any,
        country_filter: countryFilter ? [countryFilter] : null,
        type_of_crime_filter: null,
        label_filter: null,
        min_price: toNullableNumber(priceRange.min),
        max_price: toNullableNumber(priceRange.max),
        min_timestamp: toTimestampSeconds(filters.dateRange?.start),
        max_timestamp: toTimestampSeconds(filters.dateRange?.end),
        sort_by,
        sort_direction,
    };
}

function applyClientSideFilters(
    data: SearchBoxesResult[] | null,
    filters: MarketplaceFilters
): SearchBoxesResult[] {
    if (!data || data.length === 0) {
        return [];
    }

    let filtered = [...data];

    const hasMinId = typeof filters.idRange?.start === 'number';
    const hasMaxId = typeof filters.idRange?.end === 'number';

    if (hasMinId || hasMaxId) {
        filtered = filtered.filter(item => {
            const numericId = Number.parseInt(item.id, 10);
            if (Number.isNaN(numericId)) {
                return true;
            }
            if (hasMinId && numericId < (filters.idRange?.start ?? Number.NEGATIVE_INFINITY)) {
                return false;
            }
            if (hasMaxId && numericId > (filters.idRange?.end ?? Number.POSITIVE_INFINITY)) {
                return false;
            }
            return true;
        });
    }

    const normalizedState = normalizeString(filters.state).toLowerCase();
    if (normalizedState) {
        filtered = filtered.filter(item => normalizeString(item.state).toLowerCase() === normalizedState);
    }

    return filtered;
}

const toQueryError = (error: unknown): QueryError => {
    if (!error) {
        return null;
    }
    if (typeof error === 'object' && 'message' in (error as Record<string, unknown>)) {
        return error as PostgrestError | Error;
    }
    return new Error('Unknown Supabase error');
};

/**
 * Unify Box status returned by Supabase:
 * According to contract logic, when deadline expires:
 * - Selling/Auctioning + has buyer → Paid
 * - Selling/Auctioning + no buyer → Published
 * - Delaying → Published
 */

export async function queryMarketplaceBoxes(
    filters: MarketplaceFilters,
    limit: number = 20,
    offset: number = 0
): Promise<{ data: SearchBoxesResult[] | null; error: QueryError }> {

    try {
        const searchParams: SearchBoxesArgs = {
            ...convertFiltersToSearchParams(filters),
            limit_count: limit,
            offset_count: offset,
        };

        // Type assertion: Supabase RPC method type inference needs help
        const { data, error } = await (supabase.rpc as any)('search_boxes', searchParams);

        if (error) {
            console.error('[queryMarketplaceBoxes] Supabase error:', error);
            return { data: null, error };
        }

        // Apply client-side filtering (e.g. ID range, state, etc.)
        const filteredData = applyClientSideFilters(data, filters);

        return {
            data: filteredData,
            error: null,
        };
    } catch (error) {
        console.error('Error querying marketplace boxes:', error);
        return { data: null, error: toQueryError(error) };
    }
}

export async function queryStatisticalStats(): Promise<{
    data: StatisticalState | null;
    error: QueryError;
}> {
    const { network, layer } = CHAIN_CONFIG;
    try {
        const { data, error } = await supabase
            .from('statistical_state')
            .select('*')
            .eq('network', network)
            .eq('layer', layer)
            .eq('id', 'statistical')
            .single();

        if (error) {
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Error querying marketplace stats:', error);
        return { data: null, error: toQueryError(error) };
    }
}

export async function countMarketplaceBoxes(
    filters: MarketplaceFilters,
): Promise<{ count: number | null; error: QueryError }> {
    try {
        const searchParams: SearchBoxesArgs = {
            ...convertFiltersToSearchParams(filters),
            limit_count: MAX_COUNT_LIMIT,
            offset_count: 0,
        };

        // Type assertion: Supabase RPC method type inference needs help
        const { data, error } = await (supabase.rpc as any)('search_boxes', searchParams);

        if (error) {
            return { count: null, error };
        }

        const filteredData = applyClientSideFilters(data, filters);
        return { count: filteredData.length, error: null };
    } catch (error) {
        console.error('Error counting marketplace boxes:', error);
        return { count: null, error: toQueryError(error) };
    }
}
