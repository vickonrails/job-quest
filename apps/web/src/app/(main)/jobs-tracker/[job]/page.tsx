import BackButton from '@/components/back-button';
import { JobDetails } from '@/components/job-details/job-details';
import { getJob } from '@/db/api';

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
