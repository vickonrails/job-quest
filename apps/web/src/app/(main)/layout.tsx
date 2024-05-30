import { Sidebar } from '@/components/layout/sidebar';
import { getUser, getUserProfile } from '@/db/api';
import { ReactQueryClientProvider } from '@/react-query/query-provider';
import '@/styles/globals.css';
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
        <ReactQueryClientProvider>
            <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
                <Sidebar className="basis-60" profile={profile} user={user} />
                {children}
            </div>
        </ReactQueryClientProvider>
    );
}


export function MainShell({ title, children }: { title: string | React.ReactNode, children: React.ReactNode }) {
    return (
        <main className="flex-1 overflow-hidden flex flex-col">
            {/* <Navbar pageTitle={title} /> */}
            {children}
        </main>
    )
}