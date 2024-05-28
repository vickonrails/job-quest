import { type LucideIcon } from 'lucide-react';
import Link, { type LinkProps as NextLinkProps } from 'next/link';
import { cn } from 'shared';

export enum SummaryCardType {
    RECENTLY_ADDED = 0,
    APPLYING = 1,
    INTERVIEWING = 4,
    FAVORITES
}

interface LinkProps extends NextLinkProps {
    className?: string
    disabled?: boolean
    title?: string
    type: SummaryCardType
    icon: LucideIcon
    count?: number
}

export function SummaryCard({ title, type, className, icon: Icon, count = 0, ...rest }: LinkProps) {
    const gradientClasses = getTypeGradient(type)

    return (
        <Link
            className={cn(
                'transition-colors p-4 rounded-lg flex flex-col text-white justify-end items-center border flex-1 h-full opacity-90 bg-gradient-to-tr group hover:opacity-100',
                gradientClasses,
                className
            )}
            {...rest}
        >
            <span className="transition-transform bg-neutral-200 h-6 w-6 rounded-full text-xs font-bold text-neutral-700 text-center flex self-end justify-center group-hover:scale-105">
                <span className="m-auto">
                    {count}
                </span>
            </span>
            {Icon && (
                <div className="flex-1 grid">
                    <Icon className="transition-transform m-auto group-hover:scale-125 group-focus-within:scale-125" size={30} />
                </div>
            )}
            <h3 className="transition-transform text-lg text-center text-neutral-100 font-medium group-hover:-translate-y-2 group-focus-within:-translate-y-2">{title}</h3>
        </Link>
    )
}

function getTypeGradient(type: SummaryCardType) {
    switch (type) {
        case SummaryCardType.RECENTLY_ADDED:
            return 'from-neutral-950 to-neutral-600'
        case SummaryCardType.APPLYING:
            return 'from-indigo-900 to-indigo-600'
        case SummaryCardType.FAVORITES:
            return ' from-rose-900 to-rose-600'
        case SummaryCardType.INTERVIEWING:
            return 'from-purple-900 to-purple-600'
    }
}
