import React, { useState, useCallback } from 'react';
import { Card } from 'antd';
import styles from './styles.module.scss';
import CountrySelectorCreate from '@Create/components/countrySelectorCreate';
import DateSelectorCreate from '@Create/components/dateSelectorCreate';
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
import { cn } from '@/lib/utils';
import { Container } from '@/components/Container';

// Import workflow related
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useTanStackForm, TanStackFormProvider } from '../context/TanStackFormContext';
import { useWalletContext } from '@dapp/contexts/web3Context/useAccount/WalletContext';
import MintProgress from '@/pages/Create/ModalDialog/mintProgress';
import CompletedCreate from '@/pages/Create/ModalDialog/completed';

const FormContent: React.FC = () => {
    const [openModal, setOpenModal] = useState<'mintProgress' | 'completed' | null>(null);

    const workflowStatus = useCreateWorkflowStore(state => state.workflowStatus);
    const form = useTanStackForm();
    const { address } = useWalletContext();

    const handleCreate = useCallback(async () => {
        // Trigger validation across all fields
        const errors = await form.validateAllFields('submit');

        // If form is valid and ready, open the progress modal
        // Note: form.state.values are automatically synced to Zustand by FormAutoSync
        if (form.state.canSubmit && address && workflowStatus !== 'processing') {
            setOpenModal('mintProgress');
        } else {
            console.warn('[FormContainer] Cannot start workflow:', {
                canSubmit: form.state.canSubmit,
                hasAddress: !!address,
                status: workflowStatus,
                errors
            });
        }
    }, [form, address, workflowStatus]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            // Prevent Enter from submitting if in a textarea
            if (target.tagName === 'TEXTAREA') return;
            handleCreate();
        }
    };

    return (
        <div onKeyDown={handleKeyDown} className="w-full">
            <CheckAccount />

            <Card className={styles.formCard}>
                <div className="flex flex-col w-full space-y-4">
                    <InputTitleCreate />
                    <InputArea />
                    <CountrySelectorCreate />
                    <DateSelectorCreate />
                    <InputTypeOfCrime />
                    <InputLabel />

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                        <RadioApp />

                        <form.Subscribe selector={(state) => state.values.mint_method}>
                            {(mintMethod) => {
                                const isShown = mintMethod === 'create';
                                return (
                                    <div className={cn(
                                        "transition-all duration-300 ease-in-out",
                                        isShown
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 -translate-y-2 invisible h-0"
                                    )}>
                                        <InputPriceCreate />
                                    </div>
                                );
                            }}
                        </form.Subscribe>
                    </div>
                </div>
            </Card>

            <Card className={styles.formCard} style={{ marginTop: '1rem' }}>
                <div className="flex flex-col w-full space-y-4">
                    <ImageUpload />
                    <FileUpload />
                </div>
            </Card>

            <div className="flex w-full py-8 justify-center">
                <MintButton onClick={handleCreate} />
            </div>

            {openModal === 'mintProgress' && (
                <MintProgress
                    onClose={() => setOpenModal(null)}
                    onNext={() => setOpenModal('completed')}
                />
            )}
            {openModal === 'completed' && (
                <CompletedCreate onClose={() => setOpenModal(null)} />
            )}
        </div>
    );
};

const FormContainer: React.FC = () => {
    return (
        <Container>
            <TanStackFormProvider>
                <FormContent />
            </TanStackFormProvider>
        </Container>
    );
};

export default FormContainer;