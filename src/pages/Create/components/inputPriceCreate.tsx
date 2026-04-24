import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import { useAllTokens } from '@dapp/config/tokenConfig';
import { cn } from '@/lib/utils';
import { InputNumber } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { priceSchema } from '../validation/schemas';

interface InputPriceCreateProps {
    className?: string;
}

export const InputPriceCreate: React.FC<InputPriceCreateProps> = ({ className }) => {
    const form = useTanStackForm();
    const supportedTokens = useAllTokens();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    return (
        <form.Field
            name="price"
            validators={{
                onChange: ({ value, fieldApi }) => {
                    const mintMethod = fieldApi.form.getFieldValue('mint_method');
                    if (mintMethod === 'create') {
                        if (value === undefined || value === null || String(value).trim() === '') return 'Price is required';
                        const res = priceSchema.safeParse(value);
                        if (!res.success) return res.error.errors[0].message;
                    }
                    return undefined;
                },
                onBlur: ({ value, fieldApi }) => {
                    const mintMethod = fieldApi.form.getFieldValue('mint_method');
                    if (mintMethod === 'create' && (value === undefined || value === null || String(value).trim() === '')) return 'Price is required';
                    return undefined;
                }
            }}
        >
            {(field) => {
                const mintMethod = field.form.getFieldValue('mint_method');
                const isRequired = mintMethod === 'create';
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

                return (
                    <div className={cn("flex w-full lg:max-w-lg space-y-2", className)}>
                        <div className="flex flex-col w-full gap-2">
                            <TextTitle>Price:</TextTitle>
                            <div className="flex flex-col w-full gap-2">
                                <InputNumber
                                    onChange={(value) => field.handleChange(value === null ? '' : String(value))}
                                    onBlur={field.handleBlur}
                                    value={field.state.value ? (isNaN(Number(field.state.value)) ? undefined : Number(field.state.value)) : undefined}
                                    controls={false}
                                    min={0}
                                    precision={6}
                                    style={{ width: '100%' }}
                                    placeholder={
                                        isRequired
                                            ? "Please enter the price (min: 0.001)"
                                            : "Optional - Leave empty for free"
                                    }
                                    status={hasError ? 'error' : ''}
                                    suffix={<p className="ml-2 text-muted-foreground">{supportedTokens[0].symbol}</p>}
                                />
                                {hasError && (
                                    <TextP size="sm" type="error">
                                        {getErrorMessage(field.state.meta.errors)}
                                    </TextP>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }}
        </form.Field>
    );
};

export default InputPriceCreate;
