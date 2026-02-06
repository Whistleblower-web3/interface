"use client"
import React from 'react';
import BoxActionButton from '@BoxDetail/components/boxActionButton';
import { useBoxActionController } from '@BoxDetail/hooks/useBoxActionController';
import { boxActionConfigs } from '@BoxDetail/actions/configs';

interface Props {
  onClick?: () => void;
  className?: string;
}

const AgreementButton: React.FC<Props> = ({ onClick, className }) => {
  const controller = useBoxActionController(boxActionConfigs.agreeRefund);

  return (
    <BoxActionButton controller={controller} className={className} onClick={onClick}>
    </BoxActionButton>
  );
};

export default React.memo(AgreementButton);
