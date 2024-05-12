import { type Database } from 'shared';

type Highlight = Database['public']['Tables']['highlights']['Row'];
type Resume = Database['public']['Tables']['resumes']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Education = Database['public']['Tables']['education']['Row'] & { highlights?: Highlight[] };
type WorkExperience = Database['public']['Tables']['work_experience']['Row'] & { highlights?: Highlight[] };

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}