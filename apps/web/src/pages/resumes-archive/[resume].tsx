import { Layout } from '@/components/layout';
import { Preview } from '@/components/resume-builder/builder/preview';
import { createClient } from '@lib/supabase/server-prop';
import { type Education, type Profile, type Project, type Resume, type WorkExperience } from '@lib/types';
import { type GetServerSideProps } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { Spinner } from 'ui';
import { ResumeForm } from '../../components/resume-builder/builder/sections';

interface PageProps {
    profile: Profile
    defaultValues: FormValues
}

export interface FormValues {
    resume: Resume,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}

export default function ResumeBuilder({ profile, defaultValues }: PageProps) {
    const form = useForm<FormValues>({ defaultValues });
    const { formState: { isSubmitting } } = form

    return (
        <Layout
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
                    <ResumeForm resume={defaultValues.resume} />
                    <Preview />
                </FormProvider>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser()
    const resumeId = context.query.resume as string

    if (!user) {
        await supabase.auth.signOut();
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
    const { data: education } = await supabase.from('education').select('*, highlights ( * )').eq('resume_id', resumeId).eq('user_id', user.id);
    const { data: workExperience } = await supabase.from('work_experience').select('*, highlights ( * )').eq('resume_id', resumeId).eq('user_id', user.id);
    const { data: projects } = await supabase.from('projects').select().eq('resume_id', resumeId).eq('user_id', user.id);

    let resume: Resume | null;
    resume = (await supabase.from('resumes').select().eq('id', resumeId).single()).data;
    if (!resume && profile) {
        const newResume = getResumeFromProfile(profile)
        const createQuery = supabase.from('resumes').insert({ id: resumeId, user_id: user.id, ...newResume }).select().single();
        resume = (await createQuery).data;
    }

    return {
        props: {
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

function getResumeFromProfile(profile: Profile) {
    const resume: Partial<Resume> = {
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

    return resume;
}