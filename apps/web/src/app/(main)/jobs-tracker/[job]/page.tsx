import BackButton from '@/components/back-button';
import { JobDetails } from '@/components/job-details/job-details';
import { getJob } from '@/queries/jobs';

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
    const job = await getJob(params.id)
    return (
        <section className="p-6 overflow-auto">
            <BackButton />
            <JobDetails job={job ?? undefined} />
        </section>
    )
}
