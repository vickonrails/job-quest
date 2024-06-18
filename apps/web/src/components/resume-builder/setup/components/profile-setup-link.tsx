'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type AllHTMLAttributes } from 'react'
import { cn } from 'shared'

type SetupLinkProps = AllHTMLAttributes<HTMLAnchorElement>

export function SetupLink({ href, ...props }: SetupLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href;

    return (
        // <li data-testid="setup-navigator"
        //     className={cn('text-muted-foreground hover:rounded-md hover:bg-muted rounded-l-none', isActive && 'border-l-4 hover:rounded-l-none border-primary text-accent-foreground')}
        // >
        <Link href={href ?? ''} className={cn('flex items-center gap-2 px-2 py-3 text-muted-foreground hover:rounded-md hover:bg-muted rounded-l-none', isActive && 'border-l-4 hover:rounded-l-none border-primary text-accent-foreground')} {...props} />
        // </li>
    )
}