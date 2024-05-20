import { type Database } from 'shared';

export type Highlight = Database['public']['Tables']['highlights']['Row'];
export type Resume = Database['public']['Tables']['resumes']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Education = Database['public']['Tables']['education']['Row'] & { highlights?: Highlight[] };
export type WorkExperience = Database['public']['Tables']['work_experience']['Row'] & { highlights?: Highlight[] };

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}