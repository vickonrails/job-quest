import { Layout } from '@components/layout';
import { Preview } from '@components/resume-builder/builder/preview';
import { type Database } from '@lib/database.types';
import { type Education, type Profile, type Project, type Resume, type WorkExperience } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { ResumeForm } from '../../components/resume-builder/builder/sections';

interface PageProps {
    session: Session
    profile: Profile
    resume: Resume,
    workExperience: WorkExperience[]
    projects: Project[]
    education: Education[]
}

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}

export default function ResumeBuilder({ session, profile, resume, education, projects, workExperience }: PageProps) {
    const form = useForm<FormValues>({ defaultValues: { resume, workExperience, projects, education } });
    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="overflow-hidden"
            pageTitle="Resume Builder"
        >
            <div className="flex w-full h-full">
                <FormProvider {...form}>
                    <ResumeForm session={session} />
                    <Preview />
                </FormProvider>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession()
    const resumeId = context.query.resume as string

    if (!session) {
        await supabase.auth.signOut();
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session.user.id).single()
    const { data: education } = await supabase.from('education').select('*, highlights ( * )').eq('resume_id', resumeId);
    const { data: workExperience } = await supabase.from('work_experience').select('*, highlights ( * )').eq('resume_id', resumeId);
    const { data: projects } = await supabase.from('projects').select().eq('resume_id', resumeId);
    const { data: currentResume } = await supabase.from('resumes').select().eq('id', resumeId).single();

    // TODO: more cleaner way to do this
    const resume: Partial<Resume> = currentResume ?? {
        title: profile?.title ?? '',
        skills: profile?.skills ?? [],
        full_name: profile?.full_name ?? '',
        professional_summary: profile?.professional_summary ?? '',
        linkedin_url: profile?.linkedin_url ?? '',
        email_address: profile?.email_address ?? '',
        personal_website: profile?.personal_website ?? '',
        github_url: profile?.github_url ?? '',
        location: profile?.location ?? '',
    }

    return {
        props: {
            session,
            profile,
            workExperience,
            projects,
            education,
            resume
        }
    }
}