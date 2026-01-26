import camelcaseKeys from 'camelcase-keys';

import { boxStatus, type BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import { calculateStatus, getListedMode } from '../utils/status';
import type { Database } from '../config/supabase.config';

export interface BoxParticipant {
    id: string;
}

/**
 * Unified Box type used across all pages (Marketplace, Profile, BoxDetail)
 * Contains both flat fields and nested objects for compatibility
 */
export interface BoxUnifiedType {
    // Basic fields
    id: string;
    tokenId: string;
    tokenIdNumeric?: number;
    price: string;
    deadline: string;
    status: BoxStatus | string;
    listedMode: BoxStatus | string | null;
    acceptToken?: string;
    acceptedToken?: string;
    boxInfoCID?: string;
    privateKey?: string | null;
    createTimestamp: string;
    
    // Flat ID fields (legacy/database style)
    minterId: string;
    ownerAddress: string;
    publisherId?: string;
    sellerId?: string;
    buyerId?: string | null;
    completerId?: string;
    refundPermit?: boolean;

    // Nested Participant objects (Profile page style)
    owner: BoxParticipant;
    minter: BoxParticipant;
    seller?: BoxParticipant;
    buyer?: BoxParticipant;
    completer?: BoxParticipant;
    publisher?: BoxParticipant;
    bidders: BoxParticipant[];

    // Metadata fields
    title: string;
    description?: string;
    nftImage: string | null;
    boxImage: string | null;
    image?: string | null; // Profile alias for boxImage/nftImage
    country: string | null;
    state: string | null;
    eventDate: string | null;
    typeOfCrime: string | null;
    label: string[] | null;

    // Timestamps
    sellTimestamp?: string | null;
    publishTimestamp?: string | null;
    listedTimestamp?: string | null;
    purchaseTimestamp?: string | null;
    completeTimestamp?: string | null;
    requestRefundDeadline?: string | null;
    reviewDeadline?: string | null;

    // Misc
    relevance?: number;
    hasError?: boolean;
    isInBlacklist?: boolean;
}

// Supabase query result types
export type SearchBoxesResult = Database['public']['Functions']['search_boxes']['Returns'][number];
export type StatisticalState = Database['public']['Tables']['statistical_state']['Row'];
export type BoxRow = Database['public']['Tables']['boxes']['Row'];
export type MetadataBoxRow = Database['public']['Tables']['metadata_boxes']['Row'];

// Type guard: Check if status is a valid BoxStatus
const isBoxStatus = (status: string): status is typeof boxStatus[number] => {
    return boxStatus.includes(status as typeof boxStatus[number]);
};

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
    const { metadata_boxes, box_bidders, ...boxData } = row;
    const camelCased = camelcaseKeys(boxData, { deep: true }) as any;
    
    // Merge metadata if present
    let metadataFields = {};
    if (metadata_boxes) {
        metadataFields = camelcaseKeys(metadata_boxes, { deep: true });
    }

    // Build nested participant objects
    const owner = { id: row.owner_address };
    const minter = { id: row.minter_id };
    const seller = row.seller_id ? { id: row.seller_id } : undefined;
    const buyer = row.buyer_id ? { id: row.buyer_id } : undefined;
    const completer = row.completer_id ? { id: row.completer_id } : undefined;
    const publisher = row.publisher_id ? { id: row.publisher_id } : undefined;
    const bidders = (box_bidders || []).map(b => ({ id: b.bidder_id || b.bidderId }));

    const status = calculateStatus(
        row.status,
        (row as any).deadline,
        (row as any).buyer_id
    );

    const listedMode = getListedMode(row.listed_mode);

    return {
        ...camelCased,
        ...metadataFields,
        id: row.id,
        tokenId: row.token_id || row.id,
        tokenIdNumeric: toNumericTokenId(row.token_id || row.id),
        status,
        listedMode,
        acceptToken: row.accepted_token || undefined,
        acceptedToken: row.accepted_token || undefined,
        
        // Ensure participant fields are set
        owner,
        minter,
        seller,
        buyer,
        completer,
        publisher,
        bidders,

        // Profile image alias
        image: (metadata_boxes as any)?.box_image || (metadata_boxes as any)?.nft_image || null,

        hasError: false,
        title: (metadata_boxes as any)?.title ?? camelCased.title ?? '',
        description: (metadata_boxes as any)?.description ?? camelCased.description ?? undefined,
        typeOfCrime: (metadata_boxes as any)?.type_of_crime ?? camelCased.typeOfCrime ?? undefined,
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
