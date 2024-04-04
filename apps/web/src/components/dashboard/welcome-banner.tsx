import clsx from 'clsx';
import { type DashboardSummary, type Profile } from 'lib/types';
import { Building, FolderHeart, ListStart, Timer } from 'lucide-react';
import { useMemo, type HTMLAttributes } from 'react';
import { SummaryCard, SummaryCardType } from './summary-card';

interface WelcomeBannerProps extends HTMLAttributes<HTMLElement> {
    profile: Profile
    dashboardSummary: DashboardSummary[]
}

export function JobsSummaryCards({ className, profile, dashboardSummary, ...rest }: WelcomeBannerProps) {
    const summaryCount = useMemo(() => getSummaryCount(dashboardSummary), [dashboardSummary])

    return (
        <section
            className={clsx('', className)}
            {...rest}
        >
            <Greeting profile={profile} />
            <main className="flex gap-4 h-60 items-stretch">
                <SummaryCard
                    title="Recently Added"
                    href="/dashboard-details?card=recently_added"
                    type={SummaryCardType.RECENTLY_ADDED}
                    icon={Timer}
                    count={summaryCount['recently_added']}
                />
                <SummaryCard
                    href="/dashboard-details?card=favorites"
                    title="Favorites"
                    type={SummaryCardType.FAVORITES}
                    icon={FolderHeart}
                    count={summaryCount['favorites']}
                />
                <SummaryCard
                    title="Applying"
                    href="/dashboard-details?card=applying"
                    type={SummaryCardType.APPLYING}
                    icon={Building}
                    count={summaryCount['applying']}
                />
                <SummaryCard
                    href="/dashboard-details?card=interviewing"
                    title="Interviewing"
                    type={SummaryCardType.INTERVIEWING}
                    icon={ListStart}
                    count={summaryCount['interviewing']}
                />
            </main>
        </section>
    )
}

function Greeting({ profile }: { profile: Profile }) {
    if (profile.full_name) {
        return (
            <h2 className="w-full text-3xl font-bold my-6">
                Welcome {profile?.full_name?.split(' ')[0]}
            </h2>
        )
    }

    return;
}

type SummaryCount = { [key: string]: number }

/**
 * gets count of each summary type
 * @param summary 
 * @returns 
 */
function getSummaryCount(summary: DashboardSummary[]) {
    const summaryCount: SummaryCount = {}

    summary.forEach(item => {
        if (item.count && item.field) {
            summaryCount[item.field] = item.count
        }
    })

    return summaryCount
}

