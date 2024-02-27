export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cover_letters: {
        Row: {
          id: string
          text: string | null
        }
        Insert: {
          id?: string
          text?: string | null
        }
        Update: {
          id?: string
          text?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string | null
          location: string | null
          resume_id: string | null
          start_date: string
          still_studying_here: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string | null
          location?: string | null
          resume_id?: string | null
          start_date: string
          still_studying_here?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string | null
          location?: string | null
          resume_id?: string | null
          start_date?: string
          still_studying_here?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'education_resume_id_fkey'
            columns: ['resume_id']
            isOneToOne: false
            referencedRelation: 'resumes'
            referencedColumns: ['id']
          }
        ]
      }
      highlights: {
        Row: {
          education_id: string | null
          id: string
          text: string
          type: string | null
          work_experience_id: string | null
        }
        Insert: {
          education_id?: string | null
          id?: string
          text: string
          type?: string | null
          work_experience_id?: string | null
        }
        Update: {
          education_id?: string | null
          id?: string
          text?: string
          type?: string | null
          work_experience_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'highlights_education_id_fkey'
            columns: ['education_id']
            isOneToOne: false
            referencedRelation: 'education'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'highlights_work_experience_id_fkey'
            columns: ['work_experience_id']
            isOneToOne: false
            referencedRelation: 'work_experience'
            referencedColumns: ['id']
          }
        ]
      }
      jobs: {
        Row: {
          company_name: string
          company_site: string | null
          cover_letter_id: string | null
          created_at: string | null
          description: string | null
          id: string
          keywords: string[] | null
          labels: string[] | null
          link: string | null
          location: string | null
          order_column: number | null
          position: string
          priority: number | null
          resume_id: string | null
          source: string | null
          source_id: string | null
          status: number
          updated_at: string | null
        }
        Insert: {
          company_name: string
          company_site?: string | null
          cover_letter_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          labels?: string[] | null
          link?: string | null
          location?: string | null
          order_column?: number | null
          position: string
          priority?: number | null
          resume_id?: string | null
          source?: string | null
          source_id?: string | null
          status: number
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          company_site?: string | null
          cover_letter_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          labels?: string[] | null
          link?: string | null
          location?: string | null
          order_column?: number | null
          position?: string
          priority?: number | null
          resume_id?: string | null
          source?: string | null
          source_id?: string | null
          status?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_cover_letter_id_fkey'
            columns: ['cover_letter_id']
            isOneToOne: false
            referencedRelation: 'cover_letters'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'jobs_resume_id_fkey'
            columns: ['resume_id']
            isOneToOne: false
            referencedRelation: 'resumes'
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
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          status: number
          text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          status?: number
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notes_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email_address: string | null
          full_name: string | null
          github_url: string | null
          id: string
          is_profile_setup: boolean | null
          linkedin_url: string | null
          location: string | null
          personal_website: string | null
          professional_summary: string | null
          skills: Database['public']['CompositeTypes']['skill'][] | null
          title: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          email_address?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          is_profile_setup?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          personal_website?: string | null
          professional_summary?: string | null
          skills?: Database['public']['CompositeTypes']['skill'][] | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          email_address?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          is_profile_setup?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          personal_website?: string | null
          professional_summary?: string | null
          skills?: Database['public']['CompositeTypes']['skill'][] | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          resume_id: string | null
          skills: Database['public']['CompositeTypes']['skill'][] | null
          start_date: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          resume_id?: string | null
          skills?: Database['public']['CompositeTypes']['skill'][] | null
          start_date?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          resume_id?: string | null
          skills?: Database['public']['CompositeTypes']['skill'][] | null
          start_date?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_resume_id_fkey'
            columns: ['resume_id']
            isOneToOne: false
            referencedRelation: 'resumes'
            referencedColumns: ['id']
          }
        ]
      }
      resumes: {
        Row: {
          created_at: string | null
          email_address: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          personal_website: string | null
          professional_summary: string | null
          skills: Database['public']['CompositeTypes']['skill'][] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_address?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          personal_website?: string | null
          professional_summary?: string | null
          skills?: Database['public']['CompositeTypes']['skill'][] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_address?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          personal_website?: string | null
          professional_summary?: string | null
          skills?: Database['public']['CompositeTypes']['skill'][] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          company_name: string | null
          created_at: string | null
          end_date: string | null
          id: string
          job_title: string | null
          location: string | null
          resume_id: string | null
          start_date: string
          still_working_here: boolean | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          job_title?: string | null
          location?: string | null
          resume_id?: string | null
          start_date: string
          still_working_here?: boolean | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          job_title?: string | null
          location?: string | null
          resume_id?: string | null
          start_date?: string
          still_working_here?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'work_experience_resume_id_fkey'
            columns: ['resume_id']
            isOneToOne: false
            referencedRelation: 'resumes'
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
      skill: {
        label: string
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database['public']['Tables'] & Database['public']['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
    Database['public']['Views'])
  ? (Database['public']['Tables'] &
    Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database['public']['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database['public']['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database['public']['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never

