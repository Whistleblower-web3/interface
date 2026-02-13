import { ipfsCidToUrl } from "@/services/ipfsUrl/ipfsCidToUrl";
import { useMetadataStore } from "./useMetadataStore";
import { MetadataBoxType } from "@dapp/types/typesDapp/metadata/metadataBox";

/**
 * Process NFT metadata, fetch data from IPFS and parse to store in Zustand
 * @param id Token ID
 * @param url Token URI/ipfs cid
 * @returns Processing result
 */
export const processBox = async (
    id: string, 
    url: string,
): Promise<MetadataBoxType | null> => {
    const store = useMetadataStore.getState();
    // console.log('processBox,id:', id);

    try {
        // Check if cached metadata already exists
        const cachedMetadata = store.boxesMetadata[id];
        if (cachedMetadata) {
            return cachedMetadata;
        }

        // Use new IPFS fetch service instead of direct fetch
        const metadataUrl = ipfsCidToUrl(url);
        const metadataResponse = await fetch(metadataUrl);
        const metadata = await metadataResponse.json();
        
        if (!metadata) {
            console.error(`Error processing truthBox metadata:`, metadata);
            store.addErrorListMetadata(id);
            return null;
        }

        // Convert IPFS CID to accessible URL
        const nftImageUrl = ipfsCidToUrl(metadata.nft_image);
        const boxImageUrl = ipfsCidToUrl(metadata.box_image);

        // Build complete data structure conforming to MetadataBoxType
        const metadataBox: MetadataBoxType = {
            // Project base data
            project: metadata.project,
            website: metadata.website,
            // Box base info
            name: metadata.name,
            token_id: id,
            type_of_crime: metadata.type_of_crime,
            label: metadata.label || [],
            title: metadata.title,
            nft_image: nftImageUrl,
            box_image: boxImageUrl,
            country: metadata.country,
            state: metadata.state,
            description: metadata.description,
            event_date: metadata.event_date,
            create_date: metadata.create_date,
            timestamp: metadata.timestamp,
            mint_method: metadata.mint_method,
            // Encryption related data
            encryption_slices_metadata_cid: metadata.encryption_slices_metadata_cid || {
                slicesMetadataCID_encryption: "",
                slicesMetadataCID_iv: "",
            },
            encryption_file_cid: metadata.encryption_file_cid || [],
            encryption_passwords: metadata.encryption_passwords || {
                password_encryption: "",
                password_iv: "",
            },
            public_key: metadata.public_key || '',
            file_list: metadata.file_list || [],
            // password: metadata.password || '',
        };

        // Store data in zustand
        store.setMetadataBox(id, metadataBox);

        return metadataBox;
    } catch (error) {
        console.error(`Error processing truthBox metadata:`, error);
        store.addErrorListMetadata(id);
        return null;
    }
};

