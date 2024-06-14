import { type Database } from 'shared';

export type Resume = Database['public']['Tables']['resumes']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Education = Database['public']['Tables']['education']['Row'];
export type WorkExperience = Database['public']['Tables']['work_experience']['Row'];

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}