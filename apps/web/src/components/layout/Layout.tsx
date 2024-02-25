import { type Session } from '@supabase/supabase-js';
import { cn } from '@utils/cn';
import dynamic from 'next/dynamic';
import { useState, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { type Profile } from '../../../lib/types';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Banner } from 'ui';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';

// TODO: Error handling in this component is not good
export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session: Session;
    profile: Profile;
    containerClasses?: string
    pageTitle?: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children, pageTitle, className, session, profile: profile, containerClasses, ...rest }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter()
    const showSetupBanner = router.pathname !== '/profile/setup' && !profile?.is_profile_setup;

    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto', className)} {...rest}>
            {sidebarOpen && <Sidebar className="basis-60" />}
            <main className="flex-1 overflow-hidden flex flex-col">
                <Navbar profile={profile} session={session} pageTitle={pageTitle} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                {showSetupBanner && (
                    <Banner className="absolute shadow-sm left-1/2 m-auto -translate-x-1/2 top-3 flex gap-2 select-none">
                        <span>Your profile needs to be setup to properly use JobQuest.</span>
                        <Link href="/profile/setup" className="font-medium underline">
                            <span>Setup Profile</span>
                            <ChevronRight className="inline-block" size={18} />
                        </Link>
                    </Banner>
                )}
                <div className={cn('flex-1', containerClasses)}>
                    {children}
                </div>
            </main>
        </div>
    )
}