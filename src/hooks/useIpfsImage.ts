import { useState, useEffect } from 'react';
import { fetchAndCacheImage } from '@/services/ipfsCache/ipfsCache';

interface UseIpfsImageReturn {
    displayUrl: string;
    isLoading: boolean;
    error: any;
    isCached: boolean;
}

/**
 * Hook to load IPFS image with local caching
 */
export const useIpfsImage = (url: string, enabled: boolean = true): UseIpfsImageReturn => {
    const [state, setState] = useState<UseIpfsImageReturn>({
        displayUrl: url,
        isLoading: enabled,
        error: null,
        isCached: false,
    });

    useEffect(() => {
        if (!enabled || !url) {
            setState(prev => ({ ...prev, displayUrl: url, isLoading: false }));
            return;
        }

        let isMounted = true;
        let objectUrl: string | null = null;

        const loadImage = async () => {
            setState(prev => ({ ...prev, isLoading: true }));
            try {
                // If the URL is already a blob/data URL, don't re-cache
                if (url.startsWith('blob:') || url.startsWith('data:')) {
                    if (isMounted) {
                        setState({
                            displayUrl: url,
                            isLoading: false,
                            error: null,
                            isCached: true
                        });
                    }
                    return;
                }

                const resultUrl = await fetchAndCacheImage(url);
                
                if (isMounted) {
                    const isNewBlob = resultUrl.startsWith('blob:');
                    if (isNewBlob) objectUrl = resultUrl;

                    setState({
                        displayUrl: resultUrl,
                        isLoading: false,
                        error: null,
                        isCached: isNewBlob
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setState({
                        displayUrl: url,
                        isLoading: false,
                        error: err,
                        isCached: false
                    });
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [url, enabled]);

    return state;
};
