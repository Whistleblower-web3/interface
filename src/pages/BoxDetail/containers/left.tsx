"use client"
import React, { useState } from 'react';
import ImageSwiper from '@/components/imageSwiper';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { Space, Button } from 'antd';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';

interface Props {
    tokenId: number | string;
}

const ContentLeft: React.FC<Props> = ({ tokenId }) => {

    const { box, metadataBox } = useBoxDetailContext()
    const [isExpanded, setIsExpanded] = useState(false);

    // Simple check to determine if we should show the "Show More" button
    // In a real scenario, you might want to measure the element's height
    const description = metadataBox?.description || '';
    const shouldShowButton = description.length > 200; // Rough character limit check


    if (!box) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-muted-foreground text-lg font-mono">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 md:space-y-8">
            <Space direction="vertical" size="middle">

                <div className='flex justify-between w-full'>
                    <Space direction="horizontal" size="middle" align='baseline'>
                        <TextP>Box Id:</TextP>
                        <TextP size='lg' className='text-white'>{tokenId}</TextP>
                    </Space>

                    {/* Owner Information */}
                    <Space direction="horizontal" size="middle">
                        <TextP>Minter:</TextP>{' '}
                        <TextP size='lg' className='text-primary'>{box.minter_id}</TextP>
                    </Space>
                </div>

                <Space direction="horizontal" size="middle">
                    <TextP>Owner:</TextP>{' '}
                    <TextP>{box.owner_address}</TextP>
                </Space>
                <Space direction="horizontal" size="middle">
                    <TextP>Create date:</TextP>{' '}
                    <TextP>{metadataBox?.create_date ? new Date(metadataBox?.create_date).toLocaleString() : ''}</TextP>
                </Space>
            </Space>

            {/* Image Swiper */}
            <div className="w-full bg-black rounded-xl md:rounded-2xl overflow-hidden">
                <div className="aspect-video md:aspect-[4/3] lg:aspect-video">
                    <ImageSwiper
                        images={[metadataBox?.box_image || '', metadataBox?.nft_image || '']}
                        className='w-full'
                    />
                </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
                <TextTitle>{metadataBox?.title}</TextTitle>
            </div>

            {/* Location and Date */}
            <div className="flex flex-col gap-2">
                <TextP>{metadataBox?.country}</TextP>
                <TextP>{metadataBox?.state}</TextP>
                <TextP>{metadataBox?.event_date}</TextP>
            </div>
            <hr className="border-border/50" />
            {/* Description */}
            <div className="space-y-2">
                <div className={`
                    relative transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-none' : 'max-h-[72px] line-clamp-3'}
                    overflow-hidden
                `}>
                    <TextP>{description}</TextP>
                </div>

                {shouldShowButton && (
                    <Button
                        type="link"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-0 h-auto text-primary hover:text-primary/80 font-medium"
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ContentLeft;