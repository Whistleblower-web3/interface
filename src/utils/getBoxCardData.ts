"use client";

import React from 'react';
import { boxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import { getTokenMetadata, getTokenMetadataBySymbol } from '@dapp/config/contractsConfig';
import { BoxCardProps } from '@/components/truthBoxCard';

export  const getBoxCardData = (data: any): BoxCardProps => {
    // Get token metadata, if the token does not exist, do not get token metadata
    let tokenMetadata = data.acceptToken ? getTokenMetadata(data.acceptToken as `0x${string}`) : null;
    if (data.status === 'Delaying') {
        tokenMetadata = getTokenMetadataBySymbol('WTRC.S');
    } 

    const shouldShowPrice = data.status !== boxStatus[0] && data.status !== boxStatus[6] && tokenMetadata !== null;

    return {
        boxImage: data.boxImage,
        nftImage: data.nftImage,
        title: data.title,
        country: data.country,
        state: data.state,
        eventDate: data.eventDate,
        boxId: data.boxId,
        price: data.price,
        status: data.status,
        tokenSymbol: tokenMetadata?.symbol || '',
        tokenDecimals: tokenMetadata?.decimals || 18,
        precision: tokenMetadata?.precision || 1,
        isDisplayPrice: shouldShowPrice,
    };

  }



