import { type getSummaryCardData } from '@/app/(main)/dashboard/page';
import { getUserProfile } from '@/db/api';
import { type Profile } from 'lib/types';
import { Building, FolderHeart, ListStart, Timer } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { cn } from 'shared';
import { SummaryCard, SummaryCardType } from './summary-card';

interface WelcomeBannerProps extends HTMLAttributes<HTMLElement> {
    dashboardSummary: Awaited<ReturnType<typeof getSummaryCardData>>
}

export async function JobsSummaryCards({ className, dashboardSummary: summaryCount, ...rest }: WelcomeBannerProps) {
    const { data: profile } = await getUserProfile();

    return (
        <section
            className={cn('', className)}
            {...rest}
        >
            <Greeting profile={profile ?? undefined} />
            <main className="flex gap-4 h-48 items-stretch">
                <SummaryCard
                    title="Recently Added"
                    href="/dashboard/details?card=recently_added"
                    type={SummaryCardType.RECENTLY_ADDED}
                    icon={Timer}
                    count={summaryCount['recently_added']}
                />
                <SummaryCard
                    href="/dashboard/details?card=favorites"
                    title="Favorites"
                    type={SummaryCardType.FAVORITES}
                    icon={FolderHeart}
                    count={summaryCount['favorites']}
                />
                <SummaryCard
                    title="Applying"
                    href="/dashboard/details?card=applying"
                    type={SummaryCardType.APPLYING}
                    icon={Building}
                    count={summaryCount['applying']}
                />
                <SummaryCard
                    href="/dashboard/details?card=interviewing"
                    title="Interviewing"
                    type={SummaryCardType.INTERVIEWING}
                    icon={ListStart}
                    count={summaryCount['interviewing']}
                />
            </main>
        </section>
    )
}

function Greeting({ profile }: { profile?: Profile }) {
    if (profile?.full_name) {
        return (
            <h2 className="w-full text-xl font-medium mb-4">
                Welcome {profile?.full_name?.split(' ')[0]}
            </h2>
        )
    }

    return;
}
