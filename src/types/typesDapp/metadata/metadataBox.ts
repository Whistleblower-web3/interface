import { projectDataStore, ProjectDataType, } from "./metadataBase";
import { EncryptionDataType } from "./encryption";


export type MintMethodType = 'create' | 'createAndPublish';

export interface BoxInfoType {
    name: string;
    token_id: string;
    type_of_crime: string;
    label: string[];
    title: string;
    nft_image: string;
    box_image:string;
    country: string;
    state: string;
    description: string;
    event_date: string;
    create_date: string;
    timestamp: number;
    mint_method: MintMethodType;
}

export interface FileInfoType {
    file_list: string[]; // Store file CIDs of multiple chunks
}

export interface MetadataBoxType extends BoxInfoType, ProjectDataType, FileInfoType, EncryptionDataType {}

export const initialMetadataBox: MetadataBoxType = {
    project: projectDataStore.project,
    website: projectDataStore.website,
    name: "Truth Box",
    token_id: "",
    type_of_crime: "",
    label: [],
    title: "",
    nft_image: "ipfs://",
    box_image: "ipfs://",
    country: "",
    state: "",
    description: "",
    event_date: "",
    create_date: "",
    timestamp: 0,
    mint_method: "create",
    encryption_slices_metadata_cid: {
        encryption_data: "",
        encryption_iv: "",
    },
    encryption_file_cid: [],
    encryption_passwords: {
        encryption_data: "",
        encryption_iv: "",
    },
    public_key: "",
    file_list: [],
};
