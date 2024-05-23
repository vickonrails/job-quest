import BackButton from '@/components/back-button';
import { JobDetails } from '@/components/job-details/job-details';
import { getJob } from '@/db/api';
import { MainShell } from '../../layout';

export default async function JobDetailsPage({ params }: { params: { job: string } }) {
    const { data } = await getJob(params.job)
    if (!data) {
        return null
    }

    return (
        <MainShell title={`Job Description - ${data.position}`}>
            <section className="p-6 overflow-auto">
                <BackButton />
                <JobDetails job={data} />
            </section>
        </MainShell>
    )
}
