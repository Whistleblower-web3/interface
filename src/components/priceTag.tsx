"use client"
import React, { useMemo } from 'react';
import TextP from '@/components/base/text_p';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import usePriceUSD from '@/hooks/usePriceUSD';
import PriceText from '@/components/base/priceText';
import { formatPrice } from '@/utils/formatPrice';
import { getTokenByAddress, getTokenBySymbol } from "@dapp/config/tokenConfig";


interface Props {
    price: string | number;
    token: string;
    status?: BoxStatus;
}

const PriceTag: React.FC<Props> = ({ price, token, status, }) => {

    const { getPriceUSD } = usePriceUSD();

    const tokenMetadata = useMemo(() => {
        if (status === 'Delaying') {
            return getTokenBySymbol('WTRC.Privacy');
        }
        return getTokenByAddress(token as `0x${string}`);
    }, [token, status]);

    const priceUSD = useMemo(() => {
        if (tokenMetadata) {
            return getPriceUSD(tokenMetadata.address, price.toString());
        }
        return 0;
    }, [tokenMetadata, price]);


    return (
        < div className='
        px-4 md:px-6 py-1.5 md:py-3
        border-2 border-primary/50
        bg-primary/10 shadow-primary
        rounded-lg md:rounded-xl
        '>
            <div className="w-full flex flex-row items-baseline gap-2">
                <h2 className='
                    text-sm md:text-base lg:text-lg
                    '>
                    {status === 'Delaying' ? 'Delay Fee:' : 'Price:'}
                </h2>
                <PriceText
                    size="xl"
                    data={formatPrice(price, tokenMetadata?.decimals, tokenMetadata?.precision)}
                    symbol={tokenMetadata?.symbol}
                />
                {priceUSD > 0 && (
                    <span className="flex items-baseline flex-row gap-2">
                        <TextP> ≈ </TextP>
                        <PriceText
                            size="lg"
                            className='text-white/80'
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

export default PriceTag;
