import { z } from 'zod'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable();

const skillSchema = z.object({
    label: z.string(),
});

const urlSchema = z.union([
    z.string().url(),
    z.string().max(0)
]).optional().nullable();

const emailSchema = z.union([
    z.string().email(),
    z.string().max(0)
]).optional().nullable();

const profileSchema = z.object({
    full_name: z.string(),
    email_address: emailSchema,
    // email_address: z.string().email(),
    location: z.string(),
    professional_summary: z.string(),
    title: z.string(),
    skills: z.array(skillSchema),
    github_url: urlSchema,
    personal_website: urlSchema,
    linkedin_url: z.string(),
});

const workExperienceSchema = z.object({
    job_title: z.string(),
    location: z.string(),
    company_name: z.string(),
    end_date: dateSchema,
    start_date: dateSchema,
    still_working_here: z.boolean(),
    highlights: z.string(),
});

const educationSchema = z.object({
    start_date: dateSchema,
    end_date: dateSchema,
    degree: z.string(),
    field_of_study: z.string(),
    institution: z.string(),
    still_studying_here: z.boolean(),
    location: z.string(),
    highlights: z.string(),
});

const projectSchema = z.object({
    highlights: z.string(),
    end_date: dateSchema,
    start_date: dateSchema,
    skills: z.array(skillSchema),
    title: z.string(),
    // url: z.string().url().optional(),
    url: urlSchema,
});

export const resumeSchema = z.object({
    profile: profileSchema,
    work_experience: z.array(workExperienceSchema),
    education: z.array(educationSchema),
    projects: z.array(projectSchema),
});

