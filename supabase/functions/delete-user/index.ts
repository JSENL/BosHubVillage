import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'
import { corsHeaders } from '../_shared/cors.ts'

interface DeleteUserRequest {
  userId: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user is admin
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (roleError || !userRole) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const { userId }: DeleteUserRequest = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Don't allow admin to delete themselves
    if (userId === user.id) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete your own account' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // First, handle foreign key dependencies by setting created_by to NULL
    // This preserves the content but removes the user association
    
    // Update business table
    const { error: businessError } = await supabaseAdmin
      .from('business')
      .update({ created_by: null })
      .eq('created_by', userId)
    if (businessError) console.error('Error updating business created_by:', businessError)

    // Update events table
    const { error: eventsError } = await supabaseAdmin
      .from('events')
      .update({ created_by: null })
      .eq('created_by', userId)
    if (eventsError) console.error('Error updating events created_by:', eventsError)

    // Update news table
    const { error: newsError } = await supabaseAdmin
      .from('news')
      .update({ created_by: null })
      .eq('created_by', userId)
    if (newsError) console.error('Error updating news created_by:', newsError)

    // Delete business_owner records
    const { error: businessOwnerError } = await supabaseAdmin
      .from('business_owner')
      .delete()
      .eq('owner_id', userId)
    if (businessOwnerError) console.error('Error deleting business_owner:', businessOwnerError)

    // Delete user_roles
    const { error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
    if (rolesError) console.error('Error deleting user roles:', rolesError)

    // Delete user_followers records (both as follower and following)
    const { error: followersError1 } = await supabaseAdmin
      .from('user_followers')
      .delete()
      .eq('follower_id', userId)
    if (followersError1) console.error('Error deleting follower records:', followersError1)
    
    const { error: followersError2 } = await supabaseAdmin
      .from('user_followers')
      .delete()
      .eq('following_id', userId)
    if (followersError2) console.error('Error deleting following records:', followersError2)

    // Delete email_preferences
    const { error: emailPrefsError } = await supabaseAdmin
      .from('email_preferences')
      .delete()
      .eq('user_id', userId)
    if (emailPrefsError) console.error('Error deleting email preferences:', emailPrefsError)

    // Delete in_app_notifications
    const { error: notificationsError } = await supabaseAdmin
      .from('in_app_notifications')
      .delete()
      .eq('user_id', userId)
    if (notificationsError) console.error('Error deleting notifications:', notificationsError)

    // Delete user_bookmarks
    const { error: bookmarksError } = await supabaseAdmin
      .from('user_bookmarks')
      .delete()
      .eq('user_id', userId)
    if (bookmarksError) console.error('Error deleting bookmarks:', bookmarksError)

    // Delete recently_viewed
    const { error: recentlyViewedError } = await supabaseAdmin
      .from('recently_viewed')
      .delete()
      .eq('user_id', userId)
    if (recentlyViewedError) console.error('Error deleting recently viewed:', recentlyViewedError)

    // Delete saved_searches
    const { error: savedSearchesError } = await supabaseAdmin
      .from('saved_searches')
      .delete()
      .eq('user_id', userId)
    if (savedSearchesError) console.error('Error deleting saved searches:', savedSearchesError)

    // Now delete from profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting user profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user profile: ' + profileError.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Finally delete user from auth (this should cascade to remaining tables)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user from authentication' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})