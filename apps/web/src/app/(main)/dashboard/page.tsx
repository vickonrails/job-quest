import { DashboardSidebar } from '@/components/dashboard/dashboard-siderbar';
import { JobsSummaryCards } from '@/components/dashboard/welcome-banner';
import { ResumePreviewCard } from '@/components/resume-card';
import { createClient } from '@/utils/supabase/server';
import { type Resume } from 'lib/types';

async function getResumes() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return null;
    const { data } = await sb.from('resumes').select().eq('user_id', user?.id).order('updated_at', { ascending: false }).limit(5)
    return data
}

export async function getSummaryCardData() {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) throw new Error('unauthorized');

    const { data, error } = await client.rpc('get_job_stage_counts', { userid: user.id }).single()
    if (error) throw error
    return data
}

export default async function DashboardPage() {
    const resumes = await getResumes()
    const data = await getSummaryCardData()

    return (
        <section className="flex w-full overflow-auto h-full flex-1 gap-4 p-6">
            <section className="flex-1">
                <JobsSummaryCards className="mb-4" dashboardSummary={data} />
                <hr />
                <RecentResume resumes={resumes ?? []} />
            </section>
            <DashboardSidebar className="basis-1/4" />
        </section>
    )
}

function RecentResume({ resumes }: { resumes: Resume[] }) {
    return (
        <>
            <h2 className="w-full text-md text-muted-foreground font-medium my-4 mt-6">Recent Resumes</h2>
            <section className="flex flex-wrap gap-4">
                {resumes.map(resume => (
                    <ResumePreviewCard key={resume.id} resume={resume} />
                ))}
            </section>
        </>
    )
}