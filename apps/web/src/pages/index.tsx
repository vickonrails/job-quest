import { useCallback } from 'react';
import { Layout } from '@components/layout';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { useRouter } from 'next/router';
import { SummaryCard } from '@components/dashboard';
import { WelcomeBanner } from '@components/dashboard/welcome-banner';
import { DashboardSidebar } from '@components/dashboard/dashboard-siderbar';
import { Table, type Column, type TableActions } from '@components/table';
import { type Job } from 'lib/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useJobs } from '@hooks';
import { FullPageSpinner } from '@components/spinner';


// I have to solve the problem of expired tokens and already used tokens
// right now it just redirects to the app page but doesn't load the session

const Index = () => {
    const router = useRouter();
    const client = useSupabaseClient<Database>();

    const handleLogout = useCallback(() => {
        client.auth.signOut().then(async _ => {
            // await queryClient.invalidateQueries({
            //     queryKey: ['auth']
            // })
            return router.push('/sign-in');
        }).catch(err => {
            // console.log(err)
        });
    }, [client.auth, router])

    return (
        <Layout className="flex" containerClasses="flex flex-col gap-4">
            {/* <div>
                <Button size="sm" onClick={handleLogout} className="mr-3">Log out</Button>
            </div> */}
            <section className="flex w-full flex-1 gap-4 mt-8">
                <section className="flex-1">
                    <WelcomeBanner className="mb-4" />
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
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

function RecentlyAdded() {
    // TODO: I should be able to pass in params to the useJobs hook
    const { data: jobs, isLoading } = useJobs();
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
    if (isLoading) return <FullPageSpinner />

    return (
        <Table<Job>
            columns={columns}
            data={jobs ?? []}
            actions={actions}
        />
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

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
            session
        }
    }
}

export default Index
