import { MetadataBoxType } from "@dapp/types/typesDapp/metadata/metadataBox";
import { BoxBasicDataType, BoxUserDataType } from "@dapp/types/typesDapp/contracts/truthBox";
// import { BoxData } from '@dapp/pages/Profile/types/profile.types';
import image from "@assets/nft/nft-light-1.jpg"
import image2 from "@assets/nft/nft-light-2.jpg"

export interface TestBoxType extends MetadataBoxType, BoxBasicDataType, BoxUserDataType {

}

export const testBox: TestBoxType = {
    name: 'Test Box',
    project: 'Test Project',
    website: ['https://test.com'],
    // 
    token_id: '1',
    type_of_crime: 'Modular',
    title: "This is a test! Here is the title about TruthBox, which directly conveys the key information, allowing others to quickly understand this TruthBox.",
    nft_image: "ipfs://bafkreianmtw7x22zb3iawia3rcmfm67iiupytrxj3ytljxojlichfaictm",
    box_image: "bafkreiccjb4uhzhze2pyehnoo7qwkk73yhjl6k6scbzxss6idqkhghznom",
    country: 'United States',
    state: 'California',
    description: 'This is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box, which is a test box',
    create_date: '2021-01-01',
    event_date: '2021-01-01',
    timestamp: 1714531200,
    label: ['Test'],
    mint_method: 'create',
    encryption_slices_metadata_cid: {
        encryption_data: "",
        encryption_iv: "",
    },
    encryption_file_cid: [],
    encryption_passwords: {
        encryption_data: "",
        encryption_iv: "",
    },
    public_key: '',
    file_list: [],
    // password: '',
    // -----
    price: 100,
    deadline: 1714531200,
    status: 'Storing',
    // -----
    minter: '1',
    owner: '0x1234567890123456789012345678901234567890',
    seller: '2',
    buyer: '3',
    bidders: [],
    completer: '4',
    hasBuyer: false,
    hasSeller: false,
    hasCompleter: false,
    hasBidders: false,

}

export const baseBox: TestBoxType = {
    name: 'Test Box',
    project: 'Test Project',
    website: ['https://test.com'],
    token_id: '1',
    //-----------
    type_of_crime: 'Modular',
    title: "This is a test! Here is the title about TruthBox, which directly conveys the key information, allowing others to quickly understand this TruthBox.",
    nft_image: image as string,
    box_image: image2 as string,
    country: 'United States',
    state: 'California',
    description: 'This is a test box',
    create_date: '2021-01-01',
    event_date: '2021-01-01',
    timestamp: 1714531200,
    label: ['Test'],
    mint_method: 'create',
    encryption_slices_metadata_cid: {
        encryption_data: "",
        encryption_iv: "",
    },
    encryption_file_cid: [],
    encryption_passwords: {
        encryption_data: "",
        encryption_iv: "",
    },
    public_key: '',
    file_list: [],
    // password: '',
    // -----
    price: 185000,
    deadline: 1714531200,
    status: 'Selling',
    // -----
    minter: '1',
    owner: '0x1234567890123456789012345678901234567890',
    seller: '2',
    buyer: '3',
    bidders: [],
    completer: '4',
    hasBuyer: false,
    hasSeller: false,
    hasCompleter: false,
    hasBidders: false,
}

export const testBox2: TestBoxType = baseBox;

export const testBox2List: (TestBoxType)[] = [
    ...Array.from({ length: 20 }, (_, i) => ({
        ...baseBox,
        tokenId: i.toString(),
    })),
]


export const testBoxProfile: TestBoxType = baseBox;

export const testBoxProfileList: (TestBoxType)[] = [
    ...Array.from({ length: 20 }, (_, i) => ({
        ...testBoxProfile,
        tokenId: i.toString(),
    })),
]
