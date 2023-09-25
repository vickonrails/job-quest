import { type Session } from '@supabase/supabase-js';
import { cn } from '@utils/cn';
import dynamic from 'next/dynamic';
import { useState, type FC, type HTMLAttributes } from 'react';
import { type Profile } from '../../../lib/types';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

// Error handling in this component is not good
const OnboardingDialog = dynamic(() => import('./OnboardingDialog'), {
    ssr: false
});

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session: Session;
    profile: Profile;
    containerClasses?: string
}

export const Layout: FC<LayoutProps> = ({ children, className, session, profile: ssrProfile, containerClasses, ...rest }) => {
    const [profile, setProfile] = useState(ssrProfile);
    const [showModal, setShowModal] = useState(!Boolean(ssrProfile));

    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto', className)} {...rest}>
            <Sidebar className="basis-64" />
            <main className="flex-1 p-6 flex flex-col">
                <Navbar profile={profile} session={session} />
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