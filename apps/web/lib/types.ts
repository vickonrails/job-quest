import { type Database } from './database.types';

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsertDTO = Database['public']['Tables']['jobs']['Insert']
export type JobUpdateDTO = Database['public']['Tables']['jobs']['Update']
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsertDTO = Database['public']['Tables']['profiles']['Insert'];