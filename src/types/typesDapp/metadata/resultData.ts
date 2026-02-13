import { MintMethodType } from "./metadataBox";

export interface ResultDataType {
    title: string;
    project: string;
    website: string;
    type: string;
    mint_method: MintMethodType;
    file_cid_list: string[];
    cid_list: string[];
    is_success: boolean;
    timestamp: number | string;
}

export const initialResultData: ResultDataType = {
    title: "Failed Mint CID",
    project: "Wiki Truth",
    website: "https://wikitruth.eth.limo/",
    type: "Mint",
    mint_method: 'create',
    file_cid_list: [],
    cid_list: [],
    is_success: false,
    timestamp: 0
}; 