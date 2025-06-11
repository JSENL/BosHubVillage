
import { supabase } from '@/integrations/supabase/client';
import { allSampleEvents } from './sampleEvents';
import { toast } from 'sonner';

export const createAllSampleEvents = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to create sample events');
      return;
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!userRole) {
      toast.error('Only admin users can create sample events');
      return;
    }

    console.log(`Creating ${allSampleEvents.length} sample events...`);

    // Insert all sample events
    const eventsWithCreator = allSampleEvents.map(event => ({
      ...event,
      created_by: user.id
    }));

    const { data, error } = await supabase
      .from('events')
      .insert(eventsWithCreator)
      .select();

    if (error) {
      console.error('Error creating sample events:', error);
      toast.error('Failed to create sample events');
      throw error;
    }

    console.log(`Successfully created ${data.length} sample events`);
    toast.success(`Successfully created ${data.length} sample events for Boston neighborhoods`);
    return data;
  } catch (error) {
    console.error('Error creating sample events:', error);
    toast.error('Failed to create sample events');
    throw error;
  }
};

export const clearAllEvents = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to clear events');
      return;
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!userRole) {
      toast.error('Only admin users can clear all events');
      return;
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all events

    if (error) {
      console.error('Error clearing events:', error);
      toast.error('Failed to clear events');
      throw error;
    }

    console.log('Successfully cleared all events');
    toast.success('Successfully cleared all events');
  } catch (error) {
    console.error('Error clearing events:', error);
    toast.error('Failed to clear events');
    throw error;
  }
};
