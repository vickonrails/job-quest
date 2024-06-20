import { getJob } from '@/api/jobs.api';
import BackButton from '@/components/back-button';
import { JobDetails } from '@/components/job-details/job-details';

export default async function JobDetailsPage({ params }: { params: { job: string } }) {
    const { data } = await getJob(params.job)
    if (!data) {
        return null
    }

    return (
        <section className="p-6 overflow-auto">
            <BackButton />
            <JobDetails job={data} />
        </section>
    )
}
