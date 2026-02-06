"use client"

import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LiquidChargeGauge from '@/components/svgs/liquidCharge';
import { timeToDate, formatDuration } from '@/utils/time';

// Component properties interface
export interface CountdownTimerProps {
    targetTime: number;
    mode: 'targetDate' | 'CountdownDate'
    className?: string;

}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetTime,
    mode = 'targetDate',
    className,
}) => {

    const [currentTime, setCurrentTime] = useState(Date.now());

    // check targetTime is seconds or milliseconds
    const finalTargetTime = useMemo(() => {
        if (targetTime < 1000000000000) {
            return targetTime * 1000;
        }
        return targetTime;
    }, [targetTime]);

    useEffect(() => {
        if (mode === 'CountdownDate') {
            const timer = setInterval(() => {
                setCurrentTime(Date.now());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [mode]);

    const isEnded = useMemo(() => {
        return currentTime >= finalTargetTime;
    }, [currentTime, finalTargetTime]);

    const statusText = {
        counting: 'Countdown',
        ended: 'Countdown has ended'
    };

    const percentage = useMemo(() => {
        const diff = finalTargetTime - currentTime;
        const year = 365 * 24 * 60 * 60 * 1000;
        return (diff / year) * 100;
    }, [finalTargetTime, currentTime]);

    const displayValue = useMemo(() => {
        if (mode === 'targetDate') {
            return timeToDate(finalTargetTime);
        } else {
            const remaining = Math.max(0, finalTargetTime - currentTime);
            return formatDuration(remaining);
        }
    }, [mode, finalTargetTime, currentTime]);


    return (
        <div 
            className={cn(
                "flex flex-col items-center justify-center",
                className
            )}
        >
            <h2 className="text-sm md:text-md lg:text-lg font-semibold text-muted-foreground">
                {isEnded ? statusText.ended : statusText.counting}
            </h2>

            <div className="
               flex flex-col items-center justify-center
               gap-4 md:gap-6
             ">


            <p className={cn(
                "font-mono",
                "text-xl md:text-2xl lg:text-3xl font-semibold" 
            )}>
                {displayValue}
            </p>

            <div className="relative">

                        <LiquidChargeGauge 
                            value={percentage} 
                            size={200} 
                            primaryColor="#FFA500" 
                            secondaryColor="#FF4500"
                        />
                    </div>
            </div>


        </div>
    );
};


export default CountdownTimer;
