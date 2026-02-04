import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAutoTranslate } from './useAutoTranslate';

export const useBusinessSubmissionOperations = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const { translateContent } = useAutoTranslate();

  const updateSubmissionStatus = async (
    submissionId: string,
    status: 'approved' | 'rejected',
    adminNotes?: string
  ) => {
    setActionLoading(true);
    let newBusinessId: string | null = null;
    
    try {
      if (status === 'approved') {
        console.log('🔍 Admin approving business submission:', submissionId);
        
        // First get the submission data
        const { data: submission, error: fetchError } = await supabase
          .from('business_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (fetchError) {
          console.error('❌ Error fetching submission:', fetchError);
          throw fetchError;
        }
        
        console.log('📄 Submission data:', submission);

        // Insert into business table and get new business id
        const { data: insertedBusiness, error: insertError } = await supabase
          .from('business')
          .insert({
            title: submission.title,
            business_type: submission.business_type,
            address: submission.address,
            neighborhood: submission.neighborhood,
            description: submission.description,
            short_description: submission.short_description,
            latitude: submission.latitude,
            longitude: submission.longitude,
            website_link: submission.website_link,
            villages: submission.villages,
            created_by: submission.submitted_by
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('❌ Error inserting into business table:', insertError);
          throw insertError;
        }
        
        newBusinessId = insertedBusiness?.id || null;
        console.log('✅ Business successfully added to main table with id:', newBusinessId);

        // If the submitter indicated ownership, create ownership record
        if (submission.is_owner && insertedBusiness?.id) {
          // Check if ownership record already exists
          const { data: existingOwnership } = await supabase
            .from('business_owner')
            .select('id')
            .eq('business_id', insertedBusiness.id)
            .eq('owner_id', submission.submitted_by)
            .single();

          if (!existingOwnership) {
            const { error: ownerInsertError } = await supabase
              .from('business_owner')
              .insert({
                business_id: insertedBusiness.id,
                owner_id: submission.submitted_by
              });

            if (ownerInsertError) {
              // If it's a duplicate key error, that's okay - ownership already exists
              if (ownerInsertError.code !== '23505') {
                console.error('❌ Error creating business ownership:', ownerInsertError);
                throw ownerInsertError;
              } else {
                console.log('ℹ️ Ownership record already exists');
              }
            } else {
              console.log('👤 Ownership recorded: submitter is the business owner');
            }
          } else {
            console.log('ℹ️ Ownership record already exists');
          }
        }
      }

      // Update submission status (this will trigger deletion if approved)
      const { error: updateError } = await supabase
        .from('business_submissions')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;
      
      toast.success(`Business submission ${status} successfully`);

      // Trigger auto-translation for the new business
      if (status === 'approved' && newBusinessId) {
        translateContent('business', newBusinessId, false);
      }
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