import { type User } from '@supabase/supabase-js';
import { type JobInsertDTO, type CoverLetter } from '../lib/types';

export const job: JobInsertDTO = {
    id: 'job-id',
    company_name: 'Google',
    position: 'Senior Software Engineer',
    description: 'A couple of job descriptions',
    status: 1,
    user_id: 'user-id'
}

export const coverLetter = {
    id: 'cover-letter-id',
    text: '',
    user_id: ''
} as CoverLetter;

export const user = {
    id: 'user-id'
} as User