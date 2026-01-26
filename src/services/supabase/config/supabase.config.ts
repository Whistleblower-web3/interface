
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Verify configuration
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    const missingVars = [];
    if (!supabaseConfig.url) missingVars.push('VITE_SUPABASE_URL');
    if (!supabaseConfig.anonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
    
    const errorMsg = `Missing Supabase configuration. Please set the following environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\n` +
        `For Cloudflare Pages deployment:\n` +
        `Create a .env.local file with these variables.`;
    
    throw new Error(errorMsg);
}

export function createSupabaseClient(): SupabaseClient<Database> {
    return createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    });
}


export const supabase = createSupabaseClient();


export interface Database {
    public: {
        Tables: {
            boxes: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    token_id: string;
                    token_uri: string | null;
                    box_info_cid: string | null;
                    private_key: string | null;
                    price: string;
                    deadline: string;
                    minter_id: string;
                    owner_address: string;
                    publisher_id: string | null;
                    seller_id: string | null;
                    buyer_id: string | null;
                    completer_id: string | null;
                    status: number;
                    listed_mode: number | null;
                    accepted_token: string | null;
                    refund_permit: boolean | null;
                    create_timestamp: string;
                    publish_timestamp: string | null;
                    listed_timestamp: string | null;
                    purchase_timestamp: string | null;
                    complete_timestamp: string | null;
                    request_refund_deadline: string | null;
                    review_deadline: string | null;
                };
            };
            metadata_boxes: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    type_of_crime: string | null;
                    label: string[] | null;
                    title: string | null;
                    nft_image: string | null;
                    box_image: string | null;
                    country: string | null;
                    state: string | null;
                    description: string | null;
                    event_date: string | null;
                    create_date: string | null;
                    timestamp: number | null;
                    mint_method: string | null;
                    file_list: string[] | null;
                    password: string | null;
                    encryption_slices_metadata_cid: Record<string, unknown> | null;
                    encryption_file_cid: Record<string, unknown>[] | null;
                    encryption_passwords: Record<string, unknown> | null;
                    public_key: string | null;
                };
            };
            // users: {
            //     Row: {
            //         network: 'testnet' | 'mainnet';
            //         layer: 'sapphire';
            //         id: string;
            //     };
            // };
            // user_addresses: {
            //     Row: {
            //         network: 'testnet' | 'mainnet';
            //         layer: 'sapphire';
            //         id: string;
            //         is_blacklisted: boolean;
            //     };
            // };
            box_bidders: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string; // boxId (part of the primary key, corresponding to boxes.id)
                    box_id: string;
                    bidder_id: string;
                };
            };
            // payments: {
            //     Row: {
            //         network: 'testnet' | 'mainnet';
            //         layer: 'sapphire';
            //         id: string;
            //         box_id: string;
            //         user_id: string;
            //         token: string;
            //         amount: string;
            //         timestamp: string;
            //         transaction_hash: Uint8Array;
            //         block_number: string;
            //     };

            // };
            // withdraws: {
            //     Row: {
            //         network: 'testnet' | 'mainnet';
            //         layer: 'sapphire';
            //         id: string;
            //         token: string;
            //         box_list: string[];
            //         user_id: string;
            //         amount: string;
            //         timestamp: string;
            //         withdraw_type: 'Order' | 'Refund' | 'Helper' | 'Minter';
            //         transaction_hash: Uint8Array;
            //         block_number: string;
            //     };
            // };
            // rewards_addeds: {
            //     Row: {
            //         network: 'testnet' | 'mainnet';
            //         layer: 'sapphire';
            //         id: string;
            //         box_id: string;
            //         token: string;
            //         amount: string;
            //         reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
            //         timestamp: string;
            //         transaction_hash: Uint8Array;
            //         block_number: string;
            //     };
            // };
            box_rewards: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    box_id: string;
                    reward_type: 'Minter' | 'Seller' | 'Completer' | 'Total';
                    token: string;
                    amount: string;
                };
            };
            user_rewards: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    user_id: string;
                    reward_type: 'Minter' | 'Seller' | 'Completer';
                    token: string;
                    amount: string;
                };
            };
            user_withdraws: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    user_id: string;
                    withdraw_type: 'Helper' | 'Minter';
                    token: string;
                    amount: string;
                };
            };
            
            box_user_order_amounts: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    user_id: string;
                    box_id: string;
                    token: string;
                    amount: string;
                };
            };
            statistical_state: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    total_supply: string;
                    status_0_supply: string;
                    status_1_supply: string;
                    status_2_supply: string;
                    status_3_supply: string;
                    status_4_supply: string;
                    status_5_supply: string;
                    status_6_supply: string;
                    status_7_supply: string;
                };
            };
            // TODO: Fund Manager

            token_total_amounts: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    id: string;
                    token: string;
                    fund_manager_id: string;
                    funds_type: 'OrderPaid' | 'OrderWithdraw' | 'RefundWithdraw' | 'RewardsAdded' | 'HelperRewardsWithdraw' | 'MinterRewardsWithdraw';
                    amount: string;
                };
            };
            sync_status: {
                Row: {
                    network: 'testnet' | 'mainnet';
                    layer: 'sapphire';
                    contract_name: string;
                    last_synced_block: string;
                    last_synced_at: string;
                };
            };
        };
        Functions: {
            search_boxes: {
                Args: {
                    network_filter: 'testnet' | 'mainnet';
                    layer_filter?: 'sapphire';
                    search_query?: string | null;
                    status_filter?: string[] | null;
                    type_of_crime_filter?: string[] | null;
                    country_filter?: string[] | null;
                    accepted_token_filter?: string[] | null;
                    listed_mode_filter?: string[] | null;
                    label_filter?: string[] | null;
                    min_price?: number | null;
                    max_price?: number | null;
                    min_timestamp?: number | null;
                    max_timestamp?: number | null;
                    sort_by?: 'relevance' | 'price' | 'event_date' | 'box_id';
                    sort_direction?: 'asc' | 'desc';
                    limit_count?: number;
                    offset_count?: number;
                };
                Returns: {
                    id: string;
                    token_id: string;
                    title: string | null;
                    description: string | null;
                    type_of_crime: string | null;
                    country: string | null;
                    state: string | null;
                    label: string[] | null;
                    status: number;
                    listed_mode: number | null;
                    price: string;
                    deadline: string;
                    buyer_id: string | null;
                    nft_image: string | null;
                    box_image: string | null;
                    event_date: string | null;
                    create_timestamp: string;
                    accepted_token: string | null;
                    relevance: number;
                }[];
            };
        };
    };
}

