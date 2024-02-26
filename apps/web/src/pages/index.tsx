import { DashboardSidebar } from '@components/dashboard/dashboard-siderbar';
import { JobsSummaryCards } from '@components/dashboard/welcome-banner';
import { Layout } from '@components/layout';
import { Table, type Column, type TableActions } from '@components/table';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type Session } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

// I have to solve the problem of expired tokens and already used tokens
// right now it just redirects to the app page but doesn't load the session

export interface PageProps {
    session: Session,
    profile: Profile
}

// TODO: put profile in the react query cache so I can use it any and everywhere
const Index = ({ session, profile, jobs }: PageProps & { jobs: Job[] }) => {
    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6 overflow-auto"
        >
            <section className="flex w-full flex-1 gap-4">
                <section className="flex-1">
                    <JobsSummaryCards className="mb-4" profile={profile} />
                    <RecentlyAdded jobs={jobs} />
                </section>
                <DashboardSidebar className="basis-1/4" />
            </section>
        </Layout>
    )
}

// TODO: move into another file
export const columns: Column<Job> = [
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

function RecentlyAdded({ jobs }: { jobs: Job[] }) {
    const router = useRouter();

    const onRowClick = (id: string) => {
        router.push(`/jobs/${id}`).then(() => {
            // 
        }).catch(() => {
            // 
        })
    }

    const actions: TableActions = {
        onRowClick
    }

    return (
        <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-md font-medium">Recent Applications</h1>
                <Link href="/jobs" className="text-sm text-blue-500 mr-3 hover:underline hover:text-blue-400">View All</Link>
            </div>
            <Table<Job>
                columns={columns}
                data={jobs ?? []}
                actions={actions}
                hideActions
            />
        </div>
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
    const { data: jobs } = await supabase.from('jobs').select().order('created_at', { ascending: false }).limit(5)

    return {
        props: {
            session,
            profile,
            jobs
        }
    }
}

export default Index