import { Layout } from '@components/layout';
import { Preview } from '@components/resume-builder/builder/preview';
import { type Database } from '@lib/database.types';
import { type Education, type Profile, type Project, type WorkExperience } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { ResumeForm } from './form/container';

interface PageProps {
    session: Session
    profile: Profile
    workExperience: WorkExperience[]
    projects: Project[]
    education: Education[]
}

export interface FormValues {
    profile: Profile,
    projects: Project[],
    education: Education[]
    workExperience: WorkExperience[]
}

export default function ResumeBuilder({ session, profile, education, projects, workExperience }: PageProps) {
    const form = useForm<FormValues>({ defaultValues: { profile, workExperience, projects, education } });

    return (
        <Layout
            session={session}
            profile={profile}
            pageTitle="Resume Builder"
        >
            <div className="flex w-full h-full">
                <FormProvider {...form}>
                    <ResumeForm />
                    <Preview />
                </FormProvider>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        await supabase.auth.signOut();
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    // all the work experiences without resume_id
    // all the projects without resume_id
    // all the education without resume_id

    const { data: profile } = await supabase.from('profiles').select().eq('id', session.user.id).single()
    const { data: education } = await supabase.from('education').select().eq('user_id', session.user.id);
    const { data: workExperience } = await supabase.from('work_experience').select().eq('user_id', session.user.id);
    const { data: projects } = await supabase.from('projects').select().eq('user_id', session.user.id);

    return {
        props: {
            session,
            profile,
            workExperience,
            projects,
            education
        }
    }
}