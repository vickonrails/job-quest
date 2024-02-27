import { DashboardSidebar } from '@components/dashboard/dashboard-siderbar';
import { JobsSummaryCards } from '@components/dashboard/welcome-banner';
import { Layout } from '@components/layout';
import { ResumePreviewCard } from '@components/resume-card';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type Session } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Profile, type Resume } from 'lib/types';
import { type GetServerSideProps } from 'next';

export interface PageProps {
    session: Session,
    profile: Profile
}

const Index = ({ session, profile, resumes }: PageProps & { resumes: Resume[] }) => {
    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6 overflow-auto"
            pageTitle="Dashboard"
        >
            <section className="flex w-full flex-1 gap-4">
                <section className="flex-1">
                    <JobsSummaryCards className="mb-4" profile={profile} />
                    <hr />
                    <RecentResume resumes={resumes} />
                </section>
                <DashboardSidebar className="basis-1/4" />
            </section>
        </Layout>
    )
}

/** Recent resume section */
function RecentResume({ resumes }: { resumes: Resume[] }) {
    return (
        <>
            <h2 className="w-full text-md font-medium my-4 mt-6">Recent Resumes</h2>
            <section className="flex flex-wrap gap-4">
                {resumes.map(resume => (
                    <ResumePreviewCard key={resume.id} resume={resume} />
                ))}
            </section>
        </>
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

    const { data: profile } = await supabase.from('profiles').select().eq('id', session.user.id).single()
    const { data: resumes } = await supabase.from('resumes').select().order('updated_at', { ascending: false }).limit(5)

    return {
        props: {
            session,
            profile,
            resumes
        }
    }
}

export default Index