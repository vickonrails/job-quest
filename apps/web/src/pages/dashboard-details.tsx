import BackButton from '@components/back-button';
import { Layout } from '@components/layout';
import JobsTable from '@components/table/job/JobsTable';
import { createClient } from '@lib/supabase/server-prop';
import { type Job, type Profile } from '@lib/types';
import { type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import qs from 'qs';

type ViewType = keyof typeof viewLookup
function DashboarDetails({ profile, jobs }: { profile: Profile, jobs: Job[] }) {
    const router = useRouter()
    const view = router.query.card as ViewType;

    return (
        <Layout
            profile={profile}
            containerClasses="p-6 overflow-auto"
            pageTitle="Dashboard Details"
        >
            <BackButton onClick={() => router.back()}>
                Back to Dashboard
            </BackButton>
            <h1 className="my-4 font-bold uppercase">{viewLookup[view].title} ({jobs.length})</h1>
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
    gte?: {
        field: string,
        value: number
    }
}

type ParsedResult = {
    order_by: string,
    limit: string,
    status: string
    gte: string
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
    if (parts.gte) {
        const [field, gte] = parts.gte.split('.') as [string, string];
        parsedQuery.gte = {
            field,
            value: parseInt(gte)
        }
    }

    return parsedQuery
}

const viewLookup = {
    recently_added: { query: 'order_by=created_at.desc&limit=20', title: 'Recently Added' },
    applying: { query: 'status=1', title: 'Applying' },
    favorites: { query: 'order_by=priority.desc&limit=20&gte=priority.4', title: 'Favorites' },
    interviewing: { query: 'status=3', title: 'Interviewing' }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser();
    const query = context.query as unknown as string
    const { card } = qs.parse(query) as unknown as { card: keyof typeof viewLookup };
    const parsedQuery = parseQuery(viewLookup[card].query);
    const { limit, orderBy, status, gte } = parsedQuery;

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
    let jobsQuery = supabase.from('jobs').select().eq('user_id', user.id);

    if (orderBy) {
        jobsQuery = jobsQuery.order(orderBy.field, { ascending: orderBy.direction === 'asc' })
    }

    if (limit) {
        jobsQuery = jobsQuery.limit(limit)
    }

    if (status) {
        jobsQuery = jobsQuery.eq('status', status);
    }

    if (gte) {
        jobsQuery = jobsQuery.gte(gte.field, gte.value);
    }

    const { data: jobs } = await jobsQuery;

    return {
        props: {
            profile,
            jobs
        }
    }
}

export default DashboarDetails