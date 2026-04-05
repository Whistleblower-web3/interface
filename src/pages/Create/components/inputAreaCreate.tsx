import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import { cn } from '@/lib/utils';
import { Input } from 'antd';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { descriptionSchema } from '../validation/schemas';

interface InputAreaCreateProps {
    className?: string;
}

const InputAreaCreate: React.FC<InputAreaCreateProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    return (
        <form.Field 
            name="description"
            validators={{
                onChange: descriptionSchema,
                onBlur: descriptionSchema,
            }}
        >
            {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                return (
                    <div className={cn("flex flex-col w-full space-y-2", className)}>
                        <TextTitle>Description:</TextTitle>
                        <div className="w-full">
                            <Input.TextArea
                                value={String(field.state.value)}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                maxLength={1000}
                                placeholder="Please enter the description (300-1000 characters)"
                                rows={8}
                                showCount
                                allowClear={true}
                                status={hasError ? 'error' : ''}
                            />
                        </div>
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
};

export default InputAreaCreate;