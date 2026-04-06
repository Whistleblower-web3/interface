import React, { useState } from 'react';
import { FaTwitter, FaFacebook, FaTelegram, FaDownload, FaShareAlt } from 'react-icons/fa';
import { toPng, toBlob } from 'html-to-image';
import SharePoster from '@/components/sharePoster'
import { BoxUnifiedType } from '@/services/supabase/types/types';
import { MetadataBoxType } from '@/types/typesDapp/metadata/metadataBox';
import { PROJECT_NAME } from '@/project';

interface ShareSocialProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    className?: string;
    box?: BoxUnifiedType;
    metadataBox?: MetadataBoxType;
}

const platforms = [
    {
        name: 'Twitter',
        icon: <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />,
        getUrl: (title: string, url: string,) =>
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        color: 'text-primary'
    },
    {
        name: 'Facebook',
        icon: <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />,
        getUrl: (_title: string, url: string,) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        color: 'text-primary'
    },
    {
        name: 'Telegram',
        icon: <FaTelegram className="w-5 h-5 md:w-6 md:h-6" />,
        getUrl: (title: string, url: string,) =>
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        color: 'text-primary'
    }
];

export const ShareSocial: React.FC<ShareSocialProps> = ({
    title = '',
    description = '',
    url = '',
    className = '',
    box,
    metadataBox
}) => {
    const shareTitle = title || description || '';
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePoster = async (type: 'download' | 'share') => {
        if (isGenerating || !box || !metadataBox) return;
        setIsGenerating(true);
        try {
            const isMobile = window.innerWidth < 768;
            const elementId = isMobile ? 'share-poster-capture-mobile' : 'share-poster-capture-pc';
            const element = document.getElementById(elementId);

            if (!element) throw new Error("Poster element not found");
            if (type === 'download') {
                const dataUrl = await toPng(element, {
                    backgroundColor: '#0a0a0a',
                    pixelRatio: 1 // Reduces size by 50% compared to ratio 2
                });
                const link = document.createElement('a');
                link.download = `${PROJECT_NAME.short}-${metadataBox.title.slice(0, 30)}.jpg`;
                link.href = dataUrl;
                link.click();
            } else if (type === 'share' && navigator.share) {
                const blob = await toBlob(element, {
                    backgroundColor: '#0a0a0a',
                    pixelRatio: 1 // Reduces size by 50% compared to ratio 2
                });
                if (blob) {
                    const file = new File([blob], `Poster-${metadataBox.title.slice(0, 30)}.jpg`, { type: 'image/jpg' });
                    await navigator.share({
                        title: shareTitle,
                        text: shareTitle,
                        url: shareUrl,
                        files: [file]
                    });
                }
            }
        } catch (e) {
            console.error("Failed to generate poster", e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={`flex w-full flex-row gap-3 md:gap-4 justify-center items-center ${className}`}>
            {platforms.map((platform) => (
                <a
                    key={platform.name}
                    href={platform.getUrl(shareTitle, shareUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share to ${platform.name}`}
                    className={`shadow-sm transition-colors duration-150 ${platform.color} hover:scale-105`}
                >
                    <div className='w-5 h-5 md:w-7 md:h-7 flex items-center justify-center text-muted-foreground hover:text-primary '>
                        {platform.icon}
                    </div>
                </a>
            ))}

            <div className="w-px h-6 bg-border mx-1"></div>

            <button
                onClick={() => handleGeneratePoster('download')}
                disabled={isGenerating}
                aria-label="Download Poster"
                title="Download Poster"
                className={`shadow-sm transition-colors duration-150 text-primary hover:scale-105 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className='w-5 h-5 md:w-7 md:h-7 flex items-center justify-center text-muted-foreground hover:text-primary'>
                    {isGenerating ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <FaDownload className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
            </button>

            {typeof navigator !== 'undefined' && !!navigator.share && (
                <button
                    onClick={() => handleGeneratePoster('share')}
                    disabled={isGenerating}
                    aria-label="Share Poster"
                    title="Share with App"
                    className={`shadow-sm transition-colors duration-150 text-primary hover:scale-105 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className='w-5 h-5 md:w-7 md:h-7 flex items-center justify-center text-muted-foreground hover:text-primary'>
                        <FaShareAlt className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </button>
            )}

            {/* Hidden containers for rendering the poster */}
            {box && metadataBox && (
                <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -9999, left: '-9999px', top: '-9999px' }}>
                    <SharePoster box={box} metadataBox={metadataBox} url={shareUrl} isMobileLayout={false} />
                    <SharePoster box={box} metadataBox={metadataBox} url={shareUrl} isMobileLayout={true} />
                </div>
            )}
        </div>
    );
};

export default ShareSocial;