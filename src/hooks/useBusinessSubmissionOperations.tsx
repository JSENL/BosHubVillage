import { useState } from 'react';
import { toast } from 'sonner';

export const useBusinessSubmissionOperations = () => {
  const [actionLoading, setActionLoading] = useState(false);

  const updateSubmissionStatus = async (
    submissionId: string,
    status: 'approved' | 'rejected',
    adminNotes?: string
  ) => {
    setActionLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Mock: Updating business submission ${submissionId} to ${status} with notes: ${adminNotes}`);
      
      toast.success(`Business submission ${status} successfully`);
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update submission status');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    updateSubmissionStatus,
    actionLoading,
  };
};