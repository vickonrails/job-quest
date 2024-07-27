import { getResumes } from '@/api/resume.api';
import { DashboardSidebar } from '@/components/dashboard/dashboard-siderbar';
import { JobsSummaryCards } from '@/components/dashboard/welcome-banner';
import { ResumePreviewCard } from '@/components/resume-card';
import { getSummaryCardData } from '@/db/api/jobs.api';
import { type Resume } from 'lib/types';
import { unstable_noStore as noStore } from 'next/cache';

export default async function DashboardPage() {
    noStore()
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