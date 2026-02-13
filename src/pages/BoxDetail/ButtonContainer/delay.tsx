"use client"
import React, { useMemo, useState } from 'react';
// import { Typography, Button } from 'antd';
import { cn } from '@/lib/utils';
import { useProtocolConstants } from '@dapp/config/contractsConfig';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import { useBoxDetailContext } from '@BoxDetail/contexts/BoxDetailContext';
import ModalBuyBidPay from '@/pages/BoxDetail/Modal/modalBuyBidDelay';
import TextP from '@/components/base/text_p';
import { getTokenMetadataBySymbol } from '@dapp/config/contractsConfig';
import BoxActionButton from '@BoxDetail/components/boxActionButton';

interface Props {
  onClick?: () => void;
  className?: string;
}

const DelayButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.delay);
  const { box } = useBoxDetailContext();
  const {
    delayFeeExtensionPeriod,
    incrementRate,
  } = useProtocolConstants();
  const [open, setOpen] = useState(false);

  const handleDelay = () => {
    onClick?.();
    setOpen(true);
  };

  // const tokenAddress = box?.accepted_token as `0x${string}` | undefined;
  const amount = useMemo(() => {
    const price = box?.price;
    return price ? price.toString() : '0';
  }, [box?.price]);

  // const disabled = controller.isDisabled || !tokenAddress;

  return (
      <BoxActionButton controller={controller} className={className} onClick={handleDelay}>

      <div className={cn('flex flex-col items-start')}>
        <TextP>
          Pay the delay fee to extend the publish deadline: {delayFeeExtensionPeriod / 24 / 3600} days
        </TextP>
        <TextP>
          The increment rate: {incrementRate}%
        </TextP>
      </div>


      <ModalBuyBidPay
        open={open}
        onClose={() => setOpen(false)}
        boxId={box?.id?.toString() || ''}
        tokenAddress={getTokenMetadataBySymbol('WTRC.S').address}
        amount={amount}
        functionName="delay"
      />

    </BoxActionButton>
  );
};

export default React.memo(DelayButton); 
