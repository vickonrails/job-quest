import { type Database } from 'shared';

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsertDTO = Database['public']['Tables']['jobs']['Insert']
export type JobUpdateDTO = Database['public']['Tables']['jobs']['Update']
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsertDTO = Database['public']['Tables']['profiles']['Insert'];
export type NoteInsertDTO = Database['public']['Tables']['notes']['Insert'];
export type NoteUpdateDTO = Database['public']['Tables']['notes']['Update'];
export type Note = Database['public']['Tables']['notes']['Row'];

export type Highlight = Database['public']['Tables']['highlights']['Row'];
export type WorkExperience = Database['public']['Tables']['work_experience']['Row'] & { highlights?: Highlight[] };
export type WorkExperienceInsertDTO = Database['public']['Tables']['work_experience']['Insert'];

export type Education = Database['public']['Tables']['education']['Row'] & { highlights?: Highlight[] };
export type EducationInsertDTO = Database['public']['Tables']['education']['Insert'] & { highlights?: Highlight[] };
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsertDTO = Database['public']['Tables']['projects']['Insert'];
export type Resume = Database['public']['Tables']['resumes']['Row'];
export type ResumeInsert = Database['public']['Tables']['resumes']['Insert'];
export type CoverLetter = Database['public']['Tables']['cover_letters']['Row'];
export type DashboardSummary = Database['public']['Views']['jobs_dashboard_v']['Row']