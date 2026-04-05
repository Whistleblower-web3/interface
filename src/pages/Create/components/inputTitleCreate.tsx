import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import { cn } from '@/lib/utils';
import { Input } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { titleSchema } from '../validation/schemas';

interface InputTitleCreateProps {
    className?: string;
}

/**
 * Displaying form field error messages correctly.
 * Added isTouched check to prevent premature validation display while still enforcing form validity.
 */
export const InputTitleCreate: React.FC<InputTitleCreateProps> = ({ className }) => {
    const form = useTanStackForm();

    return (
        <form.Field
            name="title"
            validators={{
                onChange: titleSchema,
                onBlur: titleSchema,
            }}
        >
            {(field) => (
                <div className={cn("w-full space-y-2", className)}>
                    <TextTitle>Title:</TextTitle>
                    <Input
                        type="text"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        maxLength={150}
                        placeholder="Please enter the title (50-150 characters)"
                        allowClear={true}
                        showCount
                        status={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'error' : ''}
                    />

                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <TextP size="sm" type="error">
                            {field.state.meta.errors.map((err: any) => 
                                typeof err === 'string' ? err : (err?.message || String(err))
                            ).join(', ')}
                        </TextP>
                    )}
                </div>
            )}
        </form.Field>
    );
};

export default InputTitleCreate;