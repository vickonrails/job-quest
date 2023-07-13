import { type Database } from './database.types';

export type Job = Database['public']['Tables']['jobs']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];