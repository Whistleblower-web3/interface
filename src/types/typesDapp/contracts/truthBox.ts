
export interface CreateArgsType{
    to_: string;
    tokenCID_: string;
    boxInfoCID_: string;
    key_: string;
    price_: number;
}

export interface CreateAndPublishArgsType{
    to_: string;
    tokenCID_: string;
    boxInfoCID_: string;
    key_: string;
}

export type FunctionNameType_TruthBox = 
'create' |
'createAndPublish' |
'publishByMinter' | 
'publishByBuyer' | 
'payDelayFee' |
'addBoxToBlacklist' |
'extendDeadline';


export const boxStatus = [
    'Storing',
    'Selling',
    'Auctioning',
    'Paid',
    'Refunding',
    'Delaying',
    'Published',
    'Blacklisted',
] as const;

export type BoxStatus = typeof boxStatus[number];

// 将number 转换为 string
export const boxStatusMap_string: Record<number, BoxStatus> = {
    0: 'Storing',
    1: 'Selling',
    2: 'Auctioning',
    3: 'Paid',
    4: 'Refunding',
    5: 'Delaying',
    6: 'Published',
    7: 'Blacklisted',
};

// 将string 转换为 number
export const boxStatusMap_number: Record<BoxStatus, number> = {
    'Storing': 0,
    'Selling': 1,
    'Auctioning': 2,
    'Paid': 3,
    'Refunding': 4,
    'Delaying': 5,
    'Published': 6,
    'Blacklisted': 7,
};

// get
export interface BoxBasicDataType {
    price: number;
    deadline: number;
    status: BoxStatus;
}

//----

export interface BoxUserDataType {
    minter:string,
    owner:string,
    seller:string,
    buyer:string,
    bidders:string[],
    completer:string,
    // -----
    hasBuyer: boolean,
    hasSeller: boolean,
    hasCompleter: boolean,
    hasBidders: boolean,
}


// NftDetail_two
export interface BoxDetailDataType {
    refundRequestTimestamp: number,
    purchaseTimestamp: number,
    overDeadline:boolean,
    isInBlacklist:boolean,
    refundPermit: boolean,
    inRefundDeadline: boolean,
    inReviewDeadline: boolean,
    
    owner:string,
    buyer:string,
    noBuyer: boolean,
    fileUri:string,
}

