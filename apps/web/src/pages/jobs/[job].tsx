import { JobDetails } from '@components/job-details/job-details';
import { Layout } from '@components/layout';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type Database } from 'lib/database.types';
import { type Job, type Note, type Profile } from 'lib/types';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'react-feather';

const JobDetailsPage = ({ session, profile, job, notes }: { session: Session, profile: Profile, job: Job, notes: Note[] }) => {
    const { data } = useJobs({ initialData: [job] }, job.id);
    const router = useRouter()
    const jobsData = data?.jobs[0]
    if (!jobsData) return null;

    return (
        <Layout session={session} profile={profile} containerClasses="p-6 overflow-auto">
            <div>
                <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                    Back
                </button>
                <JobDetails job={jobsData} notes={notes} />
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const jobId = context.query.job as string

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    const { data: job } = await supabase.from('jobs').select().eq('id', jobId).single()
    const { data: notes } = await supabase.from('notes').select().eq('job_id', jobId).order('created_at', { ascending: false });

    return {
        props: {
            session,
            profile,
            job,
            notes
        }
    }
}

export default JobDetailsPage