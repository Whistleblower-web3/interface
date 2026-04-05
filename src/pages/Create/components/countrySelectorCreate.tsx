'use client'

import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import CountrySelector, { CountryStateSelection } from '@dapp/components/countrySelector/countrySelector2';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { countrySchema } from '../validation/schemas';

interface CountrySelectorCreateProps {
    className?: string;
}

const CountrySelectorCreate: React.FC<CountrySelectorCreateProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    return (
        <form.Field 
            name="country"
            validators={{
                onChange: countrySchema,
                onBlur: countrySchema,
            }}
        >
            {(field) => {
                const stateValue = field.form.getFieldValue('state');
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                
                const handleSelectionChange = (selection: CountryStateSelection | null) => {
                    if (selection) {
                        field.handleChange(selection.country.name);
                        field.form.setFieldValue('state', selection.state.name);
                    } else {
                        field.handleChange('');
                        field.form.setFieldValue('state', '');
                    }
                };

                return (
                    <div className={cn("flex flex-col w-full lg:w-md space-y-2", className)}>
                        <TextTitle>Country/Region:</TextTitle>
                        <div className="w-full">
                            <CountrySelector
                                onSelectionChange={handleSelectionChange}
                                placeholder={{
                                    country: "Select a country",
                                    state: "Select a state"
                                }}
                                initialCountry={field.state.value || undefined}
                                initialState={stateValue || undefined}
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

export default CountrySelectorCreate;
