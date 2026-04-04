'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

export type MaskDirection = 'lt' | 'rt' | 'lb' | 'rb';

export interface ImageSwiperItemProps {
    src: string;
    alt: string;
    isActive: boolean;
    isVisible: boolean;
    transitionDuration: number;
    maskStyle?: React.CSSProperties;
    enableMask?: boolean;
    onLoad?: (src: string) => void;
    onError?: (src: string) => void;
    loading?: 'eager' | 'lazy';
    className?: string;
}

/**
 * Pure UI component for a single image in the swiper with transition effects
 */
export const ImageSwiperItem: React.FC<ImageSwiperItemProps> = ({
    src,
    alt,
    isActive,
    isVisible,
    transitionDuration,
    maskStyle,
    enableMask,
    onLoad,
    onError,
    loading = 'lazy',
    className,
}) => {
    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt}
            className={cn(
                "w-full h-full object-contain absolute left-0 top-0 pointer-events-none",
                "transition-opacity ease-linear",
                isActive ? "opacity-100 z-20" : "opacity-0 z-10",
                className
            )}
            style={{
                transitionDuration: `${transitionDuration}s`,
                ...(isActive && enableMask ? maskStyle : {}),
                transitionProperty: enableMask
                    ? 'opacity, mask-image, -webkit-mask-image'
                    : 'opacity',
            }}
            loading={loading}
            onLoad={() => onLoad?.(src)}
            onError={(e) => {
                console.error(`Failed to load image: ${src}`, e);
                onError?.(src);
            }}
        />
    );
};

export interface ImageSwiperUIProps {
    children: (context: {
        currentIndex: number;
        maskStyle: React.CSSProperties;
        nextImage: () => void;
        getRandomMaskDirection: () => MaskDirection;
    }) => React.ReactNode;
    itemCount: number;
    aspectRatio?: number;
    autoPlayInterval?: number;
    autoPlay?: boolean;
    enableMask?: boolean;
    className?: string;
}

/**
 * Pure UI logic for Managing the swiper state (index, timer, masks)
 */
export const ImageSwiperUI: React.FC<ImageSwiperUIProps> = ({
    children,
    itemCount,
    aspectRatio = 1,
    autoPlayInterval = 4000,
    autoPlay = true,
    enableMask = true,
    className,
}) => {
    // Current displayed image index
    const [currentIndex, setCurrentIndex] = useState(0);
    // Mask direction
    const [maskDir, setMaskDir] = useState<MaskDirection>('lt');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Randomly get mask direction
    const getRandomMaskDirection = useCallback((): MaskDirection => {
        const directions: MaskDirection[] = ['lt', 'rt', 'lb', 'rb'];
        return directions[Math.floor(Math.random() * directions.length)];
    }, []);

    // Switch to the next image
    const nextImage = useCallback(() => {
        if (itemCount <= 1) return;
        setMaskDir(getRandomMaskDirection());
        setCurrentIndex((prevIndex) => (prevIndex + 1) % itemCount);
    }, [itemCount, getRandomMaskDirection]);

    // Auto play logic
    const nextImageRef = useRef(nextImage);
    useEffect(() => {
        nextImageRef.current = nextImage;
    }, [nextImage]);

    useEffect(() => {
        if (!autoPlay || itemCount <= 1) return;

        timerRef.current = setInterval(() => {
            nextImageRef.current();
        }, autoPlayInterval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [autoPlay, autoPlayInterval, itemCount]);

    // Get mask style
    const maskStyle = useMemo(() => {
        if (!enableMask) return {};

        const maskGradients = {
            lt: 'linear-gradient(135deg, #000 60%, transparent 100%)',
            rb: 'linear-gradient(315deg, #000 60%, transparent 100%)',
            rt: 'linear-gradient(225deg, #000 60%, transparent 100%)',
            lb: 'linear-gradient(45deg, #000 60%, transparent 100%)',
        };

        return {
            maskImage: maskGradients[maskDir],
            WebkitMaskImage: maskGradients[maskDir],
        };
    }, [enableMask, maskDir]);

    return (
        <div
            className={cn(
                "w-full bg-black flex justify-center items-center overflow-hidden rounded-t-2xl relative",
                className
            )}
            style={{ aspectRatio: aspectRatio }}
        >
            <div className="w-full h-full relative">
                {children({
                    currentIndex,
                    maskStyle,
                    nextImage,
                    getRandomMaskDirection
                })}
            </div>
        </div>
    );
};
