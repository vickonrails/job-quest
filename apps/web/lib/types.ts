import { type Database } from './database.types';

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsertDTO = Database['public']['Tables']['jobs']['Insert']
export type Profile = Database['public']['Tables']['profiles']['Row'];