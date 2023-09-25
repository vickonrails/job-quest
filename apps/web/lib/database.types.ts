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
      jobs: {
        Row: {
          company_name: string
          company_site: string | null
          created_at: string | null
          description: string | null
          id: string
          labels: string[] | null
          link: string | null
          location: string | null
          position: string
          priority: number | null
          source: string | null
          source_id: string | null
          status: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          company_site?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          labels?: string[] | null
          link?: string | null
          location?: string | null
          position: string
          priority?: number | null
          source?: string | null
          source_id?: string | null
          status: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          company_site?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          labels?: string[] | null
          link?: string | null
          location?: string | null
          position?: string
          priority?: number | null
          source?: string | null
          source_id?: string | null
          status?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      notes: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          status: number
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          status: number
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          status?: number
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notes_job_id_fkey'
            columns: ['job_id']
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email_address: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email_address?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email_address?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
