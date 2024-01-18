import JobsKanban from '@components/kanban/kanban-container';
import { Layout } from '@components/layout';
import { Spinner } from '@components/spinner';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { type GetServerSideProps } from 'next';
import { useState } from 'react';

const Tracker = ({ session, profile, jobs }: {
    session: Session, profile: Profile, jobs: Job[]
}) => {
    const { data } = useJobs({ initialData: jobs });
    const [isUpdating, setIsUpdating] = useState(false)

    return (
        <Layout session={session} profile={profile} pageTitle="Jobs" containerClasses="p-6">
            <section className="flex justify-between items-center mb-3">
                <h1 className="text-xl flex font-bold gap-2 items-center">
                    {isUpdating && <Spinner />}
                </h1>
            </section>

            <JobsKanban
                jobs={data?.jobs ?? []}
                onUpdateStart={() => setIsUpdating(true)}
                onUpdateEnd={() => setIsUpdating(false)}
            />
        </Layout>
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