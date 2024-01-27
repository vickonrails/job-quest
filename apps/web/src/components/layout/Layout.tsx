import { type Session } from '@supabase/supabase-js';
import { cn } from '@utils/cn';
import dynamic from 'next/dynamic';
import { useState, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { type Profile } from '../../../lib/types';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

// TODO: Error handling in this component is not good
const OnboardingDialog = dynamic(() => import('./OnboardingDialog'), {
    ssr: false
});

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session: Session;
    profile: Profile;
    containerClasses?: string
    pageTitle?: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children, pageTitle, className, session, profile: ssrProfile, containerClasses, ...rest }) => {
    const [profile, setProfile] = useState(ssrProfile);
    const [showModal, setShowModal] = useState(!Boolean(ssrProfile));

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={cn('flex overflow-y-auto h-full max-w-screen-2xl m-auto', className)} {...rest}>
            {sidebarOpen && <Sidebar className="basis-60" />}
            <main className="flex-1  flex flex-col">
                <Navbar profile={profile} session={session} pageTitle={pageTitle} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className={cn('flex-1', containerClasses)}>
                    {children}
                </div>
            </main>

            <OnboardingDialog
                open={showModal}
                user={session?.user}
                setProfile={setProfile}
                onOpenChange={setShowModal}
            />
        </div>
    )
}