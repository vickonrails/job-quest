import { z } from 'zod'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullish()

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
    full_name: z.string().optional().nullish(),
    email_address: emailSchema,
    location: z.string().optional().nullish(),
    title: z.string().optional().nullable(),
    skills: z.array(skillSchema).optional().nullish(),
    github_url: urlSchema,
    professional_summary: z.string().optional().nullish(),
    personal_website: urlSchema,
    linkedin_url: z.string(),
});

const workExperienceSchema = z.object({
    job_title: z.string().optional().nullish(),
    location: z.string().optional().nullish(),
    company_name: z.string().optional().nullish(),
    end_date: dateSchema,
    start_date: dateSchema,
    still_working_here: z.boolean().optional().nullish(),
    highlights: z.string().optional().nullish(),
});

const educationSchema = z.object({
    start_date: dateSchema,
    end_date: dateSchema,
    degree: z.string().optional().nullable(),
    field_of_study: z.string().optional().nullable(),
    institution: z.string().optional().nullable(),
    still_studying_here: z.boolean().optional().nullable(),
    location: z.string().optional().nullable(),
    highlights: z.string().optional().nullable(),
});

const projectSchema = z.object({
    highlights: z.string().optional().nullish(),
    end_date: dateSchema,
    start_date: dateSchema,
    skills: z.array(skillSchema).optional().nullish(),
    title: z.string().optional().nullish(),
    url: urlSchema,
});

export const resumeSchema = z.object({
    profile: profileSchema,
    work_experience: z.array(workExperienceSchema),
    education: z.array(educationSchema),
    projects: z.array(projectSchema),
});

