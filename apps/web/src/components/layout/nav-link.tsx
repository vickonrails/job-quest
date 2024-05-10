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
                'flex items-center py-2 px-3 rounded-lg text-sm select-none',
                isActiveNav ? 'bg-indigo-100 text-primary-light font-medium' : 'text-gray-500',
                props.disabled && 'cursor-not-allowed text-gray-400'
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
