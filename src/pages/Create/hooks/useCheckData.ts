import { useTanStackForm } from '../context/TanStackFormContext';

/**
 * Data Validation Hook (Refactored)
 * Uses TanStack Form for validation
 */
export const useCheckData = () => {
  const form = useTanStackForm();
  
  const checkData = async (): Promise<boolean> => {
    // Trigger all field validations
    await form.validateAllFields('submit');
    const isValid = form.state.canSubmit;
    
    if (!isValid) {
      console.error('Form validation failed:', form.state.errors);
      return false;
    }
    
    return true;
  };

  return { checkData };
}; 