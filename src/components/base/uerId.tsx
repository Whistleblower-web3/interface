import TextP, { TextPSize, TextPType } from "./text_p";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import CopyText from "./copyText";

interface Props {
    userId: string;
    size?: TextPSize;
    type?: TextPType;
    showFullAble?: boolean;
    copyAble?: boolean;
    className?: string;
}

export default function UserId({
    userId,
    size = 'xs',
    type = 'secondary',
    showFullAble = false,
    copyAble = false,
    className
}: Props) {
    // State to toggle full ID display
    const [showFull, setShowFull] = useState(false);

    // Derived text for display
    const displayText = useMemo(() => {
        if (!userId) return "";
        if (showFull || userId.length <= 10) return userId;
        return `${userId.slice(0, 4)}...${userId.slice(-4)}`;
    }, [userId, showFull]);

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <TextP type={type} size={size} className="m-0 break-all">{displayText}</TextP>

            {showFullAble && userId.length > 10 && (
                <button
                    onClick={() => setShowFull(!showFull)}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer text-muted-foreground hover:text-primary flex items-center shrink-0"
                    title={showFull ? "Show less" : "Expand"}
                >
                    <ChevronDown size={14} className={cn("transition-transform duration-200", showFull && "rotate-180")} />
                </button>
            )}

            {copyAble && (
                <CopyText text={userId} className="shrink-0" />
            )}
        </div>
    );
}
