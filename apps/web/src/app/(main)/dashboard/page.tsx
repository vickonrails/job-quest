import { DashboardSidebar } from '@/components/dashboard/dashboard-siderbar';
import { JobsSummaryCards } from '@/components/dashboard/welcome-banner';
import { ResumePreviewCard } from '@/components/resume-card';
import { createClient } from '@/utils/supabase/server';
import { type Resume } from 'lib/types';

async function getDashboardSummary() {
    const sb = createClient();
    return await sb.from('jobs_dashboard_v').select();
}

async function getResumes() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return null;
    const { data } = await sb.from('resumes').select().eq('user_id', user?.id).order('updated_at', { ascending: false }).limit(5)
    return data
}

export default async function DashboardPage() {
    const { data } = await getDashboardSummary()
    const resumes = await getResumes()



    return (
        <section className="flex w-full flex-1 gap-4">
            <section className="flex-1">
                <JobsSummaryCards className="mb-4" dashboardSummary={data ?? []} />
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
            <h2 className="w-full text-md font-medium my-4 mt-6">Recent Resumes</h2>
            <section className="flex flex-wrap gap-4">
                {resumes.map(resume => (
                    <ResumePreviewCard key={resume.id} resume={resume} />
                ))}
            </section>
        </>
    )
}