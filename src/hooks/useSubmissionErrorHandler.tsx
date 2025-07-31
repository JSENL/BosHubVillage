
import { toast } from 'sonner';

export const useSubmissionErrorHandler = () => {
  const handleSubmissionError = (error: any, submissionType: 'news' | 'business' | 'local resource') => {
    console.error(`${submissionType} submission error:`, error);
    
    let errorMessage = `Failed to submit ${submissionType}.`;
    
    // Handle specific error types
    if (error?.code === 'PGRST116') {
      errorMessage = `${submissionType} submission failed: Authentication required. Please sign in and try again.`;
    } else if (error?.code === '23505') {
      errorMessage = `${submissionType} submission failed: A duplicate entry was detected. Please check your information.`;
    } else if (error?.code === '23502') {
      errorMessage = `${submissionType} submission failed: Missing required information. Please fill in all required fields.`;
    } else if (error?.code === '42501') {
      errorMessage = `${submissionType} submission failed: You don't have permission to perform this action.`;
    } else if (error?.message?.includes('JWT')) {
      errorMessage = `${submissionType} submission failed: Your session has expired. Please refresh the page and sign in again.`;
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      errorMessage = `${submissionType} submission failed: Network connection issue. Please check your internet connection and try again.`;
    } else if (error?.message?.includes('geocod')) {
      errorMessage = `${submissionType} submission failed: Could not verify the address location. Please check the address and try again.`;
    } else if (error?.message) {
      errorMessage = `${submissionType} submission failed: ${error.message}`;
    }

    // Show error toast with detailed message
    toast.error(errorMessage, {
      duration: 6000,
      style: {
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
        color: '#dc2626'
      }
    });

    return errorMessage;
  };

  const handleValidationError = (missingFields: string[], submissionType: string) => {
    const errorMessage = `Please fill in the following required fields: ${missingFields.join(', ')}`;
    
    toast.error(`${submissionType} submission incomplete`, {
      description: errorMessage,
      duration: 5000,
      style: {
        backgroundColor: '#fef3c7',
        borderColor: '#fcd34d',
        color: '#d97706'
      }
    });

    return errorMessage;
  };

  return {
    handleSubmissionError,
    handleValidationError
  };
};
