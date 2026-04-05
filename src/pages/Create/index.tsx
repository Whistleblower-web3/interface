'use client';

import FormContainer from './containers/formContainer';
import { cn } from '@/lib/utils';

interface CreateProps {
    className?: string;
}

export default function Create({ className }: CreateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center w-full ", className)}>
            <FormContainer />
        </div>
    );
}
