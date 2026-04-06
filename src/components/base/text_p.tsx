import { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";

export type TextPSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextPType = 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface Props {
    children: ReactNode;
    className?: string;
    size?: TextPSize;
    type?: TextPType;
}

export default function TextP({ children, className, size = 'sm', type = 'default' }: Props) {
    const sizeClass = useMemo(() => {
        return {
            xs: 'text-xxs md:text-xs lg:text-sm',
            sm: 'text-xs md:text-sm lg:text-md',
            md: 'text-sm md:text-md lg:text-base',
            lg: 'text-md md:text-base lg:text-lg',
        };
    }, [size]);

    const typeClass = useMemo(() => {
        return {
            default: 'text-muted-foreground',
            primary: 'text-primary',
            secondary: 'text-secondary',
            error: 'text-error',
            warning: 'text-warning',
            info: 'text-info',
            success: 'text-success',
        };
    }, [type]);

    return (
        <p className={cn(sizeClass[size], typeClass[type], className)}>
            {children}
        </p>
    );
}


