import React from 'react';
import { useNFTCreateStore } from '../store/useNFTCreateStore';
import { useCreateWorkflowStore } from '../store/useCreateWorkflowStore';
import { useTanStackForm } from '../context/TanStackFormContext';
import { initialBoxInfoForm } from '../types/stateType';
import { useChainConfig } from '@dapp/config/chainConfig';
import ModalDialogCompleted, { DataType_Completed } from '@dapp/components/completedModal';


interface ModalProps {
    onClose: () => void;
}

const CompletedCreate: React.FC<ModalProps> = ({ onClose }) => {
    const workflowStore = useCreateWorkflowStore();
    const createStore = useNFTCreateStore();
    const form = useTanStackForm();
    const chainConfig = useChainConfig();

    const boxInfo = createStore.boxInfoForm;
    const all_step_outputs = createStore.all_step_outputs;

    const transactionHash = all_step_outputs.transaction_hash || '';
    const createDate = all_step_outputs.current_time?.create_date || '';

    const data: DataType_Completed = {
        title: boxInfo.title,
        type_of_crime: boxInfo.type_of_crime,
        country: boxInfo.country,
        state: boxInfo.state,
        event_date: boxInfo.event_date,
        transaction_hash: transactionHash,
        create_date: createDate,

    };

    const handleDone = () => {
        form.reset({
            title: initialBoxInfoForm.title,
            description: initialBoxInfoForm.description,
            type_of_crime: initialBoxInfoForm.type_of_crime,
            label: [...initialBoxInfoForm.label],
            country: initialBoxInfoForm.country,
            state: initialBoxInfoForm.state,
            event_date: initialBoxInfoForm.event_date,
            price: initialBoxInfoForm.price,
            mint_method: initialBoxInfoForm.mint_method,
            box_image_list: [],
            file_list: [],
        } as any);

        createStore.resetAllCreateStore();
        workflowStore.resetAllWorkflowStore();
        onClose();
    };

    return (
        <ModalDialogCompleted
            data={data}
            chainConfig={chainConfig}
            onClose={handleDone}
        />
    );
};

export default CompletedCreate;
