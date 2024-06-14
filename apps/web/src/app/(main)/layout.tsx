import { ProfileSetupBanner } from '@/components/layout/profile-setup-banner';
import { Sidebar } from '@/components/layout/sidebar';
import { getUser, getUserProfile } from '@/db/api';
import '@/styles/globals.css';
import { type Profile } from 'lib/types';
import { cn } from 'shared';

// TODO: add metadata
// TODO: fix font family

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: profile } = await getUserProfile();
    const { data: { user } } = await getUser();
    if (!profile || !user) return null;

    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
            <Sidebar className="basis-60" profile={profile} user={user} />
            <MainShell profile={profile}>
                {children}
            </MainShell>
        </div>
    );
}


export function MainShell({ children, profile }: { children: React.ReactNode, profile: Profile }) {
    return (
        <main className="flex-1 overflow-hidden flex flex-col">
            <ProfileSetupBanner profile={profile} />
            {children}
        </main>
    )
}

