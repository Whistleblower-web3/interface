import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export const ButtonContainer: React.FC<Props> = ({ children, className }) => {
    return (
        <div className={`
            flex flex-row w-full
            p-2 items-center gap-2
            bg-background rounded-md md:rounded-xl
         ${className}`}>
            {children}
        </div>
    );
};