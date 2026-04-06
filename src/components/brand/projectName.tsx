import React from 'react';
import { PROJECT_NAME } from '@/assets/projectInfo';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string
}

export const ProjectName: React.FC<Props> = ({ size = 'md', className }) => {
    const sizeMap = {
        sm: 'text-sm md:text-base lg:text-lg',
        md: 'text-base md:text-lg lg:text-xl',
        lg: 'text-lg md:text-xl lg:text-2xl',
        xl: 'text-xl md:text-2xl lg:text-3xl'
    }
    return (

        <span className={twMerge("text-white font-headline font-bold tracking-tight group-hover:neon-text transition-all",
            sizeMap[size],
            className
        )}>
            {PROJECT_NAME.start} <span className="text-primary">{PROJECT_NAME.end}</span>
        </span>
    );
};