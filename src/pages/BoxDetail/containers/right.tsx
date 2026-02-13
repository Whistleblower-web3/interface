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
import StatusLabel from '@/components/base/statusLabel';
import ShareSocial from '@/components/shareSoical';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import PriceTimer from '../components/priceTimer';

interface Props {
    tokenId: number | string;
    args?: boolean;
}

const ContentRight: React.FC<Props> = ({ tokenId }) => {
    const { box, metadataBox, isLoading } = useBoxDetailContext();


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

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-muted-foreground text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 md:space-y-6">

            {/* <Typography.Title level={4} style={{ marginBottom: 2 }}>
                    Status:
                </Typography.Title> */}
            <StatusLabel status={status} />
            <StatusStep
                status={status}
                listedMode={listedMode}
                size="sm"
                enableHorizontalScroll={true}
            />

            {status !== 'Published' && (
                <PriceTimer status={status} price={price} token={token} deadline={deadline} />
            )}

            {box?.status === 'Blacklisted' && (
                <Alert message="Warning" description="The NFT is in blacklist, can't do anything!" type="warning" />
            )}

            

            <RoleContainer />

            {/* Status Action Buttons */}
            {renderStatusButton()}

            <hr className="border-border/50" />

            {
                import.meta.env.DEV && (
                    <p className="text-xs text-muted-foreground md:text-md">
                        {JSON.stringify(box, null, 2)}
                    </p>
                )
            }


            {/* Social Share - Commented out for now */}
            <ShareSocial
                title={metadataBox?.title ?? ''}
                description={metadataBox?.description ?? ''}
                image={metadataBox?.nft_image ?? ''}
                url={typeof window !== 'undefined' ? window.location.href : ''}
            />
        </div>
    );
}

export default ContentRight;
