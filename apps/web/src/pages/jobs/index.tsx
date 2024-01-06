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
import { useState, type HTMLAttributes } from 'react';

type View = 'kanban' | 'table';

const Tracker = ({ session, profile, jobs }: {
    session: Session, profile: Profile, jobs: Job[]
}) => {
    const { data } = useJobs({ initialData: jobs });
    const [isUpdating, setIsUpdating] = useState(false)
    const [view, setView] = useState<View>('kanban');
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
            {isTable ? <JobsTable jobs={data?.jobs ?? []} /> :
                <JobsKanban
                    jobs={jobs}
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
    const { data: jobs } = await supabase.from('jobs').select().eq('user_id', session?.user.id)

    return {
        props: {
            session,
            profile,
            jobs
        }
    }
}

export default Tracker