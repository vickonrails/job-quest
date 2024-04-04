import { type Database } from 'shared'

export type Job = Database['public']['Tables']['jobs']['Row'] & { img?: string }
export type JobInsertDTO = Database['public']['Tables']['jobs']['Insert'] & { img?: string, notes?: string }

export interface BackgroundResponse<T> {
    success: boolean
    data: T
}