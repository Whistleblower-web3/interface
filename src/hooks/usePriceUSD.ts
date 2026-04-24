// import { useQuery } from '@tanstack/react-query';
import {
    // CHAIN_ID,
    ALL_TOKENS,
    TokenMetadata,
} from '@/config/tokenConfig';
import { parseAmountToBigInt } from '@/utils/parseAmountToBigInt';
import { formatUnits } from 'viem';

const TOKEN_PRICE = {
    'WTRC': 0.8,
    'WTRC.S': 0.8,
    'wROSE': 5,
    'wROSE.S': 5,
    'USDC': 1,
    'USDC.S': 1,
    'WBTC': 66050,
    'WBTC.S': 66050,
    'WETH': 2600,
    'WETH.S': 2600,
}


const usePriceUSD = () => {

    const getPriceUSD = (tokenAddress: string, amount: string | number): number => {
        // Find token configuration
        const tokenMetadata = ALL_TOKENS.find(
            (tokenMetadata: TokenMetadata) => tokenMetadata.address.toLowerCase() === tokenAddress.toLowerCase()
        );
        if (!tokenMetadata) {
            throw new Error(`Token ${tokenAddress} not found`);
        }
        // Convert amount to decimal
        const amount_decimal = Number(formatUnits(parseAmountToBigInt(amount.toString()), tokenMetadata.decimals));
        const price = TOKEN_PRICE[tokenMetadata.symbol as keyof typeof TOKEN_PRICE];
        return price * amount_decimal;

    }
    return { getPriceUSD };
};

export default usePriceUSD;

