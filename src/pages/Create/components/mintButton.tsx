import React from 'react';
import { Button } from 'antd';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useTanStackForm } from '../context/TanStackFormContext';
import TextP from '@/components/base/text_p';

interface MintButtonProps {
  onClick: () => void;
}

const MintButton: React.FC<MintButtonProps> = ({ onClick }) => {
  const { address } = useWalletContext();
  const form = useTanStackForm();
  
  const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);

  return (
    <div className="flex flex-col w-full items-center gap-2">
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isValidating]}>
        {([canSubmit, isSubmitting, isValidating]) => {
          const isProcessing = workflowStatus === 'processing' || isSubmitting;
          const isButtonDisabled = !canSubmit || !address || isProcessing;

          let buttonText = 'Create';
          if (!address) buttonText = 'Connect Wallet';
          else if (isProcessing) buttonText = 'Creating...';

          return (
            <>
              <Button 
                size="large" 
                type="primary"
                onClick={onClick} 
                loading={isProcessing || isValidating} 
                disabled={isButtonDisabled}
                className="h-12 w-full text-lg font-bold"
              >
                {buttonText}
              </Button>
              
              {!canSubmit && address && (
                <TextP size="sm" type="error">
                  Please complete all required fields correctly
                </TextP>
              )}
            </>
          );
        }}
      </form.Subscribe>
    </div>
  );
};

export default MintButton;