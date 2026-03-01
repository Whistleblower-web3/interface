"use client"
import React, { useState, useEffect, useMemo } from 'react';
// import { Typography } from 'antd';
import TextP from '@/components/base/text_p';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import usePriceUSD from '@/hooks/usePriceUSD';
import PriceLabel from '@/components/base/priceLabel';
import { formatPrice } from '@/utils/formatPrice';
import { getTokenMetadata, getTokenMetadataBySymbol } from '@dapp/config/contractsConfig';


interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceContainer: React.FC<Props> = ({ price, token, status, }) => {

    const { getPriceUSD } = usePriceUSD();

    const tokenMetadata = useMemo(() => {
        if (status === 'Delaying') {
            return getTokenMetadataBySymbol('WTRC.S');
        }
        return token ? getTokenMetadata(token as `0x${string}`) : null;
    }, [token, status]);

    const priceUSD = useMemo(() => {
        if (tokenMetadata) {
            return getPriceUSD(tokenMetadata.address, price.toString());
        }
        return 0;
    }, [tokenMetadata, price]);


    return (
        < div className='
        w-full
        px-4 md:px-6 py-3 md:py-6
        border border-border/50
        bg-primary/5
        rounded-xl
        '>
                <div className="w-full flex flex-col items-start ">
                    <h2 className='
                    mb-3 md:mb-5
                    text-lg md:text-xl lg:text-2xl font-bold
                    '>
                        {status === 'Delaying' ? 'Delay Fee:' : 'Price:'}
                    </h2>
                    <PriceLabel
                        size="xl"
                        data={formatPrice(price, tokenMetadata?.decimals, tokenMetadata?.precision)}
                        symbol={tokenMetadata?.symbol}
                    />
                    {priceUSD > 0 && (
                        <span className="flex items-baseline flex-row gap-2">
                            <TextP>≈</TextP>
                            <PriceLabel
                                size="lg"
                                className='text-white/60'
                                data={{
                                    formattedPrice: priceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                    fullPrice: priceUSD.toString()
                                }}
                                symbol="USD"
                            />
                        </span>
                    )}
                </div>
        </div>
    );
}

export default PriceContainer;
