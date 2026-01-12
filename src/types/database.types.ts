export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          slug: string
          bio: string | null
          headline: string | null
          profile_photo_url: string | null
          theme: string
          is_published: boolean
          whatsapp_number: string | null
          linkedin_url: string | null
          twitter_url: string | null
          website_url: string | null
          contact_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          slug: string
          bio?: string | null
          headline?: string | null
          profile_photo_url?: string | null
          theme?: string
          is_published?: boolean
          whatsapp_number?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          slug?: string
          bio?: string | null
          headline?: string | null
          profile_photo_url?: string | null
          theme?: string
          is_published?: boolean
          whatsapp_number?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      credentials: {
        Row: {
          id: string
          profile_id: string
          title: string
          institution: string | null
          year_obtained: number | null
          credential_type: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          institution?: string | null
          year_obtained?: number | null
          credential_type?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          institution?: string | null
          year_obtained?: number | null
          credential_type?: string | null
          display_order?: number
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          category: string | null
          icon: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      profile_services: {
        Row: {
          profile_id: string
          service_id: string
          custom_description: string | null
          display_order: number
        }
        Insert: {
          profile_id: string
          service_id: string
          custom_description?: string | null
          display_order?: number
        }
        Update: {
          profile_id?: string
          service_id?: string
          custom_description?: string | null
          display_order?: number
        }
      }
      testimonials: {
        Row: {
          id: string
          profile_id: string
          client_name: string
          client_email: string | null
          client_photo_url: string | null
          client_title: string | null
          content: string
          rating: number | null
          status: string
          is_featured: boolean
          display_order: number
          submission_token: string | null
          submitted_at: string
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          client_name: string
          client_email?: string | null
          client_photo_url?: string | null
          client_title?: string | null
          content: string
          rating?: number | null
          status?: string
          is_featured?: boolean
          display_order?: number
          submission_token?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          client_name?: string
          client_email?: string | null
          client_photo_url?: string | null
          client_title?: string | null
          content?: string
          rating?: number | null
          status?: string
          is_featured?: boolean
          display_order?: number
          submission_token?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Credential = Database['public']['Tables']['credentials']['Row']
export type CredentialInsert = Database['public']['Tables']['credentials']['Insert']
export type CredentialUpdate = Database['public']['Tables']['credentials']['Update']

export type Service = Database['public']['Tables']['services']['Row']
export type ProfileService = Database['public']['Tables']['profile_services']['Row']

export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert']
export type TestimonialUpdate = Database['public']['Tables']['testimonials']['Update']
