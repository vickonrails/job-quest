import { Navbar } from '@/components/layout/Navbar';
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
                <main className="flex-1 overflow-hidden flex flex-col">
                    <Navbar />
                    {children}
                </main>
            </div>
        </ReactQueryClientProvider>
    );
}
