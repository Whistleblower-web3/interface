'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useIpfsImage } from '@/hooks/useIpfsImage';
import { ImageSwiperUI, ImageSwiperItem } from './base/imageSwiper';
import { cn } from '@/lib/utils';

export interface ImageSwiperCacheProps {
    images: string[];
    /** Aspect ratio, default 1 (1:1). Common values: 1 (1:1), 16/9 (16:9), 4/3 (4:3), 3/2 (3:2) */
    aspectRatio?: number;
    /** Auto play interval time (milliseconds), default 4000ms */
    autoPlayInterval?: number;
    /** Whether to enable auto play, default true */
    autoPlay?: boolean;
    /** Alt attribute prefix for images, default 'image' */
    altPrefix?: string;
    /** Transition animation duration (seconds), default 2s */
    transitionDuration?: number;
    /** Whether to enable dynamic mask effect, default true */
    enableMask?: boolean;
    /** Whether to enable ipfsUrl, default true */
    enableIpfsUrl?: boolean;
    onImageLoad?: () => void;
    /** Whether to notify on the first image completion instead of waiting for all */
    notifyOnFirstImageOnly?: boolean;
    /** Whether to enable local caching, default true */
    enableCache?: boolean;
    className?: string;
}

/**
 * Smart component that wraps individual UI items with IPFS fetching and caching logic
 */
const SwiperImageCache: React.FC<{
    src: string;
    alt: string;
    isActive: boolean;
    isVisible: boolean;
    transitionDuration: number;
    maskStyle: React.CSSProperties;
    enableMask: boolean;
    onLoad: (src: string) => void;
    enableCache: boolean;
    enableIpfsUrl: boolean;
}> = ({ src, alt, isActive, isVisible, transitionDuration, maskStyle, enableMask, onLoad, enableCache, enableIpfsUrl }) => {
    // Parent handles cache/IPFS resolving
    const { displayUrl } = useIpfsImage(src, enableIpfsUrl && enableCache && isVisible);

    const finalUrl = enableIpfsUrl ? displayUrl : src;

    return (
        <ImageSwiperItem
            src={finalUrl}
            alt={alt}
            isActive={isActive}
            isVisible={isVisible}
            transitionDuration={transitionDuration}
            maskStyle={maskStyle}
            enableMask={enableMask}
            onLoad={onLoad}
            onError={(s) => onLoad(s)} // Continue chain on error
            loading={isVisible ? 'eager' : 'lazy'}
        />
    );
};

export const ImageSwiperCache: React.FC<ImageSwiperCacheProps> = ({
    images,
    aspectRatio = 1,
    autoPlayInterval = 4000,
    autoPlay = true,
    className,
    altPrefix = 'image',
    transitionDuration = 2,
    enableMask = true,
    enableIpfsUrl = true,
    onImageLoad,
    notifyOnFirstImageOnly = false,
    enableCache = true,
}) => {
    // Filter out null, undefined and empty strings from images array
    const validImages = useMemo(() =>
        (images || []).filter(img => img && typeof img === 'string' && img.trim() !== ""),
        [images]
    );

    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const hasNotifiedRef = useRef(false);

    // Handle image loading complete
    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imageSrc);
            return newSet;
        });
    }, []);

    // Handle onImageLoad notification logic
    useEffect(() => {
        if (!onImageLoad || hasNotifiedRef.current) return;

        const isComplete = notifyOnFirstImageOnly
            ? loadedImages.size >= 1
            : loadedImages.size === validImages.length;

        if (isComplete) {
            hasNotifiedRef.current = true;
            const timer = setTimeout(() => {
                onImageLoad();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [loadedImages.size, validImages.length, onImageLoad, notifyOnFirstImageOnly]);

    // Reset logic
    useEffect(() => {
        setLoadedImages(new Set());
        hasNotifiedRef.current = false;
    }, [validImages]);

    if (validImages.length === 0) {
        return (
            <div
                className={cn(
                    "w-full bg-black flex items-center justify-center rounded-t-2xl",
                    className
                )}
                style={{ aspectRatio: aspectRatio }}
            >
                <span className="text-white/50">No images available</span>
            </div>
        );
    }

    return (
        <ImageSwiperUI
            itemCount={validImages.length}
            aspectRatio={aspectRatio}
            autoPlayInterval={autoPlayInterval}
            autoPlay={autoPlay}
            enableMask={enableMask}
            className={className}
        >
            {({ currentIndex, maskStyle }) => (
                <>
                    {validImages.map((image, index) => {
                        const isActive = index === currentIndex;
                        const isVisible = isActive || index === (currentIndex - 1 + validImages.length) % validImages.length;

                        return (
                            <SwiperImageCache
                                key={`${image}-${index}`}
                                src={image}
                                alt={`${altPrefix}-${index + 1}`}
                                isActive={isActive}
                                isVisible={isVisible}
                                transitionDuration={transitionDuration}
                                maskStyle={maskStyle}
                                enableMask={enableMask}
                                onLoad={handleImageLoad}
                                enableCache={enableCache}
                                enableIpfsUrl={enableIpfsUrl}
                            />
                        );
                    })}
                </>
            )}
        </ImageSwiperUI>
    );
};

export default ImageSwiperCache;