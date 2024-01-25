import { type Database } from './database.types';

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsertDTO = Database['public']['Tables']['jobs']['Insert']
export type JobUpdateDTO = Database['public']['Tables']['jobs']['Update']
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsertDTO = Database['public']['Tables']['profiles']['Insert'];
export type NoteInsertDTO = Database['public']['Tables']['notes']['Insert'];
export type NoteUpdateDTO = Database['public']['Tables']['notes']['Update'];
export type Note = Database['public']['Tables']['notes']['Row'];

export type WorkExperience = Database['public']['Tables']['work_experience']['Row'];
export type WorkExperienceInsertDTO = Database['public']['Tables']['work_experience']['Insert'];

export type Education = Database['public']['Tables']['education']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];