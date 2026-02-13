import { MintMethodType } from '@dapp/types/typesDapp/metadata/metadataBox';

export interface CountryProps {
    value: string;
    number: string;
    name: string
}

export type FormFieldName =
    'title' |
    'description' |
    'type_of_crime' |
    'label' |
    'country' |
    'state' |
    'event_date' |
    'nft_owner' |
    'price' |
    'mint_method';

export type FileFieldName = 'file_list' | 'box_image_list';

// All input field names
export type AllInputFieldNames = FormFieldName | FileFieldName;

export const BOX_INFO_FIELDS: FormFieldName[] = [
    'title',
    'description',
    'type_of_crime',
    'label',
    'country',
    'state',
    'event_date',
    'nft_owner',
    'price',
    'mint_method',
];

export interface BoxInfoFormType {
    // tokenId: string | null;
    type_of_crime: string,
    title: string;
    country: string;
    state: string;
    event_date: string;
    description: string;
    label: string[];
    // ---
    mint_method: MintMethodType,
    nft_owner: string,
    price: string,
}

export const initialBoxInfoForm: BoxInfoFormType = {
    title: '',
    description: '',
    label: [],
    country: '',
    state: '',
    event_date: '',
    type_of_crime: '',
    mint_method: 'create',
    nft_owner: '',
    price: '',
}
