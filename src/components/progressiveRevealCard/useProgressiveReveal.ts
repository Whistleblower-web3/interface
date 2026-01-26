import { useState, useEffect, useCallback, useRef } from 'react';

export interface ProgressiveItem<T = any> {
    data: T | null;
    status: 'skeleton' | 'transitioning' | 'revealed' | 'error';
    index: number;
}

export interface UseProgressiveRevealConfig {
    /** Display delay interval for each project (milliseconds) */
    revealDelay?: number;
    /** Transition animation duration (milliseconds) */
    transitionDuration?: number;
    initialCount?: number;
    /** Whether to clean up timers when the component is unmounted */
    cleanupOnUnmount?: boolean;
    /** Whether to trigger the next based on image loading completion (instead of time delay) */
    waitForImageLoad?: boolean; 
    /** Maximum number of projects items allowed to be in the "transitioning" or "awaiting load" state at once */
    revealWindowSize?: number;
}

export interface UseProgressiveRevealReturn<T> {
    /** Current project list status */
    items: ProgressiveItem<T>[];
    /** Start progressive display (reset mode) */
    startReveal: (data: T[]) => void;
    /** Incremental progressive display (retain displayed projects, only display progressive projects for new projects) */
    appendReveal: (newData: T[]) => void;
    /** Reset to initial state */
    reset: () => void;
    /** Whether progressive display is in progress */
    isRevealing: boolean;
    /** Completed display project quantity */
    revealedCount: number;
    /** Total progress (0-1) */
    progress: number;
    /** Notify the loading completion of a specific index (only used when waitForImageLoad=true) */
    notifyCompleted: (index: number) => void; 
}

/**
 * Progressive display Hook
 */
export function useProgressiveReveal<T = any>(
    config: UseProgressiveRevealConfig = {}
): UseProgressiveRevealReturn<T> {
    const {
        revealDelay = 200,
        transitionDuration = 300,
        initialCount = 20,
        cleanupOnUnmount = true,
        waitForImageLoad = false, 
        revealWindowSize = 3,
    } = config;

    const [items, setItems] = useState<ProgressiveItem<T>[]>([]);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);
    
    const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
    const processedDataLengthRef = useRef(0);

    const imageLoadStatusRef = useRef<Map<number, boolean>>(new Map());
    const nextIndexToRevealRef = useRef<number>(0);
    const pendingDataRef = useRef<T[]>([]);
    const isProcessingImageLoadRef = useRef<boolean>(false);
    const activeRevealCountRef = useRef<number>(0);

    const clearAllTimeouts = useCallback(() => {
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current.clear();
    }, []);

    const initializeItems = useCallback((count: number) => {
        const initialItems: ProgressiveItem<T>[] = Array.from({ length: count }, (_, index) => ({
            data: null,
            status: 'skeleton',
            index
        }));
        setItems(initialItems);
        setRevealedCount(0);
        processedDataLengthRef.current = 0;
    }, []);

    const revealItems = useCallback((data: T[], startIndex: number = 0, resetMode: boolean = false) => {
        const itemsToReveal = resetMode ? data : data.slice(startIndex);

        clearAllTimeouts();
        setIsRevealing(true);

        if (resetMode) {
            setRevealedCount(0);
            processedDataLengthRef.current = 0;
        }

        if (waitForImageLoad) {
            pendingDataRef.current = [...data];
            nextIndexToRevealRef.current = resetMode ? 0 : startIndex;
            imageLoadStatusRef.current.clear();
            isProcessingImageLoadRef.current = false;
            activeRevealCountRef.current = 0;

            setItems(prevItems => {
                const requiredCount = data.length;
                if (import.meta.env.DEV && prevItems.length !== requiredCount) {
                    console.log(`🔄 useProgressiveReveal: Resizing items array to ${requiredCount}`);
                }
                return Array.from({ length: requiredCount }, (_, index) => ({
                    data: null,
                    status: 'skeleton' as const,
                    index
                }));
            });

            if (resetMode && data.length > 0) {
                const initialBatchSize = Math.min(revealWindowSize, data.length);
                
                for (let i = 0; i < initialBatchSize; i++) {
                    const index = i;
                    setTimeout(() => {
                        setItems(prevItems => {
                            const newItems = [...prevItems];
                            if (newItems[index]) {
                                newItems[index] = {
                                    data: data[index],
                                    status: 'transitioning',
                                    index
                                };
                            }
                            return newItems;
                        });
                        
                        activeRevealCountRef.current++;
                        
                        setTimeout(() => {
                            setItems(prevItems => {
                                const newItems = [...prevItems];
                                if (newItems[index] && data[index]) {
                                    newItems[index] = {
                                        data: data[index],
                                        status: 'revealed',
                                        index
                                    };
                                }
                                return newItems;
                            });
                        }, transitionDuration / 2);
                    }, i * (revealDelay / 2));
                    
                    nextIndexToRevealRef.current = i + 1;
                }
            }
            return;
        }

        // Normal mode: based on time delay
        setItems(prevItems => {
            if (resetMode) {
                return Array.from({ length: data.length }, (_, index) => ({
                    data: null,
                    status: 'skeleton' as const,
                    index
                }));
            } else {
                const newItems = [...prevItems];
                const requiredCount = Math.max(data.length, prevItems.length);
                for (let i = prevItems.length; i < requiredCount; i++) {
                    newItems.push({ data: null, status: 'skeleton', index: i });
                }
                return newItems;
            }
        });

        itemsToReveal.forEach((itemData: T, relativeIndex: number) => {
            const absoluteIndex = resetMode ? relativeIndex : startIndex + relativeIndex;
            
            const startTransitionTimeout = setTimeout(() => {
                setItems(prevItems => {
                    const newItems = [...prevItems];
                    if (newItems[absoluteIndex]) {
                        newItems[absoluteIndex] = { ...newItems[absoluteIndex], status: 'transitioning' };
                    }
                    return newItems;
                });

                const completeRevealTimeout = setTimeout(() => {
                    setItems(prevItems => {
                        const newItems = [...prevItems];
                        if (newItems[absoluteIndex]) {
                            newItems[absoluteIndex] = { data: itemData, status: 'revealed', index: absoluteIndex };
                        }
                        return newItems;
                    });

                    setRevealedCount(prev => {
                        const newCount = prev + 1;
                        if (relativeIndex === itemsToReveal.length - 1) {
                            setIsRevealing(false);
                            processedDataLengthRef.current = data.length;
                        }
                        return newCount;
                    });
                    timeoutsRef.current.delete(completeRevealTimeout);
                }, transitionDuration / 2);

                timeoutsRef.current.add(completeRevealTimeout);
                timeoutsRef.current.delete(startTransitionTimeout);
            }, relativeIndex * revealDelay);

            timeoutsRef.current.add(startTransitionTimeout);
        });
    }, [revealDelay, transitionDuration, clearAllTimeouts, waitForImageLoad, revealWindowSize]);

    const handleCompleted = useCallback((index: number) => {
        if (import.meta.env.DEV) {
            console.log('handleImageLoaded: useProgressiveReveal', index);
        }
        if (!waitForImageLoad) return;

        setTimeout(() => {
            imageLoadStatusRef.current.set(index, true);
            activeRevealCountRef.current = Math.max(0, activeRevealCountRef.current - 1);
            
            setRevealedCount(prev => {
                const newCount = prev + 1;
                if (newCount >= pendingDataRef.current.length) {
                    setIsRevealing(false);
                    processedDataLengthRef.current = pendingDataRef.current.length;
                }
                return newCount;
            });

            const checkAndRevealNext = () => {
                if (isProcessingImageLoadRef.current) return;
                if (nextIndexToRevealRef.current >= pendingDataRef.current.length) return;
                
                if (activeRevealCountRef.current < revealWindowSize) {
                    const nextIndex = nextIndexToRevealRef.current;
                    isProcessingImageLoadRef.current = true;
                    activeRevealCountRef.current++;
                    nextIndexToRevealRef.current++;

                    setItems(prevItems => {
                        const newItems = [...prevItems];
                        if (newItems[nextIndex]) {
                            newItems[nextIndex] = { ...newItems[nextIndex], status: 'transitioning' };
                        }
                        return newItems;
                    });

                    setTimeout(() => {
                        setItems(prevItems => {
                            const newItems = [...prevItems];
                            if (newItems[nextIndex] && pendingDataRef.current[nextIndex]) {
                                newItems[nextIndex] = {
                                    data: pendingDataRef.current[nextIndex],
                                    status: 'revealed',
                                    index: nextIndex
                                };
                            }
                            return newItems;
                        });
                        isProcessingImageLoadRef.current = false;
                        checkAndRevealNext();
                    }, transitionDuration / 2);
                }
            };
            checkAndRevealNext();
        }, 0);
    }, [waitForImageLoad, transitionDuration, revealWindowSize]);

    const startReveal = useCallback((data: T[]) => {
        revealItems(data, 0, true);
    }, [revealItems]);

    const appendReveal = useCallback((newData: T[]) => {
        revealItems(newData, processedDataLengthRef.current, false);
    }, [revealItems]);

    const reset = useCallback(() => {
        clearAllTimeouts();
        setIsRevealing(false);
        initializeItems(initialCount);
    }, [clearAllTimeouts, initializeItems, initialCount]);

    const progress = items.length > 0 ? revealedCount / items.length : 0;

    useEffect(() => {
        initializeItems(initialCount);
    }, [initializeItems, initialCount]);

    useEffect(() => {
        if (cleanupOnUnmount) {
            return () => clearAllTimeouts();
        }
    }, [cleanupOnUnmount, clearAllTimeouts]);

    return {
        items,
        startReveal,
        appendReveal,
        reset,
        isRevealing,
        revealedCount,
        progress,
        notifyCompleted: handleCompleted, 
    };
} 