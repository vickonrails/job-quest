import { type ReactNode } from 'react';
import { cn } from 'shared';
import { Sidebar } from './sidebar';
import { Navbar } from './Navbar';

export function LayoutSlim({ children }: { children: ReactNode }) {
    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
            <Sidebar className="basis-60" />
            <main className="flex-1 overflow-hidden flex flex-col">
                <Navbar profile={profile} pageTitle={pageTitle} />
                {/* {showSetupBanner && (
                    <Banner variant="info" className="absolute shadow-md left-1/2 m-auto -translate-x-1/2 top-4 flex gap-2 select-none items-center">
                        <span>Your profile needs to be setup to properly use JobQuest.</span>
                        <Link href="/profile/setup" className="font-medium underline">
                            <span>Setup Profile</span>
                            <ChevronRight className="inline-block" size={18} />
                        </Link>
                    </Banner>
                )} */}
                <div className={cn('flex-1')}>
                    {children}
                </div>
            </main>
        </div>
    )
}