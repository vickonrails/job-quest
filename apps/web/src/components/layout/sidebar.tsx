import { type User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { type Profile } from 'lib/types';
import { BetweenHorizonalEnd, FileType, Home, SquareKanban } from 'lucide-react';
import { type FC, type HTMLAttributes } from 'react';
import { Logo } from 'ui/logo';
import { Feedback } from '../feedback/feedback-popover';
import { NavLink } from './nav-link';
import { ProfileDropdown } from './profile-dropdown';

type SidebarProps = HTMLAttributes<HTMLElement> & { profile: Profile, user: User };

// TODO: reconfigure this whole link system to use just /jobs/jobs-id. Rename Application Tracker to just Jobs.
export const Sidebar: FC<SidebarProps> = ({ profile, user, className, ...rest }) => {
    return (
        <aside data-testid="sidebar" className={
            clsx(
                'py-4 flex-shrink-0 sticky max-h-screen top-0 bg-background border-r flex flex-col justify-between',
                className
            )
        } {...rest}>
            <section className="flex-1">
                <section className="flex justify-between ml-6 mr-3">
                    <Logo className="mb-8" />
                    <BetweenHorizonalEnd className="text-muted-foreground" size={20} />
                </section>
                <nav>
                    <NavGroup className="mb-6">
                        <NavLink href="/dashboard">
                            <Home className="mr-2" />
                            <span>Home</span>
                        </NavLink>

                        <NavLink href="/jobs-tracker">
                            <SquareKanban className="mr-2" />
                            <span>Job Tracker</span>
                        </NavLink>

                        <NavLink href="/resumes">
                            <FileType className="mr-2" />
                            <span>My Resumes</span>
                        </NavLink>
                    </NavGroup>


                    {/* <NavGroup title="labels">
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
                </NavGroup> */}
                </nav>
            </section>

            <section className="p-3">
                <Feedback />
            </section>

            <section className="px-3 py-3 border-t">
                <ProfileDropdown profile={profile} user={user} />
            </section>
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