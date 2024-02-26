import { cn } from '@utils/cn';
import clsx from 'clsx';
import { type Profile } from 'lib/types';
import { ArrowDownAZ, FolderHeart, type LucideIcon, Timer, ListStart } from 'lucide-react';
import Link, { type LinkProps as NextLinkProps } from 'next/link';
import { type HTMLAttributes } from 'react';

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
                <SummaryCard title="Recently Added" href="" type={SummaryCardType.RECENTLY_ADDED} icon={Timer} count={20} />
                <SummaryCard title="Recently Applied" href="" type={SummaryCardType.RECENTLY_APPLIED} icon={ArrowDownAZ} count={15} />
                <SummaryCard href="" title="Favorites" type={SummaryCardType.FAVORITES} icon={FolderHeart} count={12} />
                <SummaryCard href="" title="Next in Line" type={SummaryCardType.NEXT_IN_LINE} icon={ListStart} />
            </main>
        </section>
    )
}

enum SummaryCardType {
    RECENTLY_ADDED,
    RECENTLY_APPLIED,
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
        case SummaryCardType.RECENTLY_APPLIED:
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
                'p-4 rounded-lg flex flex-col text-white justify-end items-center border flex-1 h-full bg-gradient-to-tr',
                gradientClasses,
                className
            )}
            {...rest}
        >
            <span className="bg-white h-6 w-6 rounded-full text-xs font-bold text-black text-center flex self-end justify-center">
                <span className="m-auto">
                    {count}
                </span>
            </span>
            {Icon && (
                <div className="flex-1 grid">
                    <Icon className="m-auto" size={50} />
                </div>
            )}
            <h3 className="text-xl text-center font-medium">{title}</h3>
        </Link>
    )
}

