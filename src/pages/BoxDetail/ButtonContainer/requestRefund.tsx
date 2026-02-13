"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { timeToDate } from '@dapp/utils/time';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';
import { useBoxDetailContext } from '../contexts/BoxDetailContext';
import TextP from '@/components/base/text_p';

interface Props {
  onClick?: () => void;
  className?: string;
}

const RequestRefundButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.requestRefund);
  const { box } = useBoxDetailContext();

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
      <div className={cn('flex flex-col items-start')}>
        <TextP type="info">
          Request Refund Deadline: {timeToDate(Number(box?.request_refund_deadline))}
        </TextP>
      </div>
    </BoxActionButton>
  );
};

export default React.memo(RequestRefundButton);
