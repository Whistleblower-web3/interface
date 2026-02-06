"use client"

import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import { cn } from '@/lib/utils';

export interface PriceTextProps {
    formattedPrice: string;
    fullPrice: string;
}

export interface PriceLabelProps {
    data: PriceTextProps;
    symbol?: string;
    showSymbol?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    unitPosition?: 'left' | 'right';
    responsive?: boolean;
}


const PriceLabel: React.FC<PriceLabelProps> = ({
    data,
    symbol = 'ETH',
    showSymbol = true,
    className = '',
    size = 'sm',
    unitPosition = 'right',
    responsive = true,
}) => {


    // Get style configuration based on size
    const sizeConfig_price = useMemo(() => {
        return {
            sm: 'text-xs md:text-sm lg:text-base',
            md: 'text-sm md:text-md lg:text-lg',
            lg: 'text-lg md:text-xl lg:text-2xl',
            xl: 'text-xl md:text-2xl lg:text-3xl',
        };
    }, [size]);
    const sizeConfig_symbol = useMemo(() => {
        return {
            sm: 'text-xs md:text-sm',
            md: 'text-sm md:text-base ',
            lg: 'text-md md:text-lg ',
            xl: 'text-lg md:text-xl ',
        };
    }, [size]);

    // Build price text
    const priceElement = (
        <p className={cn("text-white", sizeConfig_price[size], className)}>
            {data.formattedPrice}
        </p>
    );

    // Symbol element
    const symbolElement = showSymbol && symbol ? (
        <p className={cn(sizeConfig_symbol[size], "text-muted-foreground")}>
            {symbol}
        </p>
    ) : null;

    // Build content array
    const contentElements = [];

    if (unitPosition === 'left' && symbolElement) {
        contentElements.push(symbolElement);
    }

    // Wrap price text (if the full price is different, display Tooltip)
    const priceWithTooltip = data.fullPrice !== data.formattedPrice ? (
        <Tooltip title={data.fullPrice}>
            {priceElement}
        </Tooltip>
    ) : priceElement;

    contentElements.push(priceWithTooltip);

    if (unitPosition === 'right' && symbolElement) {
        contentElements.push(symbolElement);
    }

    return (
        <div
            className={cn(
                'inline-flex items-end',
                responsive ? 'gap-2' : 'gap-1',
                'font-mono'
            )}
        >
            {contentElements.map((element, index) => (
                <React.Fragment key={`price-label-${index}`}>
                    {element}
                </React.Fragment>
            ))}
        </div>
    );
};

export default PriceLabel; 