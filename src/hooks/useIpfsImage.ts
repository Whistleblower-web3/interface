import { useState, useEffect } from 'react';
import { fetchAndCacheImage } from '@/services/ipfsCache/ipfsCache';
import { ipfsCidToUrl } from '@/services/ipfsUrl/ipfsCidToUrl';

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
        displayUrl: url ? ipfsCidToUrl(url) : url,
        isLoading: enabled,
        error: null,
        isCached: false,
    });

    useEffect(() => {
        const resolvedUrl = url ? ipfsCidToUrl(url) : url;

        if (!enabled || !resolvedUrl) {
            setState(prev => ({ ...prev, displayUrl: resolvedUrl, isLoading: false }));
            return;
        }

        let isMounted = true;
        let objectUrl: string | null = null;

        const loadImage = async () => {
            setState(prev => ({ ...prev, isLoading: true }));
            try {
                // If the URL is already a blob/data URL, don't re-cache
                if (resolvedUrl.startsWith('blob:') || resolvedUrl.startsWith('data:')) {
                    if (isMounted) {
                        setState({
                            displayUrl: resolvedUrl,
                            isLoading: false,
                            error: null,
                            isCached: true
                        });
                    }
                    return;
                }

                const resultUrl = await fetchAndCacheImage(resolvedUrl);
                
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
                        displayUrl: resolvedUrl,
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
