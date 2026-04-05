import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import { cn } from '@/lib/utils';
import { Input } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { typeOfCrimeSchema } from '../validation/schemas';

interface InputTypeOfCrimeProps {
    className?: string;
}

export const InputTypeOfCrime: React.FC<InputTypeOfCrimeProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    const handleSanitizedChange = (value: string, field: any) => {
        const sanitizedValue = value.replace(/[^\p{L}\s]/gu, '');
        field.handleChange(sanitizedValue);
    };

    return (
        <form.Field 
            name="type_of_crime"
            validators={{
                onChange: typeOfCrimeSchema,
                onBlur: typeOfCrimeSchema,
            }}
        >
            {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                return (
                    <div className={cn("flex flex-col w-full space-y-2", className)}>
                        <TextTitle>Crime Event Type:</TextTitle>
                        <TextP size="sm" type="secondary">
                            Such as: Modular, Insider Trading, etc.
                        </TextP>
                        <Input
                            onChange={(e) => handleSanitizedChange(e.target.value, field)}
                            onBlur={field.handleBlur}
                            value={field.state.value}
                            placeholder="Please input the type of crime"
                            maxLength={20}
                            className="w-full max-w-xs"
                            allowClear={true}
                            status={hasError ? 'error' : ''}
                        />
                        {hasError && (
                            <TextP size="sm" type="error">
                                {getErrorMessage(field.state.meta.errors)}
                            </TextP>
                        )}
                    </div>
                );
            }}
        </form.Field>
    );
}

export default InputTypeOfCrime;
