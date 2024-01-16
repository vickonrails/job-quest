import { Link, type LinkProps } from '@components/link';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@components/tooltip';
import { cn } from '@utils/cn';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useMemo, type FC, type HTMLAttributes } from 'react';
import { Bell, Clipboard, File, FileText, Folder, Grid, User } from 'react-feather';
import { Logo } from 'ui';

type SidebarProps = HTMLAttributes<HTMLElement>;

// TODO: reconfigure this whole link system to use just /jobs/jobs-id. Rename Application Tracker to just Jobs.

export const Sidebar: FC<SidebarProps> = ({ className, ...rest }) => {
    return (
        <aside data-testid="sidebar" className={
            clsx(
                'p-5 flex-shrink-0 sticky max-h-screen top-0 bg-background border-r',
                className
            )
        } {...rest}>
            <Logo className="mb-10" />

            <nav>
                <NavGroup className="mb-6">
                    <NavLink href="/">
                        <Grid className="mr-2" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink href="/jobs">
                        <Folder className="mr-2" />
                        <span>Tracker</span>
                    </NavLink>

                    <NavLink href="/resume-builder" disabled>
                        <File className="mr-2" />
                        <span>Resume Builder</span>
                    </NavLink>
                </NavGroup>

                <NavGroup title="labels">
                    <NavLink href="/notes">
                        <FileText className="mr-2" />
                        <span>Notes</span>
                    </NavLink>

                    <NavLink href="/reminder" disabled>
                        <Bell className="mr-2" />
                        <span>Reminder</span>
                    </NavLink>

                    <NavLink href="/documents" disabled>
                        <Clipboard className="mr-2" />
                        <span>Documents</span>
                    </NavLink>

                    <NavLink href="/contacts" disabled>
                        <User className="mr-2" />
                        <span>Contacts</span>
                    </NavLink>
                </NavGroup>
            </nav>
        </aside>
    )
}

function isActive(path: string, href: string) {
    if (href === '/') {
        return path === href
    } else {
        // apply second rule
        return path.startsWith(href)
    }
}

const NavLink = ({ href, ...props }: LinkProps) => {
    const { pathname } = useRouter();
    const isActiveNav = useMemo(() => isActive(pathname, href.toString()), [href, pathname]);

    const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (props.disabled) ev.preventDefault();
    }

    const link = (
        <Link
            onClick={handleClick}
            className={cn(
                'flex items-center py-2 px-3 rounded-lg text-sm',
                isActiveNav ? 'bg-indigo-100 text-primary-light font-medium' : 'text-gray-500',
                props.disabled && 'cursor-not-allowed text-gray-400'
            )}
            href={props.disabled ? '' : href}
            {...props}
        />
    )

    if (!props.disabled) return link;

    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                {link}
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent side="right">
                    Coming soon
                </TooltipContent>
            </TooltipPortal>
        </Tooltip>
    )
}

interface NavGroupProps extends HTMLAttributes<HTMLElement> {
    title?: string
}

const NavGroup = ({ title, children, ...rest }: NavGroupProps) => {
    return (
        <div {...rest}>
            <h4 className="mb-4 uppercase text-xs font-bold px-3 text-gray-500">{title}</h4>
            {children}
        </div>
    )
}