import { ChevronRight } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from 'shared';
import { Banner } from 'ui';
import { type Profile } from '../../../lib/types';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

// TODO: Error handling in this component is not good
export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    profile: Profile;
    containerClasses?: string
    pageTitle?: ReactNode
}

const SITE_NAME = 'JobQuest'

export const Layout: FC<LayoutProps> = ({ children, pageTitle, className, profile: profile, containerClasses, ...rest }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter()
    const showSetupBanner = router.pathname !== '/profile/setup' && !profile?.is_profile_setup;

    // FIX: Page title doesn't show when pageTitle is a react component
    const title = pageTitle ? `${typeof pageTitle === 'string' ? pageTitle : ''} - ${SITE_NAME}` : SITE_NAME

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={cn('flex h-full max-w-screen-2xl m-auto', className)} {...rest}>
                {sidebarOpen && <Sidebar className="basis-60" />}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Navbar profile={profile} pageTitle={pageTitle} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    {showSetupBanner && (
                        <Banner variant="info" className="absolute shadow-md left-1/2 m-auto -translate-x-1/2 top-4 flex gap-2 select-none items-center">
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
        </>

    )
}