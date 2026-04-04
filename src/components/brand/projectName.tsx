import React from 'react';
import { PROJECT_NAME } from '@/assets/projectInfo';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
}

export const ProjectName: React.FC<Props> = ({ className }) => {
    return (

        <span className={twMerge("text-white font-headline font-bold text-lg tracking-tight group-hover:neon-text transition-all",
            className
        )}>
            {PROJECT_NAME.start} <span className="text-primary">{PROJECT_NAME.end}</span>
        </span>
    );
};