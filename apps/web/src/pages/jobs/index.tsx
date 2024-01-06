import JobsKanban from '@components/kanban/kanban-container';
import { Layout } from '@components/layout';
import { Spinner } from '@components/spinner';
import JobsTable from '@components/table/job/JobsTable';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { cn } from '@utils/cn';
import { transformJobs, type KanbanColumn } from '@utils/transform-to-column';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { AlignStartHorizontal, TableIcon } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, type HTMLAttributes } from 'react';

type View = 'kanban' | 'table';

// TODO: Just pass the jobs and columns to the frontend and let it do the assembling
// then I can just use the switcher to control the frontend state

const Tracker = ({ session, profile, jobs, jobColumns }: {
    session: Session, profile: Profile, jobs: Job[], jobColumns: KanbanColumn[]
}) => {
    const router = useRouter();
    const view = router.query.view as View ?? 'kanban';
    const [isUpdating, setIsUpdating] = useState(false)
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
                <ViewSwitcher view={view} />
            </section>
            {isTable ? <JobsTable jobs={jobs} /> :
                <JobsKanban
                    jobColumns={jobColumns}
                    onUpdateStart={() => setIsUpdating(true)}
                    onUpdateEnd={() => setIsUpdating(false)}
                />
            }
        </Layout>
    )
}

function ViewSwitcher({ view }: { view: View }) {
    const { push } = useRouter()
    return (
        <section className="flex justify-end mb-4">
            <article className="bg-gray-300 rounded-md p-1">
                <IconButton
                    active={view === 'table'}
                    onClick={() => push('/jobs?view=table')}
                >
                    <TableIcon size={18} />
                </IconButton>
                <IconButton
                    active={view === 'kanban'}
                    onClick={() => push('/jobs?view=kanban')}
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
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const view = context.query.view;

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    const { data: jobs } = await supabase.from('jobs').select().eq('user_id', session?.user.id)

    if (view === 'table') {
        return {
            props: {
                session,
                profile,
                jobs
            }
        }
    }

    const jobColumns = transformJobs(jobs || [])

    return {
        props: {
            session,
            profile,
            jobColumns
        }
    }
}

export default Tracker