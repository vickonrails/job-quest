import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { ReactQueryClientProvider } from '@/react-query/query-provider';
import '@/styles/globals.css';
import { cn } from 'shared';

// TODO: add metadata
// TODO: fix font family

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReactQueryClientProvider>
            <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
                <Sidebar className="basis-60" />
                {children}
            </div>
        </ReactQueryClientProvider>
    );
}


export function MainShell({ title, children }: { title: string | React.ReactNode, children: React.ReactNode }) {
    return (
        <main className="flex-1 overflow-hidden flex flex-col">
            <Navbar pageTitle={title} />
            {children}
        </main>
    )
}