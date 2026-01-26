/**
 * IPFS Cache Service
 * Uses Browser Cache API to store IPFS images locally
 */

const CACHE_NAME = 'ipfs-image-cache';
const MAX_AGE_DAYS = 30;

/**
 * Fetch and store image in Cache API
 */
export const fetchAndCacheImage = async (url: string): Promise<string> => {
    if (!('caches' in window)) {
        return url;
    }

    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
            // Check if cached response is still valid (optional metadata check can be added)
            const blob = await cachedResponse.blob();
            return URL.createObjectURL(blob);
        }

        // Fetch from network
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        // Clone response because it can only be consumed once
        const responseToCache = response.clone();
        await cache.put(url, responseToCache);

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('[IPFS Cache] Error:', error);
        return url; // Fallback to original URL
    }
};

/**
 * Clean up old cache entries
 */
export const cleanupIpfsCache = async (): Promise<void> => {
    if (!('caches' in window)) return;

    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        const now = Date.now();
        const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const cacheDate = new Date(dateHeader).getTime();
                    if (now - cacheDate > maxAgeMs) {
                        await cache.delete(request);
                        if (import.meta.env.DEV) {
                            console.log(`[IPFS Cache] Deleted expired entry: ${request.url}`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('[IPFS Cache] Cleanup error:', error);
    }
};

/**
 * Check if a URL is cached
 */
export const isImageCached = async (url: string): Promise<boolean> => {
    if (!('caches' in window)) return false;
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return !!response;
};
