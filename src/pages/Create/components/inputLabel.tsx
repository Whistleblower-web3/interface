"use client"

import React from 'react';
import InputLabel from '@/components/inputLabel';
import { useTanStackForm } from '../context/TanStackFormContext';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';

interface InputLabelCreateProps {
    className?: string;
}

const InputLabelCreate: React.FC<InputLabelCreateProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    return (
        <form.Field name="label">
            {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                return (
                    <div className={cn("w-full", className)}>
                        <InputLabel
                            value={field.state.value || []}
                            onChange={(labels) => field.handleChange(labels)}
                            onBlur={field.handleBlur}
                            maxLabels={10}
                            maxLabelLength={20}
                            placeholder="Enter labels separated by commas (e.g., fraud, corruption, insider trading)"
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
};

export default InputLabelCreate;