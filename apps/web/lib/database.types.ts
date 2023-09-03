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
          status: number
          updated_at: string | null
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
          status: number
          updated_at?: string | null
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
          status?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          created_at: string | null
          id: string
          jobid: string
          status: number
          text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          jobid: string
          status: number
          text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          jobid?: string
          status?: number
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notes_jobid_fkey'
            columns: ['jobid']
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
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
