import { ProjectDataType, projectDataStore,} from "./metadataBase";

export interface AttributeType {
    trait_type: string;
    value: string;
}

export interface MetadataType {
    name: string;
    description: string;
    token_id: string;
    type_of_crime: string;
    title: string;
    image: string;
    country: string;
    state: string;
    event_date: string;
    attributes: AttributeType[];
}

export interface MetadataNFTType extends MetadataType, ProjectDataType {}

export const initialMetadataNFT: MetadataNFTType = {
    name: "Truth NFT",
    project: projectDataStore.project,
    website: projectDataStore.website,
    description: "Wiki Truth is a decentralized platform for trading criminal evidence, driven by blockchain-based token economics—a Web3-native evolution of WikiLeaks.",
    image: "ipfs://",
    token_id: "",
    type_of_crime: "",
    title: "",
    country: "",
    state: "",
    event_date: "",
    attributes: [
        {
            trait_type: "Version",
            value: "beta 1.7.8"
        }
    ]
};
