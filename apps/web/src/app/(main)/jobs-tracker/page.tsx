import { getJobs } from '@/api/jobs.api';
import JobsKanbanContainer from '@/components/jobs-kanban';
import { type Job } from 'lib/types';

export default async function JobTrackerPage() {
    const { data } = await getJobs()
    return (
        <section className="h-full py-6">
            <JobsKanbanContainer jobs={data as Job[]} />
        </section>
    )
}