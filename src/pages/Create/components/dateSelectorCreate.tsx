'use client'

import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import { DateSelector } from '@/components/dateSelector';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { eventDateSchema } from '../validation/schemas';

interface DateSelectorCreateProps {
    className?: string;
}

const DateSelectorCreate: React.FC<DateSelectorCreateProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    return (
        <form.Field 
            name="event_date"
            validators={{
                onChange: eventDateSchema,
                onBlur: eventDateSchema,
            }}
        >
            {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                return (
                    <div className={cn("flex flex-col w-full lg:max-w-[300px] space-y-2", className)}>
                        <TextTitle>Event Date:</TextTitle>
                        <div className="w-full">
                            <DateSelector
                                onSuccess={(date) => field.handleChange(date.value)}
                                value={field.state.value || undefined}
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

export default DateSelectorCreate;
