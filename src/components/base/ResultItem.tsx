"use client"

import React from 'react';
import { Alert } from 'antd';
import { cn } from "@/lib/utils";
import { 
    CheckCircle, 
    XCircle, 
    Loader2, 
    Circle, 
    FastForward,
} from "lucide-react";

export interface ResultItemProps {
    title: string;
    isLoading?: boolean;
    isComplete?: boolean;
    isSkipped?: boolean;
    error?: string | null;
    onClick?: () => void;
    isClickable?: boolean;
    className?: string;
    variant?: 'default' | 'compact';
    showIcon?: boolean;
    description?: string;
}

/**
 * Modernized result item component
 * Using shadcn/ui design system, conforms to the overall project style.
 */
const ResultItem: React.FC<ResultItemProps> = ({
    title,
    isLoading = false,
    isComplete = false,
    isSkipped = false,
    error = null,
    onClick,
    isClickable = false,
    className,
    variant = 'default',
    showIcon = true,
    description
}) => {
    // Get status icon
    const renderStatusIcon = () => {
        if (!showIcon) return null;

        const iconClasses = "h-4 w-4 shrink-0";

        if (isComplete) {
            return <CheckCircle className={cn(iconClasses, "text-primary")} />;
        } else if (isSkipped) {
            return <FastForward className={cn(iconClasses, "text-muted-foreground")} />;
        } else if (error) {
            return <XCircle className={cn(iconClasses, "text-destructive")} />;
        } else if (isLoading) {
            return <Loader2 className={cn(iconClasses, "text-primary animate-spin")} />;
        } else {
            return <Circle className={cn(iconClasses, "text-muted-foreground")} />;
        }
    };

    // Get status text
    const getStatusText = () => {
        if (isComplete) {
            return "Success";
        } else if (isSkipped) {
            return "Skipped";
        } else if (error) {
            return "Error";
        } else if (isLoading) {
            return "Processing...";
        } else {
            return "Waiting...";
        }
    };

    // Get status text color
    const getStatusTextColor = () => {
        if (isComplete) {
            return "text-green-600";
        } else if (isSkipped) {
            return "text-muted-foreground";
        } else if (error) {
            return "text-destructive";
        } else if (isLoading) {
            return "text-primary";
        } else {
            return "text-muted-foreground";
        }
    };

    // Compact style
    if (variant === 'compact') {
        return (
            <div 
                className={cn(
                    "flex items-center gap-3 p-3 rounded-md transition-all duration-200",
                    "bg-card border border-border",
                    isClickable && [
                        "cursor-pointer hover:bg-accent/50 hover:border-primary/50",
                        "hover:shadow-sm active:scale-[0.98]",
                        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                    ],
                    !isClickable && error && "border-destructive/50 bg-destructive/5",
                    !isClickable && isComplete && "border-primary/50 bg-primary/5",
                    className
                )}
                onClick={isClickable ? onClick : undefined}
            >
                {renderStatusIcon()}
                
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">
                        {title}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium", getStatusTextColor())}>
                        {getStatusText()}
                    </span>
                    {isClickable && (
                        <ChevronRight className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary" />
                    )}
                </div>
            </div>
        );
    }

    // Default style
    return (
        <div className={cn("space-y-2", className)}>
            <div 
                className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                    "bg-card border border-border",
                    isClickable && [
                        "cursor-pointer hover:bg-accent/50 hover:border-primary/50",
                        "hover:shadow-md hover:scale-[1.01]",
                        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    ],
                    !isClickable && error && "border-destructive/50 bg-destructive/5",
                    !isClickable && isComplete && "border-green-500/50 bg-green-500/5",
                    !isClickable && isSkipped && "border-muted/50 bg-muted/5"
                )}
                onClick={isClickable ? onClick : undefined}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                            {title}
                        </h4>
                    </div>
                    
                    {description && (
                        <p className="text-xs text-muted-foreground truncate">
                            {description}
                        </p>
                    )}
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                    <div className="flex items-center gap-2">
                        {renderStatusIcon()}
                        <span className={cn("text-sm font-medium", getStatusTextColor())}>
                            {getStatusText()}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Error message */}
            {error && (
                <Alert 
                    message='Error' 
                    description={error}
                    type="error" 
                    showIcon={true}
                />
            )}
        </div>
    );
};

export default ResultItem; 