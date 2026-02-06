"use client"
import React, { useState, useEffect, useMemo } from 'react';
// import { Typography } from 'antd';
import TextP from '@/components/base/text_p';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import useGetTokenPrice from '@dapp/config/contractsConfig/useGetTokenPrice';
import PriceLabel from '@/components/base/priceLabel';
import { formatPrice } from '@/utils/formatPrice';
import { getTokenMetadata, getTokenMetadataBySymbol } from '@dapp/config/contractsConfig';


interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceContainer: React.FC<Props> = ({ price, token, status, }) => {

    const { getTokenPrice } = useGetTokenPrice();

    // const [priceUSD, setPriceUSD] = useState<number>(0);

    const tokenMetadata = useMemo(() => {
        if (status === 'Delaying') {
            return getTokenMetadataBySymbol('WTRC.S');
        }
        return token ? getTokenMetadata(token as `0x${string}`) : null;
    }, [token, status]);

    const priceUSD = useMemo(() => {
        if (tokenMetadata) {
            return getTokenPrice(tokenMetadata.address, Number(price));
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
                        Price:
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
                                data={formatPrice(priceUSD, 18, 1)}
                                symbol="USD"
                            />
                        </span>
                    )}
                </div>
        </div>
    );
}

export default PriceContainer;


/**
 * formatPrice.ts:20 React has detected a change in the order of Hooks called by PriceContainer. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
1. useMemo                    useMemo
2. useMemo                    useMemo
3. useMemo                    useMemo
4. useMemo                    useMemo
5. undefined                  useMemo
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
useGetTokenPrice.ts:36 price: 4.8 amount_decimal: 84699.32638087851
useGetTokenPrice.ts:36 price: 4.8 amount_decimal: 84699.32638087851
chunk-7CHZ2Z4V.js?v=fffdbb07:5792 Uncaught Error: Rendered more hooks than during the previous render.
    at formatPrice (formatPrice.ts:20:28)
    at PriceContainer (priceContainer.tsx:64:39)

 */