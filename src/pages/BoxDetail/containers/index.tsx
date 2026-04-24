"use client"
import React, { useState } from 'react';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import ContentLeft from '@/pages/BoxDetail/containers/left';
import ContentRight from '@/pages/BoxDetail/containers/right';

interface Props {
    tokenId?: number | string;
}

const Container_BoxDetail: React.FC<Props> = ({ tokenId }) => {

    const { box, metadataBox } = useBoxDetailContext()


    if (!box || !metadataBox) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-muted-foreground text-lg font-mono">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-12">

            <div className="flex w-full flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Content */}
                <div className="flex-1 lg:max-w-2xl">
                    <ContentLeft box={box} metadataBox={metadataBox} />
                </div>

                {/* Divider - Only visible on desktop */}
                <div className="hidden lg:block w-px bg-border/50 self-stretch"></div>

                {/* Right Content */}
                <div className="flex-1 lg:max-w-xl">
                    <ContentRight box={box} metadataBox={metadataBox} />
                </div>
            </div>

            {/* 展示box */}
            {
                import.meta.env.DEV && (
                    <div className="flex flex-col gap-2 mt-8 pt-8 border-t border-border/50 ">
                        <TextTitle>Box Info</TextTitle>
                        <TextP>Box Id: {box.id}</TextP>
                        <p className='text-xs text-muted-foreground break-all'>Metadata: {JSON.stringify(box)}</p>
                    </div>
                )
            }
        </div>
    );
};

export default Container_BoxDetail;