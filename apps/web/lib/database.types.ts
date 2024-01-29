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
            education: {
                Row: {
                    created_at: string | null
                    degree: string | null
                    end_date: string | null
                    field_of_study: string | null
                    highlights: string | null
                    id: string
                    institution: string | null
                    location: string | null
                    resume_id: string | null
                    start_date: string
                    still_studying_here: boolean | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    degree?: string | null
                    end_date?: string | null
                    field_of_study?: string | null
                    highlights?: string | null
                    id?: string
                    institution?: string | null
                    location?: string | null
                    resume_id?: string | null
                    start_date: string
                    still_studying_here?: boolean | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    degree?: string | null
                    end_date?: string | null
                    field_of_study?: string | null
                    highlights?: string | null
                    id?: string
                    institution?: string | null
                    location?: string | null
                    resume_id?: string | null
                    start_date?: string
                    still_studying_here?: boolean | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'education_resume_id_fkey'
                        columns: ['resume_id']
                        isOneToOne: false
                        referencedRelation: 'resumes'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'education_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
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
                    order_column: number | null
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
                    order_column?: number | null
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
                    order_column?: number | null
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
                        isOneToOne: false
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
                        isOneToOne: false
                        referencedRelation: 'jobs'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'notes_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
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
                    github_url: string | null
                    id: string
                    linkedin_url: string | null
                    location: string | null
                    personal_website: string | null
                    professional_summary: string | null
                    skills: Database['public']['CompositeTypes']['skills'][] | null
                    title: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email_address?: string | null
                    full_name?: string | null
                    github_url?: string | null
                    id: string
                    linkedin_url?: string | null
                    location?: string | null
                    personal_website?: string | null
                    professional_summary?: string | null
                    skills?: Database['public']['CompositeTypes']['skills'][] | null
                    title?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email_address?: string | null
                    full_name?: string | null
                    github_url?: string | null
                    id?: string
                    linkedin_url?: string | null
                    location?: string | null
                    personal_website?: string | null
                    professional_summary?: string | null
                    skills?: Database['public']['CompositeTypes']['skills'][] | null
                    title?: string | null
                    updated_at?: string | null
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
                    highlights: string | null
                    id: string
                    resume_id: string | null
                    skills: Database['public']['CompositeTypes']['skills'][] | null
                    start_date: string | null
                    title: string | null
                    updated_at: string | null
                    url: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    highlights?: string | null
                    id?: string
                    resume_id?: string | null
                    skills?: Database['public']['CompositeTypes']['skills'][] | null
                    start_date?: string | null
                    title?: string | null
                    updated_at?: string | null
                    url?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    highlights?: string | null
                    id?: string
                    resume_id?: string | null
                    skills?: Database['public']['CompositeTypes']['skills'][] | null
                    start_date?: string | null
                    title?: string | null
                    updated_at?: string | null
                    url?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'projects_resume_id_fkey'
                        columns: ['resume_id']
                        isOneToOne: false
                        referencedRelation: 'resumes'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'projects_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
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
                    skills: Database['public']['CompositeTypes']['skills'][] | null
                    title: string | null
                    updated_at: string | null
                    user_id: string
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
                    skills?: Database['public']['CompositeTypes']['skills'][] | null
                    title?: string | null
                    updated_at?: string | null
                    user_id: string
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
                    skills?: Database['public']['CompositeTypes']['skills'][] | null
                    title?: string | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'resumes_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
            work_experience: {
                Row: {
                    company_name: string | null
                    created_at: string | null
                    end_date: string | null
                    highlights: string | null
                    id: string
                    job_title: string | null
                    location: string | null
                    resume_id: string | null
                    start_date: string
                    still_working_here: boolean | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    company_name?: string | null
                    created_at?: string | null
                    end_date?: string | null
                    highlights?: string | null
                    id?: string
                    job_title?: string | null
                    location?: string | null
                    resume_id?: string | null
                    start_date: string
                    still_working_here?: boolean | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    company_name?: string | null
                    created_at?: string | null
                    end_date?: string | null
                    highlights?: string | null
                    id?: string
                    job_title?: string | null
                    location?: string | null
                    resume_id?: string | null
                    start_date?: string
                    still_working_here?: boolean | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'work_experience_resume_id_fkey'
                        columns: ['resume_id']
                        isOneToOne: false
                        referencedRelation: 'resumes'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'work_experience_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
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
            skills: {
                label: string
            }
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
