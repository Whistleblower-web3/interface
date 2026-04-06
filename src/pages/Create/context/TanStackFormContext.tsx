import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useForm, FormApi, useStore } from '@tanstack/react-form';
import { CreateFormData, createFormSchema } from '../validation/schemas';
import { useNFTCreateStore } from '../store/useNFTCreateStore';
import { useInputChangeTracker } from '../hooks/useInputChangeTracker';

// Helper to infer the correct FormApi type without hardcoding all 11-12 generics
function _useFormTypeHelper() {
    return useForm({ defaultValues: {} as CreateFormData });
}
type CreateFormApi = ReturnType<typeof _useFormTypeHelper>;

const TanStackFormContext = createContext<CreateFormApi | null>(null);

interface TanStackFormProviderProps {
    children: ReactNode;
}

/**
 * Sync component to handle state persistence to Zustand
 * We use the useStore hook from @tanstack/react-form for reactive value tracking
 */
const FormAutoSync: React.FC = () => {
    const form = useTanStackForm();
    
    // Using the external useStore hook is more reliable than accessing the method via the form instance
    const values = useStore(form.store, (state) => state.values);
    
    useEffect(() => {
        if (!values) return;
        
        const zustandStore = useNFTCreateStore.getState();

        // Use batch updates to keep Zustand in sync with TanStack form
        zustandStore.setBoxInfoForm({
            title: values.title ?? '',
            description: values.description ?? '',
            type_of_crime: values.type_of_crime ?? '',
            label: values.label ?? [],
            country: values.country ?? '',
            state: values.state ?? '',
            event_date: values.event_date ?? '',
            price: values.price ?? '',
            mint_method: values.mint_method ?? 'create',
        });

        zustandStore.updateFileData({
            box_image_list: values.box_image_list ?? [],
            file_list: values.file_list ?? [],
        });
    }, [values]);

    return null;
};

/**
 * TrackerMount component to run current input change detection
 */
const TrackerMount: React.FC = () => {
    const form = useTanStackForm();
    useInputChangeTracker(form);
    return null;
};

/**
 * TanStack Form Provider
 * Handles form state and validation logic for the Create page.
 */
export const TanStackFormProvider: React.FC<TanStackFormProviderProps> = ({ children }) => {
    // Load initial values from Zustand store (persistence)
    const storeState = useNFTCreateStore.getState();
    const defaultBoxInfo = storeState.boxInfoForm;
    const defaultFileData = storeState.fileData;

    const form = useForm({
        defaultValues: {
            title: defaultBoxInfo.title || '',
            description: defaultBoxInfo.description || '',
            type_of_crime: defaultBoxInfo.type_of_crime || '',
            label: defaultBoxInfo.label || [],
            country: defaultBoxInfo.country || '',
            state: defaultBoxInfo.state || '',
            event_date: defaultBoxInfo.event_date || '',
            price: defaultBoxInfo.price || '',
            mint_method: (defaultBoxInfo.mint_method || 'create') as 'create' | 'createAndPublish',
            box_image_list: defaultFileData.box_image_list || [],
            file_list: defaultFileData.file_list || [],
        },
        // Perform whole-form validation on any change to keep canSubmit accurate
        validators: {
            onChange: createFormSchema,
        },
        onSubmit: async ({ value }) => {
            console.log('[TanStackForm] Form submitted:', value);
        },
    });

    return (
        <TanStackFormContext.Provider value={form as any}>
            <FormAutoSync />
            <TrackerMount />
            {children}
        </TanStackFormContext.Provider>
    );
};

export const useTanStackForm = () => {
    const context = useContext(TanStackFormContext);
    if (!context) {
        throw new Error('useTanStackForm must be used within TanStackFormProvider');
    }
    return context;
};
