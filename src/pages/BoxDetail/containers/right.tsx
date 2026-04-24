"use client"
import React, { useState, useEffect } from 'react';
import { Alert, } from 'antd';
import Storing from '@BoxDetail/statusContainer/Storing';
import Selling from '@BoxDetail/statusContainer/Selling';
import Auction from '@BoxDetail/statusContainer/Auction';
import Paid from '@BoxDetail/statusContainer/Paid';
import Refunding from '@BoxDetail/statusContainer/Refunding';
import Delaying from '@/pages/BoxDetail/statusContainer/Delaying';
import Published from '@BoxDetail/statusContainer/Published';
import StatusStep from '@/components/statusStep';
import RoleContainer from '../components/roleLabel';
import { BoxStatus } from '@dapp/types/typesDapp/contracts/truthBox';
import StatusLabel from '@/components/base/statusTag';
import ShareSocial from '@/components/shareSoical';
// import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import CountdownTimer from '@/components/countdownTimer';
import PriceTag from '@/components/priceTag';
import { BoxUnifiedType } from '@/services/supabase/types/types';
import { MetadataBoxType } from '@/types/typesDapp/metadata/metadataBox';


interface Props {
    box: BoxUnifiedType;
    metadataBox: MetadataBoxType
}

const ContentRight: React.FC<Props> = ({ box, metadataBox }) => {
    // const { box, metadataBox} = useBoxDetailContext();

    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<BoxStatus>('Storing');
    const [listedMode, setListedMode] = useState<string>('');
    const [deadline, setDeadline] = useState<number>(0);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        if (box) {
            setStatus(box.status as BoxStatus);
            setPrice(box.price ?? '');
            setDeadline(Number(box.deadline));
            setToken(box.accepted_token ?? '');
            setListedMode(box.listed_mode ?? 'Selling');
        }
    }, [box]);

    const renderStatusButton = () => {
        switch (status) {
            case 'Storing':
                return <Storing />;
            case 'Selling':
                return <Selling />;
            case 'Auctioning':
                return <Auction />;
            case 'Paid':
                return <Paid />;
            case 'Refunding':
                return <Refunding />;
            case 'Delaying':
                return <Delaying />;
            case 'Published':
                return <Published />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full space-y-4 md:space-y-6">
            <StatusLabel status={status} />
            <StatusStep
                status={status}
                listedMode={listedMode}
                size="sm"
                enableHorizontalScroll={true}
            />

            {status !== 'Published' && (
                <div className="flex flex-col space-y-2 md:space-y-4">
                    {/* <PriceTimer status={status} price={price} token={token} deadline={deadline} /> */}
                    <CountdownTimer targetTime={deadline} size='sm' />
                    <PriceTag status={status} price={price} token={token} />

                </div>

            )}

            {box?.status === 'Blacklisted' && (
                <Alert message="Warning" description="The NFT is in blacklist, can't do anything!" type="warning" />
            )}

            <RoleContainer />

            {/* Status Action Buttons */}
            {renderStatusButton()}

            <hr className="border-border/50" />



            {/* Social Share */}
            <ShareSocial
                title={metadataBox?.title ?? ''}
                description={metadataBox?.description ?? ''}
                image={metadataBox?.box_image ?? ''}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                box={box}
                metadataBox={metadataBox}
            />
        </div>
    );
}

export default ContentRight;
