"use client"
import React from 'react';
import CountdownTimer from '@/components/countdownTimer2';
import PriceContainer from '@/pages/BoxDetail/components/priceContainer';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';


interface Props {
    status: BoxStatus;
    price: string;
    token: string;
    deadline: number;
}

const PriceTimer: React.FC<Props> = ({ status, price, token, deadline }) => {
    return (
        <div className='
            w-full 
            bg-background/50
            border border-border/50 
            rounded-xl p-4
        '>
            <div className='
                    w-full flex flex-col-reverse md:flex-row 
                    items-center justify-between
                    gap-4 md:gap-6
                '>

                <PriceContainer status={status} price={price} token={token} />

                <div className='hidden md:block w-px self-stretch bg-border/50'></div>
                {/* <div className='
                    min-w-[250px] 
                    flex flex-col items-center justify-center
                '> */}
                    <CountdownTimer targetTime={deadline} mode='CountdownDate' />

                {/* </div> */}

            </div>
        </div>
    );
}

export default PriceTimer;
