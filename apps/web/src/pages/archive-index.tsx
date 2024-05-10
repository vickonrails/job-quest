// import { DashboardSidebar } from '@/components/dashboard/dashboard-siderbar';
// import { JobsSummaryCards } from '@/components/dashboard/welcome-banner';
import { Layout } from '@/components/layout';
// import { ResumePreviewCard } from '@/components/resume-card';
import { type User, type Session } from '@supabase/auth-helpers-react';
import { type DashboardSummary, type Profile, type Resume } from 'lib/types';
import { type GetServerSideProps } from 'next';
import { createClient } from '@/utils/supabase/server'

export interface PageProps {
    user: User,
    profile: Profile
}

const Index = ({ profile, resumes, dashboardSummary }: PageProps & { resumes: Resume[], dashboardSummary: DashboardSummary[] }) => {
    return (
        <Layout
            profile={profile}
            containerClasses="p-6 overflow-auto"
            pageTitle="Dashboard"
        >
            {/* <section className="flex w-full flex-1 gap-4">
                <section className="flex-1">
                    <JobsSummaryCards className="mb-4" profile={profile} dashboardSummary={dashboardSummary} />
                    <hr />
                    <RecentResume resumes={resumes} />
                </section>
                <DashboardSidebar className="basis-1/4" />
            </section> */}
        </Layout>
    )
}

/** Recent resume section */
function RecentResume({ resumes }: { resumes: Resume[] }) {
    return (
        <>
            <h2 className="w-full text-md font-medium my-4 mt-6">Recent Resumes</h2>
            {/* <section className="flex flex-wrap gap-4">
                {resumes.map(resume => (
                    <ResumePreviewCard key={resume.id} resume={resume} />
                ))}
            </section> */}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

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
    const { data: resumes } = await supabase.from('resumes').select().eq('user_id', user.id).order('updated_at', { ascending: false }).limit(5)
    const { data: dashboardSummary } = await supabase.from('jobs_dashboard_v').select();

    return {
        props: {
            profile,
            resumes,
            dashboardSummary
        }
    }
}

export default Index