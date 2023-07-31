import React, { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router';
import { Folder, Grid, File, Clipboard, Bell, User, FileText } from 'react-feather'
import { Link, type LinkProps } from '@components/link';
import { Logo } from 'ui';

type SidebarProps = HTMLAttributes<HTMLElement>;

// TODO: reconfigure this whole link system to use just /jobs/jobs-id. Rename Application Tracker to just Jobs.

export const Sidebar: FC<SidebarProps> = ({ className, ...rest }) => {
    return (
        <aside data-testid="sidebar" className={
            clsx(
                'p-5 flex-shrink-0 sticky max-h-screen top-0',
                className
            )
        } {...rest}>
            <Logo className="mb-10" />

            <nav>
                <NavGroup className="mb-6">
                    <NavLink href="/app/dashboard">
                        <Grid className="mr-2" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink href="/app/tracker">
                        <Folder className="mr-2" />
                        <span>Application Tracker</span>
                    </NavLink>

                    <NavLink href="/app/resume-builder">
                        <File className="mr-2" />
                        <span>Resume Builder</span>
                    </NavLink>
                </NavGroup>

                <NavGroup title="labels">
                    <NavLink href="/app/resume-builder">
                        <FileText className="mr-2" />
                        <span>Notes</span>
                    </NavLink>

                    <NavLink href="/app/resume-builder">
                        <Bell className="mr-2" />
                        <span>Reminder</span>
                    </NavLink>

                    <NavLink href="/app/resume-builder">
                        <Clipboard className="mr-2" />
                        <span>Documents</span>
                    </NavLink>

                    <NavLink href="/app/resume-builder">
                        <User className="mr-2" />
                        <span>Contacts</span>
                    </NavLink>
                </NavGroup>
            </nav>
        </aside>
    )
}

const NavLink = ({ href, ...props }: LinkProps) => {
    const { pathname } = useRouter();
    const isActive = pathname.startsWith(href.toString());

    return (
        <Link
            className={clsx(
                'flex items-center py-2 px-3 rounded-lg text-sm',
                isActive ? 'bg-indigo-100 text-primary-light font-medium' : 'text-gray-500'
            )}
            href={href}
            {...props}
        />
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