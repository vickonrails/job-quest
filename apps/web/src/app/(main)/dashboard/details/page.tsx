import BackButton from '@/components/back-button';
import JobsTable from '@/components/table/job/jobs-table';
import { getJobs } from '@/queries/jobs';
import qs from 'qs';

const viewLookup = {
    recently_added: { query: 'order_by=created_at.desc&limit=20', title: 'Recently Added' },
    applying: { query: 'status=1', title: 'Applying' },
    favorites: { query: 'order_by=priority.desc&limit=20&gte=priority.4', title: 'Favorites' },
    interviewing: { query: 'status=3', title: 'Interviewing' }
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

// TODO: move to separate function
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

type SearchParams = { [key: string]: string | string[] | undefined, card: 'recently_added' | 'favorites' | 'applying' | 'interviewing' }

async function getOverviewJobs(card: SearchParams['card']) {
    const params = parseQuery(viewLookup[card].query)
    return await getJobs({ ...params })
}

export default async function DashboardOverview({ searchParams }: { searchParams: SearchParams }) {
    const jobs = await getOverviewJobs(searchParams.card)
    return (
        <section className="p-6">
            <BackButton>
                Back to Dashboard
            </BackButton>
            <h1 className="my-4 font-bold uppercase">{viewLookup[searchParams.card].title} ({[].length})</h1>
            <JobsTable jobs={jobs ?? []} hideActions />
        </section>
    )
}
