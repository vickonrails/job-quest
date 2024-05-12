import JobsKanbanContainer from '@/components/jobs-kanban';
import { getJobs } from '@/db/queries/jobs';
import { createClient } from '@/utils/supabase/server';
import { Hydrate, QueryClient, dehydrate } from '@tanstack/react-query';

// TODO: an optimization I can do here is to disable fetching the job description on the kanban
export default async function JobTrackerPage() {
    const queryClient = new QueryClient()
    const client = createClient()
    await queryClient.prefetchQuery({ queryKey: ['jobs', ''], queryFn: () => getJobs(client) })

    return (
        <section className="h-full py-6">
            <Hydrate state={dehydrate(queryClient)}>
                <JobsKanbanContainer />
            </Hydrate>
        </section>
    )
}