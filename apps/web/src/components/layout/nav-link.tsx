'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from 'shared';
import { type LinkProps } from '../link';

export const NavLink = ({ href, ...props }: LinkProps) => {
    const isActiveNav = useIsActiveNav({ href: href.toString() });

    const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (props.disabled) ev.preventDefault();
    }

    return (
        <Link
            onClick={handleClick}
            className={cn(
                'flex items-center py-2 px-3 rounded-lg text-sm select-none text-muted-foreground hover:bg-muted',
                isActiveNav ? 'text-accent-foreground font-medium bg-muted' : '',
                props.disabled && 'cursor-not-allowed'
            )}
            href={props.disabled ? '' : href}
            {...props}
        />
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
