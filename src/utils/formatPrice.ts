"use client"

import { Tooltip } from 'antd';
import { formatUnits } from 'viem';
import { formatAmount } from '@dapp/utils/formatAmount';
import { cn } from '@/lib/utils';

export interface PriceTextProps {
    formattedPrice: string;
    fullPrice: string;
}


export const formatPrice = (
    price: string | number | bigint,
    decimals: number = 18,
    precision: number = 3,
): PriceTextProps => {
    let formattedPrice = '0';
    try {
        const formatted = formatAmount(price, decimals, precision);
        // If the decimal part is all 0, only display the integer
        // Handle the case with suffix (e.g. "1.00K", "2.00M")
        const hasSuffix = /[KM]$/.test(formatted);
        if (hasSuffix) {
            // Extract the number part and suffix
            const match = formatted.match(/^([\d.]+)([KM])$/);
            if (match) {
                const numStr = match[1];
                const suffix = match[2];
                const numValue = parseFloat(numStr);
                // If it is an integer, only display the integer part and suffix
                if (Number.isInteger(numValue)) {
                    formattedPrice = `${numValue}${suffix}`;
                } else {
                    // Check if the decimal part is all 0
                    const parts = numStr.split('.');
                    if (parts.length === 2 && /^0+$/.test(parts[1])) {
                        formattedPrice = `${parts[0]}${suffix}`;
                    } else {
                        formattedPrice = formatted;
                    }
                }
            } else {
                formattedPrice = formatted;
            }
        } else {
            // Handle normal number format (e.g. "1.000")
            const numValue = parseFloat(formatted);
            if (Number.isInteger(numValue)) {
                formattedPrice = numValue.toString();
            } else {
                // Check if the decimal part is all 0
                const parts = formatted.split('.');
                if (parts.length === 2) {
                    const fractionalPart = parts[1];
                    // If the decimal part is all 0, only return the integer part
                    if (/^0+$/.test(fractionalPart)) {
                        formattedPrice = parts[0];
                    } else {
                        formattedPrice = formatted;
                    }
                } else {
                    formattedPrice = formatted;
                }
            }
        }
    } catch (error) {
        console.error('Failed to format price:', error);
        formattedPrice = '0';
    }

    // Get full price (for Tooltip)
    let fullPrice = formattedPrice;
    try {
        const priceValue = typeof price === 'bigint'
            ? price
            : typeof price === 'string'
                ? (price.includes('n') ? BigInt(price.replace('n', '')) : BigInt(price))
                : BigInt(Math.floor(Number(price) || 0));

        fullPrice = formatUnits(priceValue, decimals);
    } catch {
        fullPrice = formattedPrice;
    }

    return {
        formattedPrice,
        fullPrice,
    };
};
