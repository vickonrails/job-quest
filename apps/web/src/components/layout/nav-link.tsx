'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from 'shared';
import { type LinkProps } from '../link';

export const NavLink = ({ href, children, ...props }: LinkProps) => {
    const isActiveNav = useIsActiveNav({ href: href.toString() });

    const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (props.disabled) ev.preventDefault();
    }

    return (
        <Link
            onClick={handleClick}
            className={cn('px-3 block border-l-2 border-transparent', isActiveNav && 'border-primary')}
            href={props.disabled ? '' : href}
            {...props}
        >
            <div className={cn(
                'flex items-center p-2 px-3 rounded-lg text-sm select-none text-muted-foreground hover:bg-muted',
                isActiveNav ? 'text-accent-foreground font-medium' : '',
                props.disabled && 'cursor-not-allowed'
            )}>
                {children}
            </div>
        </Link>
    )
}

function useIsActiveNav({ href }: { href: string }) {
    const pathname = usePathname();
    if (pathname === '/dashboard-details' && href === '/') {
        return true
    } else if (href === '/') {
        return pathname === href;
    } else {
        return pathname?.startsWith(href)
    }
}
