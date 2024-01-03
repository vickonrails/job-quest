import JobsKanban from '@components/kanban/kanban-container';
import { Layout } from '@components/layout';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { transformJobs, type KanbanColumn, ApplicationStatus } from '@utils/transform-to-column';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { type GetServerSideProps } from 'next';

// I'm currently rendering on the client. How can we improve this

const Tracker = ({ session, profile, jobs, jobColumns }: {
    session: Session, profile: Profile, jobs: Job[], jobColumns: KanbanColumn[]
}) => {
    return (
        <Layout session={session} profile={profile}>
            {/* <JobsTable /> */}
            <JobsKanban jobColumns={jobColumns} />
        </Layout>
    )
}

// TODO: consider what approach to use for the dashboard either server-side or client-side rendering

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

    // console.log(jobs)
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