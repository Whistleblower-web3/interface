"use client";

import { boxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import { getTokenMetadata, getTokenMetadataBySymbol } from '@dapp/config/contractsConfig';
import { BoxCardProps } from '@/components/truthBoxCard';

export  const getBoxCardData = (data: any): BoxCardProps => {
    // if (import.meta.env.DEV) {
    //     console.log('data', data);
    // }
    // Get token metadata, if the token does not exist, do not get token metadata
    let tokenMetadata = data.accept_token ? getTokenMetadata(data.accept_token as `0x${string}`) : null;
    if (data.status === 'Delaying') {
        tokenMetadata = getTokenMetadataBySymbol('WTRC.S');
    } 

    const shouldShowPrice = data.status !== boxStatus[0] && data.status !== boxStatus[6] && tokenMetadata !== null;

    return {
        box_image: data.box_image,
        nft_image: data.nft_image,
        title: data.title,
        country: data.country,
        state: data.state,
        event_date: data.event_date,
        boxId: data.token_id || data.id,
        price: data.price,
        status: data.status,
        tokenSymbol: tokenMetadata?.symbol || '',
        tokenDecimals: tokenMetadata?.decimals || 18,
        precision: tokenMetadata?.precision || 1,
        isDisplayPrice: shouldShowPrice,
    };

  }



