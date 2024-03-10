import { Layout } from '@components/layout';
import { Preview } from '@components/resume-builder/builder/preview';
import { type Database } from '@lib/database.types';
import { type Education, type Profile, type Project, type Resume, type WorkExperience } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { ResumeForm } from '../../components/resume-builder/builder/sections';
import { Spinner } from 'ui';

interface PageProps {
    session: Session
    profile: Profile
    defaultValues: FormValues
}

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}

export default function ResumeBuilder({ session, profile, defaultValues }: PageProps) {
    const form = useForm<FormValues>({ defaultValues });
    const { formState: { isSubmitting } } = form
    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="overflow-hidden"
            pageTitle={
                <div className="flex items-center gap-2">
                    <h1 className="text-base font-medium">Resume Builder</h1>
                    {isSubmitting && <Spinner className="h-4 w-4" />}
                </div>
            }
        >
            <div className="flex w-full h-full">
                <FormProvider {...form}>
                    <ResumeForm session={session} defaultValues={defaultValues} />
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
            defaultValues: {
                workExperience,
                projects,
                education,
                resume
            }
        }
    }
}