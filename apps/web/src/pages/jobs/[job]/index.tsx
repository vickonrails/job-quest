import BackButton from '@components/back-button';
import { JobDetails } from '@components/job-details/job-details';
import { Layout } from '@components/layout';
import { useJobs } from '@hooks';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from 'shared';
import { type Job } from 'lib/types';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { type PageProps } from 'src/pages';

interface JobDetailsPageProps extends PageProps {
    job: Job
}

const JobDetailsPage = ({ session, profile, job }: JobDetailsPageProps) => {
    const { data } = useJobs({ initialData: [job] }, job.id);
    const router = useRouter()
    const selectedJob = data?.jobs[0]
    if (!selectedJob) return null;

    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6 overflow-auto"
        >
            <BackButton onClick={() => router.back()} />
            <JobDetails job={selectedJob} />
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

    return {
        props: {
            session,
            profile,
            job
        }
    }
}

export default JobDetailsPage