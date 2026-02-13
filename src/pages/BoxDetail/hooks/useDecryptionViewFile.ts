import { useState } from "react"
import { useDecryption } from "@dapp/hooks/Cryption/useDecryption";
import { MetadataBoxType } from "@dapp/types/typesDapp/metadata/metadataBox";

export type ViewFileResult = {
    fileCIDList: string[];
    password: string;
    slicesMetadataCID: string;
};

const useDecryptionViewFile = () => {

    const [data, setData] = useState<ViewFileResult | null>(null);

    const { decryptList, decrypt } = useDecryption();

    const decryptionViewFile = async (
        privateKey: string,
        metadataBox: MetadataBoxType
    ): Promise<ViewFileResult> => {

        try {
            
            if (
                !metadataBox.public_key || 
                !metadataBox.encryption_file_cid || 
                !metadataBox.encryption_passwords ||
                !metadataBox.encryption_slices_metadata_cid
            ) {
                // console.log("metadataBox.publicKey:", metadataBox.publicKey);
                // console.log("metadataBox.encryptionFileCID:", metadataBox.encryptionFileCID);
                // console.log("metadataBox.encryptionPasswords:", metadataBox.encryptionPasswords);
                // console.log("metadataBox.encryptionSlicesMetadataCID:", metadataBox.encryptionSlicesMetadataCID);
                throw new Error('Metadata box is required!');
            }

            const encryptionFileCIDList = metadataBox.encryption_file_cid.map((item) => {
                return {
                    iv_bytes: item.encryption_iv,
                    encrypted_bytes: item.encryption_data,
                };
            });

            const fileCIDList = await decryptList(
                metadataBox.public_key, 
                privateKey, 
                encryptionFileCIDList
            );
            const slicesMetadataCID = await decrypt(
                metadataBox.public_key, 
                privateKey, 
                metadataBox.encryption_slices_metadata_cid.encryption_iv, 
                metadataBox.encryption_slices_metadata_cid.encryption_data
            );
            const password = await decrypt(
                metadataBox.public_key, 
                privateKey, 
                metadataBox.encryption_passwords.encryption_iv, 
                metadataBox.encryption_passwords.encryption_data
            );

            const result : ViewFileResult = {
                fileCIDList: fileCIDList || [],
                password: password || '',
                slicesMetadataCID: slicesMetadataCID || '',
            };

            setData(result);

            return result;

        } catch (error) {
            console.error(error);
            throw error;
        }
            
    }

    return { decryptionViewFile, data };
}

export default useDecryptionViewFile;
