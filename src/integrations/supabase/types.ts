export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_user_messages: {
        Row: {
          admin_id: string
          created_at: string
          id: string
          message: string
          status: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: string
          message: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string
          recipients_count: number | null
          sent_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message: string
          recipients_count?: number | null
          sent_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          recipients_count?: number | null
          sent_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business: {
        Row: {
          address: string
          address_translations: Json
          business_type: string
          created_at: string
          created_by: string | null
          description: string
          description_translations: Json
          id: string
          is_sponsored: boolean | null
          latitude: number | null
          longitude: number | null
          neighborhood: string
          short_description: string | null
          short_description_translations: Json
          title: string
          title_translations: Json
          updated_at: string
          villages: string | null
          website_link: string | null
        }
        Insert: {
          address: string
          address_translations?: Json
          business_type: string
          created_at?: string
          created_by?: string | null
          description: string
          description_translations?: Json
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhood: string
          short_description?: string | null
          short_description_translations?: Json
          title: string
          title_translations?: Json
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Update: {
          address?: string
          address_translations?: Json
          business_type?: string
          created_at?: string
          created_by?: string | null
          description?: string
          description_translations?: Json
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          short_description?: string | null
          short_description_translations?: Json
          title?: string
          title_translations?: Json
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_comments: {
        Row: {
          business_id: string
          comment: string
          created_at: string
          id: string
          parent_comment_id: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          comment: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          comment?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_comments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "business_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_message_media: {
        Row: {
          business_message_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
        }
        Insert: {
          business_message_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
        }
        Update: {
          business_message_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_message_media_business_message_id_fkey"
            columns: ["business_message_id"]
            isOneToOne: false
            referencedRelation: "business_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      business_messages: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_from_owner: boolean
          message: string
          recipient_id: string
          sender_id: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_from_owner?: boolean
          message: string
          recipient_id: string
          sender_id: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_from_owner?: boolean
          message?: string
          recipient_id?: string
          sender_id?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      business_owner: {
        Row: {
          business_id: string
          created_at: string
          id: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_owner_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      business_submissions: {
        Row: {
          address: string
          admin_notes: string | null
          business_type: string
          created_at: string
          description: string
          id: string
          is_owner: boolean | null
          is_sponsored: boolean | null
          latitude: number | null
          longitude: number | null
          neighborhood: string
          reviewed_at: string | null
          reviewed_by: string | null
          short_description: string | null
          status: string
          submitted_by: string
          title: string
          updated_at: string
          villages: string | null
          website_link: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          business_type: string
          created_at?: string
          description: string
          id?: string
          is_owner?: boolean | null
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhood: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          short_description?: string | null
          status?: string
          submitted_by: string
          title: string
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          business_type?: string
          created_at?: string
          description?: string
          id?: string
          is_owner?: boolean | null
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          short_description?: string | null
          status?: string
          submitted_by?: string
          title?: string
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_media: {
        Row: {
          comment_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_media_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "event_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_admin: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          message: string
          priority: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subject: string
          updated_at: string
          user_email: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          message: string
          priority?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_email: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_email?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_admin_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_admin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_comments: {
        Row: {
          comment: string
          created_at: string
          event_id: string
          id: string
          parent_comment_id: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          event_id: string
          id?: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          event_id?: string
          id?: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "event_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_comments_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_invitations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          invited_by: string
          invited_user_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          invited_by: string
          invited_user_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          invited_by?: string
          invited_user_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          additional_info: string | null
          admin_notes: string | null
          created_at: string
          event_id: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_email: string
          user_id: string
          user_name: string
          user_phone: string | null
        }
        Insert: {
          additional_info?: string | null
          admin_notes?: string | null
          created_at?: string
          event_id: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_email: string
          user_id: string
          user_name: string
          user_phone?: string | null
        }
        Update: {
          additional_info?: string | null
          admin_notes?: string | null
          created_at?: string
          event_id?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string
          user_phone?: string | null
        }
        Relationships: []
      }
      event_submissions: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          date: string
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          is_recurring: boolean | null
          is_sponsored: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          max_attendees: number | null
          neighborhoods: string[] | null
          price: number | null
          recurring_pattern: string | null
          registration_required: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_time: string | null
          status: string
          submitted_by: string
          title: string
          updated_at: string
          villages: string | null
          website_link: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          date: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          is_sponsored?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_attendees?: number | null
          neighborhoods?: string[] | null
          price?: number | null
          recurring_pattern?: string | null
          registration_required?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_time?: string | null
          status?: string
          submitted_by: string
          title: string
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          is_sponsored?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_attendees?: number | null
          neighborhoods?: string[] | null
          price?: number | null
          recurring_pattern?: string | null
          registration_required?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_time?: string | null
          status?: string
          submitted_by?: string
          title?: string
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          category: string
          category_translations: Json
          created_at: string
          created_by: string
          date: string
          description: string | null
          description_translations: Json
          end_time: string | null
          event_type: string | null
          id: string
          is_private: boolean
          is_recurring: boolean | null
          is_sponsored: boolean | null
          latitude: number | null
          location: string
          location_translations: Json
          longitude: number | null
          max_attendees: number | null
          neighborhoods: string | null
          price: number | null
          recurring_pattern: string | null
          registration_required: boolean | null
          start_time: string | null
          title: string
          title_translations: Json
          updated_at: string
          villages: string | null
          website_link: string | null
        }
        Insert: {
          address?: string | null
          category: string
          category_translations?: Json
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          description_translations?: Json
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_private?: boolean
          is_recurring?: boolean | null
          is_sponsored?: boolean | null
          latitude?: number | null
          location: string
          location_translations?: Json
          longitude?: number | null
          max_attendees?: number | null
          neighborhoods?: string | null
          price?: number | null
          recurring_pattern?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title: string
          title_translations?: Json
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          category_translations?: Json
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          description_translations?: Json
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_private?: boolean
          is_recurring?: boolean | null
          is_sponsored?: boolean | null
          latitude?: number | null
          location?: string
          location_translations?: Json
          longitude?: number | null
          max_attendees?: number | null
          neighborhoods?: string | null
          price?: number | null
          recurring_pattern?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title?: string
          title_translations?: Json
          updated_at?: string
          villages?: string | null
          website_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      local_resources: {
        Row: {
          address: string
          address_translations: Json
          category: string
          created_at: string
          description: string | null
          description_translations: Json
          id: string
          is_sponsored: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          name_translations: Json
          neighborhood: string
          permanently_closed: boolean
          updated_at: string
          village: string | null
          website_link: string | null
        }
        Insert: {
          address: string
          address_translations?: Json
          category: string
          created_at?: string
          description?: string | null
          description_translations?: Json
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          name_translations?: Json
          neighborhood: string
          permanently_closed?: boolean
          updated_at?: string
          village?: string | null
          website_link?: string | null
        }
        Update: {
          address?: string
          address_translations?: Json
          category?: string
          created_at?: string
          description?: string | null
          description_translations?: Json
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_translations?: Json
          neighborhood?: string
          permanently_closed?: boolean
          updated_at?: string
          village?: string | null
          website_link?: string | null
        }
        Relationships: []
      }
      local_resources_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          local_resource_id: string
          parent_comment_id: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          local_resource_id: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          local_resource_id?: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "local_services_nonprofits_comme_local_service_nonprofit_id_fkey"
            columns: ["local_resource_id"]
            isOneToOne: false
            referencedRelation: "local_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_services_nonprofits_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "local_resources_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_services_nonprofits_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      local_resources_submissions: {
        Row: {
          address: string
          admin_notes: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_sponsored: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          neighborhood: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_by: string
          updated_at: string
          village: string | null
          website_link: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          neighborhood: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by: string
          updated_at?: string
          village?: string | null
          website_link?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          neighborhood?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string
          updated_at?: string
          village?: string | null
          website_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_services_nonprofits_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_services_nonprofits_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          Address: string | null
          content: string
          content_translations: Json
          created_at: string
          created_by: string | null
          date_posted: string
          id: string
          is_sponsored: boolean | null
          latitude: number | null
          location: string
          location_translations: Json
          longitude: number | null
          source: string
          title: string
          title_translations: Json
          updated_at: string
          villages: string | null
        }
        Insert: {
          Address?: string | null
          content: string
          content_translations?: Json
          created_at?: string
          created_by?: string | null
          date_posted?: string
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          location: string
          location_translations?: Json
          longitude?: number | null
          source: string
          title: string
          title_translations?: Json
          updated_at?: string
          villages?: string | null
        }
        Update: {
          Address?: string | null
          content?: string
          content_translations?: Json
          created_at?: string
          created_by?: string | null
          date_posted?: string
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          location?: string
          location_translations?: Json
          longitude?: number | null
          source?: string
          title?: string
          title_translations?: Json
          updated_at?: string
          villages?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          news_id: string
          parent_comment_id: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          news_id: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          news_id?: string
          parent_comment_id?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "news_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_submission_media: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          news_submission_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          news_submission_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          news_submission_id?: string
        }
        Relationships: []
      }
      news_submissions: {
        Row: {
          Address: string | null
          admin_notes: string | null
          content: string
          created_at: string
          date_posted: string
          id: string
          is_sponsored: boolean | null
          latitude: number | null
          link: string | null
          location: string
          longitude: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          source: string
          status: string
          submitted_by: string
          title: string
          updated_at: string
          villages: string[] | null
        }
        Insert: {
          Address?: string | null
          admin_notes?: string | null
          content: string
          created_at?: string
          date_posted?: string
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          link?: string | null
          location: string
          longitude?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source: string
          status?: string
          submitted_by: string
          title: string
          updated_at?: string
          villages?: string[] | null
        }
        Update: {
          Address?: string | null
          admin_notes?: string | null
          content?: string
          created_at?: string
          date_posted?: string
          id?: string
          is_sponsored?: boolean | null
          latitude?: number | null
          link?: string | null
          location?: string
          longitude?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source?: string
          status?: string
          submitted_by?: string
          title?: string
          updated_at?: string
          villages?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "news_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      past_events: {
        Row: {
          address: string | null
          category: string
          created_at: string
          created_by: string
          date: string
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          is_recurring: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          max_attendees: number | null
          neighborhoods: string | null
          price: number | null
          recurring_pattern: string | null
          start_time: string | null
          title: string
          updated_at: string
          villages: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_attendees?: number | null
          neighborhoods?: string | null
          price?: number | null
          recurring_pattern?: string | null
          start_time?: string | null
          title: string
          updated_at?: string
          villages?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_attendees?: number | null
          neighborhoods?: string | null
          price?: number | null
          recurring_pattern?: string | null
          start_time?: string | null
          title?: string
          updated_at?: string
          villages?: string | null
        }
        Relationships: []
      }
      pdf_extractions: {
        Row: {
          created_at: string
          error_message: string | null
          extracted_text: string | null
          id: string
          original_filename: string
          parsed_event_data: Json | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          extracted_text?: string | null
          id?: string
          original_filename: string
          parsed_event_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          extracted_text?: string | null
          id?: string
          original_filename?: string
          parsed_event_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          followers_count: number
          following_count: number
          full_name: string | null
          id: string
          interests: string[] | null
          is_verified: boolean
          location: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          followers_count?: number
          following_count?: number
          full_name?: string | null
          id: string
          interests?: string[] | null
          is_verified?: boolean
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          followers_count?: number
          following_count?: number
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_verified?: boolean
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          item_id: string
          item_type: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          item_id: string
          item_type: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trending_content: {
        Row: {
          bookmark_count: number
          comment_count: number
          id: string
          item_id: string
          item_type: string
          last_updated: string
          score: number
          view_count: number
        }
        Insert: {
          bookmark_count?: number
          comment_count?: number
          id?: string
          item_id: string
          item_type: string
          last_updated?: string
          score?: number
          view_count?: number
        }
        Update: {
          bookmark_count?: number
          comment_count?: number
          id?: string
          item_id?: string
          item_type?: string
          last_updated?: string
          score?: number
          view_count?: number
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          item_id: string | null
          item_type: string | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          item_id?: string | null
          item_type?: string | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          item_id?: string | null
          item_type?: string | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bookmarks: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_event: {
        Args: { _event_id: string; _user_id: string }
        Returns: boolean
      }
      get_business_owner_id: {
        Args: { _business_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "proprietor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "proprietor"],
    },
  },
} as const
