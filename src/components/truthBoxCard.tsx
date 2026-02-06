"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import PriceLabel from './base/priceLabel';
import ImageSwiper from './imageSwiper';
import StatusLabel from './base/statusLabel';
import { getBoxCardData } from '@/utils/getBoxCardData';
import { formatPrice } from '@/utils/formatPrice';

export interface BoxCardProps {
    boxImage: string;
    nftImage: string;
    title: string;
    country: string;
    state: string;
    eventDate: string;
    boxId: string;
    price: string;
    status: string;
    tokenSymbol: string;
    tokenDecimals: number;
    precision: number;
    isDisplayPrice: boolean;

}


interface TruthBoxCardProps {
    data: any;
    enableIpfsUrl?: boolean;
    onClick?: () => void;
    className?: string;
    onCompleted?: () => void; 
}

const TruthBoxCard: React.FC<TruthBoxCardProps> = ({
    data,
    enableIpfsUrl = true,
    onClick,
    className,
    onCompleted, 
}) => {

    const cardData = getBoxCardData(data);

    const handleImageLoad = () => {
        if (onCompleted) {
            onCompleted();
            if (import.meta.env.DEV) {
                console.log('onCompleted: truthBoxCard');
            }
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center w-full bg-card",
                "md:max-w-[350px]",     
                "mt-3 sm:mt-4 md:mt-5",
                "border border-border/50",
                "rounded-xl md:rounded-2xl shadow-lg",
                "hover:outline-2 hover:outline-primary",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {/* Image swiper area - use aspectRatio to control the ratio */}
            <div className={cn(
                "w-full overflow-hidden",
                // "rounded-t-xl md:rounded-t-2xl"
            )}>
                <ImageSwiper
                    images={[cardData.boxImage, cardData.nftImage]}
                    enableIpfsUrl={enableIpfsUrl}
                    altPrefix={`truthbox-${cardData.boxId}`}
                    className="w-full"
                    onImageLoad={handleImageLoad} 
                    notifyOnFirstImageOnly={true}
                />
            </div>

            {/* Content area - height adaptive */}
            <div className={cn(
                "w-full bg-card flex flex-col items-center",
                "rounded-b-xl md:rounded-b-2xl",
                "px-2 sm:px-3 md:px-4",
                "py-2 sm:py-2.5 md:py-3"
            )}>
                {/* Title - responsive font size */}
                <p
                    // ellipsis={{ rows: 2 }}
                    className={cn(
                        "text-neutral-300 line-clamp-2",
                        "text-xs sm:text-sm md:text-md",
                        "leading-tight md:leading-normal"
                    )}
                >
                    {cardData.title}
                </p>

                {/* Information row - country and date */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    "mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 md:mt-2 md:mb-2",
                    "min-h-[20px] sm:min-h-[22px] md:min-h-[24px]"
                )}>
                    <p
                        className="text-neutral-300 text-sm line-clamp-1 max-w-[140px] sm:max-w-[160px] md:max-w-[180px]"
                    >
                        {cardData.country} {cardData.state}
                    </p>
                    <p
                        className="text-neutral-300 text-sm line-clamp-1"
                    >
                        {cardData.eventDate}
                    </p>
                </div>

                <hr className="w-full border-neutral-400/50" />

                {/* Bottom information - ID, price, status */}
                <div className={cn(
                    "w-full flex justify-between items-center",
                    "mt-1 mb-0 sm:mt-1.5 sm:mb-0 md:mt-2 md:mb-0",
                    "min-h-[24px] sm:min-h-[26px] md:min-h-[28px]"
                )}>
                    {/* Token ID */}
                    <p className="text-white font-medium shrink-0">
                        {cardData.boxId}
                    </p>

                    {/* Status and price */}
                    <div className={cn(
                        "flex items-center justify-end min-w-0",
                        "gap-1 sm:gap-1.5 md:gap-2"
                    )}>
                        {/* Price component */}
                        {cardData.isDisplayPrice && cardData.price !== undefined && (
                            <PriceLabel
                                data={formatPrice(cardData.price, cardData.tokenDecimals, cardData.precision)}
                                symbol={cardData.tokenSymbol}
                                className="shrink min-w-0"
                            />
                        )}

                        {/* Status label */}
                        <StatusLabel
                            status={cardData.status}
                            size="sm"
                            responsive={true}
                            className="shrink-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TruthBoxCard;


