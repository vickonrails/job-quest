import { useCallback } from 'react';
import { Layout } from '@components/layout';
import { type Session, useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { useRouter } from 'next/router';
import { SummaryCard } from '@components/dashboard';
import { WelcomeBanner } from '@components/dashboard/welcome-banner';
import { DashboardSidebar } from '@components/dashboard/dashboard-siderbar';
import { Table, type Column, type TableActions } from '@components/table';
import { type Profile, type Job } from 'lib/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useJobs } from '@hooks';
import { Spinner } from '@components/spinner';
import Link from 'next/link';


// I have to solve the problem of expired tokens and already used tokens
// right now it just redirects to the app page but doesn't load the session

const Index = ({ session, profile }: { session: Session, profile: Profile }) => {
    return (
        <Layout
            className="flex"
            containerClasses="flex flex-col gap-4"
            session={session}
            profile={profile}
        >
            <section className="flex w-full flex-1 gap-4">
                <section className="flex-1">
                    <WelcomeBanner className="mb-4" profile={profile} />
                    <div className="flex w-full gap-4 mb-4">
                        <SummaryCard title="10" description="Bookmarked applications" />
                        <SummaryCard title="20" description="High priority applications" />
                    </div>
                    <RecentlyAdded />
                </section>
                <DashboardSidebar className="basis-1/3" />
            </section>
        </Layout >
    )
}

// TODO: move into another file
export const columns: Column<Job> = [
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

function RecentlyAdded() {
    // TODO: I should be able to pass in params to the useJobs hook
    const { data, isLoading, isRefetching } = useJobs({ params: { limit: 5, orderBy: { field: 'created_at', direction: 'desc' } } }, 'recently-added');
    const router = useRouter();

    const onRowClick = (id: string) => {
        router.push(`/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const actions: TableActions = {
        onRowClick
    }

    if (isLoading) return <Spinner />

    return (
        <div className="bg-white rounded-lg">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-lg font-medium">Recent Applications</h1>
                <Link href="/jobs" className="text-sm">View All</Link>
            </div>
            <Table<Job>
                disabled={isRefetching}
                columns={columns}
                data={data?.jobs ?? []}
                actions={actions}
                hideActions
            />
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    return {
        props: {
            session,
            profile
        }
    }
}

export default Index
