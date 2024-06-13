import { type User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { type Profile } from 'lib/types';
import { BetweenHorizonalEnd, FileType, Home, SquareKanban } from 'lucide-react';
import Image from 'next/image';
import { type FC, type HTMLAttributes } from 'react';
import { Logo } from 'ui/logo';
import LogoImg from '../../../public/logo.png';
import { Feedback } from '../feedback/feedback-popover';
import { NavLink } from './nav-link';
import { ProfileDropdown } from './profile-dropdown';
import { Button } from 'ui/button';
import Link from 'next/link';

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
                    <Logo className="mb-8">
                        <Image src={LogoImg} alt="" height={25} width={25} />
                    </Logo>
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
                </nav>
            </section>

            <section className="border mx-3 p-3 rounded-md flex flex-col gap-3">
                <header>
                    <h2 className="text-sm font-medium">Setup Browser Extension</h2>
                    <p className="text-sm text-muted-foreground">Save time and get the most out of JobQuest by installing the accompanying Chrome extension. </p>
                </header>
                <Button size="sm" asChild>
                    <Link href="https://developer.chrome.com/" target="_blank" rel="noreferrer noopener">Install</Link>
                </Button>

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