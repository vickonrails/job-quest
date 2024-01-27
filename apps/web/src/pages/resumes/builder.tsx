import { Layout } from '@components/layout';
import { Preview } from '@components/resume-builder/builder/preview';
import { type Database } from '@lib/database.types';
import { type Education, type Profile, type Project, type WorkExperience } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { ResumeForm } from './form/container';

interface PageProps {
    session: Session,
    profile: Profile,
    profileEducation: Education[],
    profileWorkExperience: WorkExperience[],
    workExperience: WorkExperience[],
    profileProjects: Project[]
}

export interface FormValues {
    profile: Profile,
    profileEducation: Education[],
    workExperience: WorkExperience[],
    profileProjects: Project[]
}

export default function ResumeBuilder({ session, profile, workExperience, profileEducation, profileWorkExperience, profileProjects }: PageProps) {
    const form = useForm<FormValues>({ defaultValues: { profile, workExperience } });
    return (
        <Layout
            session={session}
            profile={profile}
            pageTitle="Resume Builder"
        >
            <div className="flex w-full h-full">
                <FormProvider {...form}>
                    <section className="w-1/2 border-r p-6 flex-shrink-0">
                        <ResumeForm
                            profile={profile}
                            profileEducation={profileEducation}
                            profileWorkExperience={profileWorkExperience}
                            profileProjects={profileProjects}
                        />
                    </section>

                    <section className="bg-gray-100 flex-1 p-6 overflow-auto">
                        <Preview />
                    </section>
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
    const { data: profileEducation } = await supabase.from('education').select().eq('user_id', session.user.id);
    const { data: profileWorkExperience } = await supabase.from('work_experience').select().eq('user_id', session.user.id);
    const { data: profileProjects } = await supabase.from('projects').select().eq('user_id', session.user.id);

    return {
        props: {
            session,
            profile,
            profileEducation,
            profileWorkExperience,
            workExperience: profileWorkExperience,
            profileProjects
        }
    }
}