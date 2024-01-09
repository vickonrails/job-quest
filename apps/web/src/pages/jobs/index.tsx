import JobsKanban from '@components/kanban/kanban-container';
import { Layout } from '@components/layout';
import { Spinner } from '@components/spinner';
import JobsTable from '@components/table/job/JobsTable';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { cn } from '@utils/cn';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { AlignStartHorizontal, TableIcon } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { useEffect, useState, type HTMLAttributes } from 'react';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_SORTING, parseSorting } from 'src/hooks/useJobs';

type View = 'kanban' | 'table';

const Tracker = ({ session, profile, jobs }: {
    session: Session, profile: Profile, jobs: Job[]
}) => {
    const [initialData, setInitialData] = useState(jobs);
    const { data, queryParams, setQueryParams, isRefetching } = useJobs({
        initialData
    });

    // to avoid initial data passed from SSR to always be the fallback data
    useEffect(() => {
        setInitialData(data.jobs)
    }, [data.jobs])

    const [isUpdating, setIsUpdating] = useState(false)
    const [view, setView] = useState<View>('table');
    const isTable = view === 'table';

    return (
        <Layout session={session} profile={profile}>
            <section className="flex justify-between items-center">
                <h1 className="text-2xl flex font-bold gap-2 items-center">
                    <span>
                        Jobs
                    </span>
                    {isUpdating && <Spinner />}
                </h1>
                <ViewSwitcher view={view} setView={setView} />
            </section>
            {isTable ? (
                <JobsTable
                    jobs={data?.jobs ?? []}
                    setFilterParams={setQueryParams}
                    queryParams={queryParams}
                    count={data.count ?? undefined}
                    isRefetching={isRefetching}
                />
            ) :
                <JobsKanban
                    jobs={data?.jobs ?? []}
                    onUpdateStart={() => setIsUpdating(true)}
                    onUpdateEnd={() => setIsUpdating(false)}
                />
            }
        </Layout>
    )
}

function ViewSwitcher({ view, setView }: { view: View, setView: (view: View) => void }) {
    return (
        <section className="flex justify-end mb-4">
            <article className="bg-gray-300 rounded-md p-1">
                <IconButton
                    active={view === 'table'}
                    onClick={() => setView('table')}
                >
                    <TableIcon size={18} />
                </IconButton>
                <IconButton
                    active={view === 'kanban'}
                    onClick={() => setView('kanban')}
                >
                    <AlignStartHorizontal size={18} />
                </IconButton>
            </article>
        </section>
    )
}

function IconButton({ active, className, ...props }: HTMLAttributes<HTMLButtonElement> & { active: boolean }) {
    return (
        <button className={cn('p-2 rounded-md text-gray-600', active && 'bg-white', className)} {...props}></button>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const paginationQuery = context.query;
    const limit = Number(paginationQuery['limit'] ?? DEFAULT_LIMIT);
    const offset = Number(paginationQuery['offset'] ?? DEFAULT_OFFSET);
    const orderBy = parseSorting(paginationQuery['orderBy'] as string) ?? DEFAULT_SORTING
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    let query = supabase.from('jobs').select().eq('user_id', session?.user.id)

    if (limit) {
        query = query.range(offset, (limit - 1) + (offset))
    }

    if (orderBy) {
        query = query.order(orderBy.field, { ascending: orderBy.direction === 'asc' })
    }

    const { data: jobs } = await query;

    return {
        props: {
            session,
            profile,
            jobs
        }
    }
}

export default Tracker