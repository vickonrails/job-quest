import BackButton from '@components/back-button';
import { Layout } from '@components/layout';
import JobsTable from '@components/table/job/JobsTable';
import { type Database } from '@lib/database.types';
import { type Job, type Profile } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import qs from 'qs';

type ViewType = keyof typeof viewLookup
function DashboarDetails({ profile, session, jobs }: { profile: Profile, session: Session, jobs: Job[] }) {
    const router = useRouter()
    const view = router.query.card as ViewType;

    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6 overflow-auto"
            pageTitle="Dashboard Details"
        >
            <BackButton onClick={() => router.back()}>
                Back to Dashboard
            </BackButton>
            <h1 className="my-4 font-bold uppercase">{viewLookup[view].title}</h1>
            <JobsTable jobs={jobs} hideActions />
        </Layout>
    )
}

type QueryProps = {
    orderBy: {
        field: string,
        direction: 'asc' | 'desc'
    },
    status?: number
    limit?: number
}

type ParsedResult = {
    order_by: string,
    limit: string,
    status: string
}

const defaultQuery: QueryProps = {
    orderBy: {
        direction: 'asc',
        field: 'created_at'
    },
}

function parseQuery(query: string): QueryProps {
    const parts = qs.parse(query) as ParsedResult;
    const parsedQuery: QueryProps = { ...defaultQuery };

    if (parts.order_by) {
        const [field, direction] = parts?.order_by.split('.') as [string, QueryProps['orderBy']['direction']];

        if (field == undefined || direction == undefined) {
            return defaultQuery;
        }

        parsedQuery.orderBy = {
            field,
            direction
        }
    }

    if (parts.limit) {
        parsedQuery.limit = parseInt(parts.limit);
    }

    if (parts.status) {
        parsedQuery.status = parseInt(parts.status);
    }

    return parsedQuery
}

const viewLookup = {
    recently_added: { query: 'order_by=created_at.desc&limit=10', title: 'Recently Added' },
    upcoming_interviews: { query: 'status=3&limit=10', title: 'Upcoming Interviews' },
    favorites: { query: 'order_by=priority.desc&limit=10', title: 'Favorites' },
    next_in_line: { query: 'status=1&limit=10', title: 'Next in Line' }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const query = context.query as unknown as string
    const { card } = qs.parse(query) as unknown as { card: keyof typeof viewLookup };
    const parsedQuery = parseQuery(viewLookup[card].query);
    const { limit, orderBy, status } = parsedQuery;

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    let jobsQuery = supabase.from('jobs').select();

    if (orderBy) {
        jobsQuery = jobsQuery.order(orderBy.field, { ascending: orderBy.direction === 'asc' })
    }

    if (limit) {
        jobsQuery = jobsQuery.limit(limit)
    }

    if (status) {
        jobsQuery = jobsQuery.eq('status', status);
    }

    const { data: jobs } = await jobsQuery;

    return {
        props: {
            session,
            profile,
            jobs
        }
    }
}

export default DashboarDetails