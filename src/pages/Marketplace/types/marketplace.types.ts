import type { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';


export interface MarketplaceFilters {
  search?: string;
  country?: string;
  state?: string;
  status?: BoxStatus | 'Default';
  sort?: 'Default' | 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'id_asc' | 'id_desc';
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  idRange?: {
    start?: number;
    end?: number;
  };
}


import type { BoxUnifiedType } from '@dapp/services/supabase/types/types';


export interface MarketplaceListResponse {
  items: BoxUnifiedType[];
  nextCursor?: number;
  hasMore: boolean;
  totalCount?: number;
}

export interface MarketplaceQueryParams {
  startId: number;
  count: number;
  filters: MarketplaceFilters;
}

export interface GlobalStats {
  totalSupply: number;
  totalStoring: number;
  totalOnSale: number;
  totalSwaping: number;
  totalDelaying: number;
  totalPublished: number;
  totalGTV: number;
}

export interface MarketplaceError {
  message: string;
  code?: string;
  details?: any;
}

export enum LoadingStep {
  pending = 'pending',
  loading = 'loading',
  processing = 'processing',
  completed = 'completed',
  error = 'error'
}

export type PaginationMode = 'infiniteScroll' | 'paginator';

export interface PaginationConfig {
  loadBatchSize: number;
  pageSize: number;
  mode: PaginationMode;
}

export interface MetadataLoaderConfig {
  batchSize: number;
  autoLoad: boolean;
}
