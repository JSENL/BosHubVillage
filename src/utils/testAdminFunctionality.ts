// Test utility to verify admin event management functionality
import { supabase } from '@/integrations/supabase/client';

export const testEventDeletion = async (eventId: string) => {
  try {
    console.log('🧪 Testing event deletion for ID:', eventId);
    
    // Check if event exists before deletion
    const { data: eventBefore, error: beforeError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (beforeError) {
      console.log('❌ Event not found:', beforeError.message);
      return false;
    }
    
    console.log('✅ Event found before deletion:', eventBefore.title);
    
    // Delete the event
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (deleteError) {
      console.log('❌ Error deleting event:', deleteError.message);
      return false;
    }
    
    // Verify event is gone
    const { data: eventAfter, error: afterError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (afterError && afterError.code === 'PGRST116') {
      console.log('✅ Event successfully deleted - no longer exists in database');
      return true;
    } else if (eventAfter) {
      console.log('❌ Event still exists after deletion');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

export const testEventRejection = async (submissionId: string) => {
  try {
    console.log('🧪 Testing event submission rejection for ID:', submissionId);
    
    // Check if submission exists before rejection
    const { data: submissionBefore, error: beforeError } = await supabase
      .from('event_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    
    if (beforeError) {
      console.log('❌ Submission not found:', beforeError.message);
      return false;
    }
    
    console.log('✅ Submission found before rejection:', submissionBefore.title);
    
    // Reject the submission
    const { error: rejectError } = await supabase
      .from('event_submissions')
      .update({
        status: 'rejected',
        admin_notes: 'Test rejection',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);
    
    if (rejectError) {
      console.log('❌ Error rejecting submission:', rejectError.message);
      return false;
    }
    
    // Verify submission status changed
    const { data: submissionAfter, error: afterError } = await supabase
      .from('event_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    
    if (afterError) {
      console.log('❌ Error checking submission after rejection:', afterError.message);
      return false;
    }
    
    if (submissionAfter.status === 'rejected') {
      console.log('✅ Submission successfully rejected');
      return true;
    } else {
      console.log('❌ Submission status not updated');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

export const testEventApproval = async (submissionId: string) => {
  try {
    console.log('🧪 Testing event submission approval for ID:', submissionId);
    
    // Check if submission exists before approval
    const { data: submission, error: beforeError } = await supabase
      .from('event_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    
    if (beforeError) {
      console.log('❌ Submission not found:', beforeError.message);
      return false;
    }
    
    console.log('✅ Submission found before approval:', submission.title);
    
    // Approve the submission (which should create an event)
    const { error: approveError } = await supabase
      .from('event_submissions')
      .update({
        status: 'approved',
        admin_notes: 'Test approval',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);
    
    if (approveError) {
      console.log('❌ Error approving submission:', approveError.message);
      return false;
    }
    
    // Check if event was created
    const { data: newEvent, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('title', submission.title)
      .eq('created_by', submission.submitted_by)
      .single();
    
    if (eventError) {
      console.log('❌ Event not created after approval:', eventError.message);
      return false;
    }
    
    console.log('✅ Event successfully created after approval:', newEvent.title);
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};