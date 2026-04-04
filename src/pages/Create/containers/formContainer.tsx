import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'antd';
import styles from './styles.module.scss';
import CountrySelectorCreate from '@Create/components/countrySelectorCreate';
import DateSelector2 from '@Create/components/dateSelectorCreate';
import InputArea from '@Create/components/inputAreaCreate';
import RadioApp from '@Create/components/radioSelectCreate';
import ImageUpload from '@Create/components/imageUploadCreate';
import FileUpload from '@Create/components/fileUploadCreate';
import { InputTitleCreate } from '@Create/components/inputTitleCreate';
import { InputPriceCreate } from '@Create/components/inputPriceCreate';
import { InputTypeOfCrime } from '@Create/components/inputTypeOfCrime';
import MintButton from '../components/mintButton';
import InputLabel from '@Create/components/inputLabel';
import { CheckAccount } from '@Create/components/checkAccount';
import { useNFTCreateStore } from '@Create/store/useNFTCreateStore';
import { cn } from '@/lib/utils';
import { Container } from '@/components/Container';

// Import workflow related
import { useCheckData } from '@Create/hooks/useCheckData';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useCreateForm } from '../context/CreateFormContext';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import MintProgress from '@/pages/Create/ModalDialog/mintProgress';
import CompletedCreate from '@/pages/Create/ModalDialog/completed';


const FormContainer: React.FC = () => {
  const [showPriceBar, setShowPriceBar] = useState(false);
  const [openModal, setOpenModal] = useState<'mintProgress' | 'completed' | null>(null);

  const boxInfoForm = useNFTCreateStore(state => state.boxInfoForm);
  const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
  const { checkData } = useCheckData();
  const form = useCreateForm();
  const { address } = useWalletContext();

  useEffect(() => {
    if (boxInfoForm && boxInfoForm.mint_method === 'create') {
      setTimeout(() => {
        setShowPriceBar(true);
      }, 50);
    } else {
      setShowPriceBar(false);
    }
  }, [boxInfoForm]);

  const handleCreate = useCallback(async () => {
    // Only trigger if button would be enabled
    if (!form.formState.isValid || !address || workflowStatus === 'processing') {
      return;
    }

    const isDataValid = await checkData();
    if (!isDataValid) {
      return;
    }
    setOpenModal('mintProgress');
  }, [form.formState.isValid, address, workflowStatus, checkData]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      // Don't trigger if in description textarea
      if (target.tagName === 'TEXTAREA') return;
      
      handleCreate();
    }
  };

  const handleCloseModalProgress = () => {
    setOpenModal(null);
  };

  const handleCloseModalCompleted = () => {
    setOpenModal('completed');
  };


  return (
    <Container>
      <div onKeyDown={handleKeyDown} className="w-full">
        <CheckAccount />

        <Card className={styles.formCard}>
          <div className="flex flex-col w-full space-y-2 gap-2">
            <InputTitleCreate />
            <InputArea />
            <CountrySelectorCreate />
            <DateSelector2 />
            <InputTypeOfCrime />
            <InputLabel />
            <RadioApp />

            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              showPriceBar 
                ? "max-h-32 opacity-100 translate-y-0" 
                : "max-h-0 opacity-0 -translate-y-2"
            )}>
              <div className="py-2">
                <InputPriceCreate />
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={styles.formCard}
          style={{ marginTop: '20px', marginBottom: '20px' }}
        >
          <div className="flex flex-col w-full space-y-2 gap-2">
            <ImageUpload />
            <FileUpload />
          </div>
        </Card>

        <div className="flex w-full py-4 mb-4 justify-center">
          <MintButton onClick={handleCreate} />
        </div>
      </div>

      {openModal === 'mintProgress' && (
        <MintProgress onClose={handleCloseModalProgress} onNext={handleCloseModalCompleted} />
      )}
      {openModal === 'completed' && (
        <CompletedCreate onClose={handleCloseModalProgress}/>
      )}
    </Container>
  );
};

export default FormContainer;