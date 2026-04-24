"use client"
import CommonSelect, { CommonSelectOption } from '@/components/base/commonSelect';
import { useAllTokens } from '@dapp/config/tokenConfig';
import { useEffect, useState } from 'react';

interface TokenSelectorProps {
    onChange: (token: CommonSelectOption | null) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onChange }) => {
    const allTokens = useAllTokens();
    const [value, setValue] = useState<CommonSelectOption | null>(null)
    const options: CommonSelectOption[] = allTokens.filter(token => token.isAccepted).map(token => ({
        // icon: '/token/usdt.png',
        name: token.name,
        symbol: token.symbol,
        value: token.address,
        decimals: token.decimals
    }));

    const handleChange = (option: CommonSelectOption | null) => {
        onChange(option);
        setValue(option)
    }

    useEffect(() => {
        setValue(options[0])
    }, [])

    return (
        <CommonSelect
            options={options}
            value={value}
            onChange={handleChange}
            placeholder="Please select a token"
        />
    )
}

export default TokenSelector;