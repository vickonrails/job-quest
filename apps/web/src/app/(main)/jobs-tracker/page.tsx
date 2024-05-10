import JobsKanbanContainer from '@/components/jobs-kanban';
import { getJobs } from '@/queries/jobs';
import { Button } from 'ui/button';

export default async function JobTrackerPage() {
    const jobs = await getJobs()
    return (
        <section className="h-full py-6">
            <section className="flex justify-between items-center mb-3 px-4">
                {/* <h1 className="text-xl flex font-bold gap-2 items-center">
                    {isUpdating && <Spinner />}
                </h1> */}
                <Button>Add New</Button>
            </section>
            <JobsKanbanContainer jobs={jobs ?? []} />
        </section>
    )
}
