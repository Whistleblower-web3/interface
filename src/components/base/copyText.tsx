import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyTextProps {
    text: string;
    children?: React.ReactNode;
    className?: string;
    iconSize?: number;
    showIcon?: boolean;
    successMessage?: string;
}

/**
 * Reusable Copy component that shows localized feedback.
 */
const CopyText: React.FC<CopyTextProps> = ({ 
    text, 
    children, 
    className, 
    iconSize = 14,
    showIcon = true,
    successMessage = "Copied!"
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!text) return;
        
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <div className={cn("relative inline-flex items-center gap-1.5", className)}>
            {children}
            <div 
                onClick={handleCopy}
                className="cursor-pointer text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                title="Copy to clipboard"
            >
                {copied ? (
                    <span className="text-[10px] text-success font-bold flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                        <Check size={iconSize} className="text-success" />
                        {successMessage}
                    </span>
                ) : (
                    showIcon && <Copy size={iconSize} className="transition-transform active:scale-90" />
                )}
            </div>
        </div>
    );
};

export default CopyText;
