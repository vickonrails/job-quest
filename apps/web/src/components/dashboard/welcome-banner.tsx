import clsx from 'clsx';
import { type Profile } from 'lib/types';
import { Building, FolderHeart, ListStart, Timer, type LucideIcon } from 'lucide-react';
import Link, { type LinkProps as NextLinkProps } from 'next/link';
import { type HTMLAttributes } from 'react';
import { cn } from 'shared';

interface WelcomeBannerProps extends HTMLAttributes<HTMLElement> {
    profile: Profile
}

export function JobsSummaryCards({ className, profile, ...rest }: WelcomeBannerProps) {
    return (
        <section
            className={clsx('', className)}
            {...rest}
        >
            <h2 className="w-full text-3xl font-bold my-6">Welcome {profile?.full_name?.split(' ')[0]}</h2>
            <main className="flex gap-4 h-60 items-stretch">
                <SummaryCard
                    title="Recently Added"
                    href="/dashboard-details?card=recently_added"
                    type={SummaryCardType.RECENTLY_ADDED}
                    icon={Timer}
                    count={20}
                />

                <SummaryCard
                    title="Upcoming Interviews"
                    href="/dashboard-details?card=upcoming_interviews"
                    type={SummaryCardType.UPCOMING_INTERVIEWS}
                    icon={Building}
                    count={15}
                />
                <SummaryCard
                    href="/dashboard-details?card=favorites"
                    title="Favorites"
                    type={SummaryCardType.FAVORITES}
                    icon={FolderHeart}
                    count={12}
                />
                <SummaryCard
                    href="/dashboard-details?card=next_in_line"
                    title="Next in Line"
                    type={SummaryCardType.NEXT_IN_LINE}
                    icon={ListStart}
                />
            </main>
        </section>
    )
}

enum SummaryCardType {
    RECENTLY_ADDED,
    UPCOMING_INTERVIEWS,
    FAVORITES,
    NEXT_IN_LINE
}

export interface LinkProps extends NextLinkProps {
    className?: string
    disabled?: boolean
    title?: string
    type: SummaryCardType
    icon: LucideIcon
    count?: number
}

function getTypeGradient(type: SummaryCardType) {
    switch (type) {
        case SummaryCardType.RECENTLY_ADDED:
            return 'from-neutral-950 to-neutral-600'
        case SummaryCardType.UPCOMING_INTERVIEWS:
            return 'from-indigo-900 to-indigo-600'
        case SummaryCardType.FAVORITES:
            return ' from-rose-900 to-rose-600'
        case SummaryCardType.NEXT_IN_LINE:
            return 'from-purple-900 to-purple-600'
    }
}

function SummaryCard({ title, type, className, icon: Icon, count = 10, ...rest }: LinkProps) {
    const gradientClasses = getTypeGradient(type)

    return (
        <Link
            className={cn(
                'transition-colors p-4 rounded-lg flex flex-col text-white justify-end items-center border flex-1 h-full opacity-95 bg-gradient-to-tr group hover:opacity-100',
                gradientClasses,
                className
            )}
            {...rest}
        >
            <span className="transition-transform bg-white h-6 w-6 rounded-full text-xs font-bold text-black text-center flex self-end justify-center group-hover:scale-125 group-focus-within:scale-125">
                <span className="m-auto">
                    {count}
                </span>
            </span>
            {Icon && (
                <div className="flex-1 grid">
                    <Icon className="transition-transform m-auto group-hover:scale-125 group-focus-within:scale-125" size={50} />
                </div>
            )}
            <h3 className="transition-transform text-xl text-center font-medium group-hover:-translate-y-4 group-focus-within:-translate-y-4">{title}</h3>
        </Link>
    )
}

