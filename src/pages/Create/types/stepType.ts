import {
    // EncryptionSlicesMetadataCIDType,
    // EncryptionFileCIDType,
    // EncryptionPasswordType,
    EncryptionResultType,
} from '@dapp/types/typesDapp/metadata/encryption';

export interface TimeType {
    create_date: string;
    timestamp: string | number;
}

export interface CompressFilesOutput {
    zip_file: Blob | null;
    file_name: string;
    password: string;
    file_chunks: Blob[];
    slices_metadata_file: Blob | null;
}

export interface UploadFilesOutput {
    slices_metadata_cid: string;
    file_cid_list: string[];
}

export interface EncryptDataOutput {
    encryption_slices_metadata_cid: EncryptionResultType;
    encryption_file_cid: EncryptionResultType[];
    encryption_passwords: EncryptionResultType;
    key_pair: {
        private_key_minter: string;
        public_key_minter: string;
    };
}

export interface UploadBoxImageOutput {
    box_image_cid: string;
}

export interface CreateNFTImageOutput {
    nft_image: File | null;
    current_time: TimeType;
}

export interface UploadNFTImageOutput {
    nft_image_cid: string;
}

export interface MetadataBoxOutput {
    metadata_box_file: File | null;
    metadata_box_cid: string;
}

export interface MetadataNFTOutput {
    metadata_nft_file: File | null;
    metadata_nft_cid: string;
}

export interface MintOutput {
    transaction_hash: string;
    token_id?: string;
}

export interface UploadResultDataOutput {
    result_data_cid: string;
}

export interface AllStepOutputs
    extends CompressFilesOutput,
    UploadFilesOutput,
    EncryptDataOutput,
    UploadBoxImageOutput,
    CreateNFTImageOutput,
    UploadNFTImageOutput,
    MetadataBoxOutput,
    MetadataNFTOutput,
    MintOutput,
    UploadResultDataOutput { }

export const createInitialAllStepOutputs = (): AllStepOutputs => ({
    zip_file: null,
    file_name: '',
    password: '',
    file_chunks: [],
    slices_metadata_file: null,
    slices_metadata_cid: '',
    file_cid_list: [],
    encryption_slices_metadata_cid: {
        encryption_data: '',
        encryption_iv: '',
    },
    encryption_file_cid: [],
    encryption_passwords: {
        encryption_data: '',
        encryption_iv: '',
    },
    key_pair: {
        private_key_minter: '',
        public_key_minter: '',
    },
    box_image_cid: '',
    nft_image: null,
    nft_image_cid: '',
    current_time: {
        create_date: '',
        timestamp: 0,
    },
    metadata_box_file: null,
    metadata_box_cid: '',
    metadata_nft_file: null,
    metadata_nft_cid: '',
    transaction_hash: '',
    token_id: '',
    result_data_cid: '',
});
