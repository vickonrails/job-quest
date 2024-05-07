import { type User } from '@supabase/supabase-js';
import { type CoverLetter, type Job } from '../lib/types';

export const job = {
    company_name: 'Google',
    position: 'Senior Software Engineer',
    description: 'A couple of job descriptions',
    status: 1,
    cover_letter_id: 'cover-letter-id'
} as Job

export const coverLetter = {
    id: 'cover-letter-id',
    text: '',
    user_id: ''
} as CoverLetter;

export const user = {
    id: 'user-id'
} as User