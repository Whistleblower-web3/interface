import { MintMethodType } from "./metadataBox";

export interface ResultDataType {
    title: string;
    project: string;
    website: string;
    type: string;
    mint_method: MintMethodType;
    cid_list: string[];
    is_success: boolean;
    timestamp: number | string;
}

export const initialResultData: ResultDataType = {
    title: "Mint Success CID",
    project: "Wiki Truth",
    website: "https://wikitruth.eth.limo/",
    type: "Mint",
    mint_method: 'create',
    cid_list: [],
    is_success: false,
    timestamp: 0
}; 