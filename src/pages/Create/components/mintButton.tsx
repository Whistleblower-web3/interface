import React, { useMemo } from 'react';
import { Button } from 'antd';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useCreateForm } from '../context/CreateFormContext';
import TextP from '@/components/base/text_p';

interface MintButtonProps {
  onClick: () => void;
}

const MintButton: React.FC<MintButtonProps> = ({ onClick }) => {
  const { address } = useWalletContext();
  const form = useCreateForm();
  const { formState } = form;
  const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
  
  const { errors, isValid } = formState;
  const hasKnownErrors = Object.keys(errors).length > 0;

  const isButtonDisabled = 
    !isValid ||
    !address || 
    workflowStatus === 'processing';

  const buttonText = useMemo(() => {
    if (!address) return 'Connect Wallet';
    if (workflowStatus === 'processing') return 'Creating...';
    return 'Create';
  }, [address, workflowStatus]);

  return (
    <div className="flex flex-col w-full items-center gap-2">
      <Button 
        size="large" 
        type="primary"
        onClick={onClick} 
        loading={workflowStatus === 'processing'} 
        disabled={isButtonDisabled}
        className="w-full"
      >
        {buttonText}
      </Button>
      
      {hasKnownErrors && (
        <TextP size="sm" type="error">
          {Object.keys(errors).length} field(s) need attention - Click to see all errors
        </TextP>
      )}
    </div>
  );
};

export default MintButton;