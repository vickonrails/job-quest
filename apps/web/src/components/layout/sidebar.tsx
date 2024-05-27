import clsx from 'clsx';
import { Bell, Clipboard, File, FileText, Folder, Grid, User } from 'lucide-react';
import { type FC, type HTMLAttributes } from 'react';
import { Logo } from 'ui/logo';
import { NavLink } from './nav-link';

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
                    <NavLink href="/dashboard">
                        <Grid className="mr-2" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink href="/jobs-tracker">
                        <Folder className="mr-2" />
                        <span>Job Tracker</span>
                    </NavLink>

                    <NavLink href="/resumes">
                        <File className="mr-2" />
                        <span>My Resumes</span>
                    </NavLink>
                </NavGroup>

                <NavGroup title="labels">
                    <NavLink href="/notes" disabled>
                        <FileText className="mr-2" />
                        <span>Notes</span>
                    </NavLink>

                    <NavLink href="/reminder" disabled>
                        <Bell className="mr-2" />
                        <span>Reminders</span>
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

interface NavGroupProps extends HTMLAttributes<HTMLElement> {
    title?: string
}

const NavGroup = ({ title, children, ...rest }: NavGroupProps) => {
    return (
        <div {...rest}>
            <h4 className="mb-4 uppercase text-xs font-bold px-3">{title}</h4>
            {children}
        </div>
    )
}