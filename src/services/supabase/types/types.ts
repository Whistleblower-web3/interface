import { boxStatus, type BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import { calculateStatus, getListedMode } from '../utils/status';
import type { Database } from '../config/supabase.config';


/**
 * Unified Box type used across all pages (Marketplace, Profile, BoxDetail)
 * Contains both flat fields and nested objects for compatibility
 */
export interface BoxUnifiedType {
    // Basic fields
    id: string;
    token_id: string;
    price: string;
    deadline: string;
    status: BoxStatus | string;
    listed_mode: BoxStatus | string | null;
    accepted_token?: string;
    box_info_cid?: string;
    private_key?: string | null;
    create_timestamp: string;
    
    // Flat ID fields (legacy/database style)
    minter_id: string;
    owner_address: string;
    publisher_id?: string;
    seller_id?: string;
    buyer_id?: string | null;
    completer_id?: string;
    refund_permit?: boolean;

    // Nested Participant objects (Profile page style)
    bidders: string[];

    // Metadata fields
    title: string;
    description?: string;
    nft_image: string | null;
    box_image: string | null;
    country: string | null;
    state: string | null;
    event_date: string | null;
    type_of_crime: string | null;
    label: string[] | null;

    // Timestamps
    publish_timestamp?: string | null;
    listed_timestamp?: string | null;
    purchase_timestamp?: string | null;
    complete_timestamp?: string | null;
    request_refund_deadline?: string | null;
    review_deadline?: string | null;

    // Misc
    relevance?: number;
    has_error?: boolean;
}

// Supabase query result types
export type SearchBoxesResult = Database['public']['Functions']['search_boxes']['Returns'][number];
export type StatisticalState = Database['public']['Tables']['statistical_state']['Row'];
export type BoxRow = Database['public']['Tables']['boxes']['Row'];
export type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];


const toNumericTokenId = (tokenId: string): number | undefined => {
    const numeric = Number(tokenId);
    return Number.isNaN(numeric) ? undefined : numeric;
};

/**
 * Base conversion logic for any Box data row coming from Supabase
 */
export function convertBoxRowToMarketplaceBoxType(
    row: BoxRow & { metadata_boxes?: MetadataBoxRow | null, box_bidders?: any[] }
): BoxUnifiedType {
    const { metadata_boxes, box_bidders } = row;
    
    // Build nested participant objects
    const bidders = (box_bidders || []).map(b => b.bidder_id || b.bidderId);

    const status = calculateStatus(
        row.status,
        row.deadline,
        row.buyer_id
    );

    const listed_mode = getListedMode(row.listed_mode);

    return {
        // Core DB fields (already snake_case)
        id: row.id,
        token_id: row.token_id || row.id,
        // token_id_numeric: toNumericTokenId(row.token_id || row.id),
        price: row.price,
        deadline: row.deadline,
        status,
        listed_mode,
        accepted_token: row.accepted_token || undefined,
        box_info_cid: row.box_info_cid || undefined,
        private_key: row.private_key,
        create_timestamp: row.create_timestamp,
        
        minter_id: row.minter_id || '',
        owner_address: row.owner_address || '',
        publisher_id: row.publisher_id || undefined,
        seller_id: row.seller_id || undefined,
        buyer_id: row.buyer_id || null,
        completer_id: row.completer_id || undefined,
        refund_permit: row.refund_permit || undefined,

        // Participant objects
        bidders,

        // Metadata fields
        title: metadata_boxes?.title ?? (row as any).title ?? '',
        description: metadata_boxes?.description ?? (row as any).description ?? undefined,
        nft_image: metadata_boxes?.nft_image ?? (row as any).nft_image ?? null,
        box_image: metadata_boxes?.box_image ?? (row as any).box_image ?? null,
        country: metadata_boxes?.country ?? (row as any).country ?? null,
        state: metadata_boxes?.state ?? (row as any).state ?? null,
        event_date: metadata_boxes?.event_date ?? (row as any).event_date ?? null,
        type_of_crime: metadata_boxes?.type_of_crime ?? (row as any).type_of_crime ?? null,
        label: metadata_boxes?.label ?? (row as any).label ?? null,

        // Timestamps
        publish_timestamp: row.publish_timestamp,
        listed_timestamp: row.listed_timestamp,
        purchase_timestamp: row.purchase_timestamp,
        complete_timestamp: row.complete_timestamp,
        request_refund_deadline: row.request_refund_deadline,
        review_deadline: row.review_deadline,

        // Misc
        relevance: (row as any).relevance,
        has_error: false,
    };
}

/**
 * Convert Supabase search_boxes result to BoxUnifiedType
 */
export function convertSearchResultToMarketplaceBoxData(
    result: SearchBoxesResult
): BoxUnifiedType {
    return convertBoxRowToMarketplaceBoxType(result as any);
}
