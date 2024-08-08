'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';
import { useLocalStorageState } from '@/hooks/use-localstorage';
import { type User } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { BetweenHorizonalEnd, FileType, Home, SquareKanban } from 'lucide-react';
import Link from 'next/link';
import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from 'shared';
import { Button } from 'ui/button';
import { Logo } from 'ui/logo';
import { Feedback } from '../feedback/feedback-popover';
import { NavLink } from './nav-link';
import { ProfileDropdown } from './profile-dropdown';

type SidebarProps = HTMLAttributes<HTMLElement> & { profile: Profile, user: User };

// TODO: reconfigure this whole link system to use just /jobs/jobs-id. Rename Application Tracker to just Jobs.
export const Sidebar: FC<SidebarProps> = ({ profile, user, className, ...rest }) => {
    const { value: expanded, setValue: setExpanded } = useLocalStorageState<boolean>({
        key: 'jb-sidebar-expanded',
        defaultValue: true
    })

    const toggleExpanded = () => {
        setExpanded(!expanded)
    }

    return (
        <aside data-testid="sidebar" className={
            cn(
                'py-4 flex-shrink-0 sticky max-h-screen top-0 bg-background border-r flex flex-col justify-between transition-all ease-out',
                expanded ? 'basis-60' : 'basis-0',
                className
            )
        } {...rest}>
            <section className="flex-1">
                <section className="flex justify-between ml-6 mr-3 items-center mb-4">
                    {expanded && <Logo />}
                    <Button variant="ghost" size="icon" className="active:border active:border-1" onClick={toggleExpanded}>
                        <BetweenHorizonalEnd
                            className="text-muted-foreground"
                            size={20}
                        />
                    </Button>
                </section>
                <nav>
                    <NavGroup className="mb-6">
                        <TooltipWrapper expanded={expanded} content="dashboard">
                            <NavLink href="/dashboard">
                                <Home className={cn(expanded && 'mr-2')} size={20} />
                                {expanded && <span>Home</span>}
                            </NavLink>
                        </TooltipWrapper>

                        <TooltipWrapper content="Job Tracker" expanded={expanded}>
                            <NavLink href="/jobs-tracker">
                                <SquareKanban className={cn(expanded && 'mr-2')} size={20} />
                                {expanded && <span>Job Tracker</span>}
                            </NavLink>
                        </TooltipWrapper>

                        <TooltipWrapper expanded={expanded} content="Resumes">
                            <NavLink href="/resumes">
                                <FileType className={cn(expanded && 'mr-2')} size={20} />
                                {expanded && <span>My Resumes</span>}
                            </NavLink>
                        </TooltipWrapper>
                    </NavGroup>
                </nav>
            </section>

            {!profile.has_tried_browser_extension && expanded &&
                <BrowserExtensionBanner />
            }

            <section className="p-3">
                <Feedback expanded={expanded} />
            </section>

            <section className="px-3 py-3 border-t">
                <ProfileDropdown
                    expanded={expanded}
                    profile={profile}
                    user={user}
                />
            </section>
        </aside>
    )
}

function BrowserExtensionBanner() {
    return (
        <section className="border mx-3 p-3 rounded-md flex flex-col gap-3">
            <header>
                <h2 className="text-sm font-medium">Setup Browser Extension</h2>
                <p className="text-sm text-muted-foreground">Save time and get the most out of JobQuest by installing the accompanying Chrome extension. </p>
            </header>
            <Button size="sm" asChild>
                <Link href="https://chromewebstore.google.com/detail/jobkjhkfbhaaeieofbbdabiajgmnabmj" target="_blank" rel="noreferrer noopener">Install</Link>
            </Button>
        </section>
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

export function TooltipWrapper({ children, content, expanded, asChild = false }: { children: ReactNode, content: ReactNode, expanded: boolean, asChild?: boolean }) {
    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger className="w-full" asChild={asChild}>{children}</TooltipTrigger>
            {!expanded && (
                <TooltipContent side="right" className="bg-accent shadow-md text-sm">
                    <div className="z-50">{content}</div>
                </TooltipContent>
            )}
        </Tooltip>
    )
}