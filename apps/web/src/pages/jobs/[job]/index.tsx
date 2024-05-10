import BackButton from '@components/back-button';
import { JobDetails } from '@components/job-details/job-details';
import { Layout } from '@components/layout';
import { useJobs } from '@hooks';
import { createClient } from '@lib/supabase/server-prop';
import { type Job } from 'lib/types';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { type PageProps } from '@/pages/archive-index';

interface JobDetailsPageProps extends PageProps {
    job: Job
}

const JobDetailsPage = ({ user, profile, job }: JobDetailsPageProps) => {
    const { data } = useJobs(user.id, { initialData: [job] }, job.id);
    const router = useRouter()
    const selectedJob = data?.jobs[0]
    if (!selectedJob) return null;

    return (
        <Layout
            profile={profile}
            containerClasses="p-6 overflow-auto"
        >
            <BackButton onClick={() => router.back()} />
            <JobDetails job={selectedJob} />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser();
    const jobId = context.query.job as string

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
    const { data: job } = await supabase.from('jobs').select().eq('id', jobId).single()

    return {
        props: {
            user,
            profile,
            job
        }
    }
}

export default JobDetailsPage