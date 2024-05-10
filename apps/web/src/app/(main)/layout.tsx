import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { fetchUserQuery, fetchProfileQuery } from '@/queries/auth';
import '@/styles/globals.css';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient, type PostgrestSingleResponse } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { Database, cn } from 'shared';

// TODO: add metadata
// TODO: fix font family

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
            <Sidebar className="basis-60" />
            <main className="flex-1 overflow-hidden flex flex-col">
                <Navbar />
                <div className={cn('flex-1 p-6 overflow-auto')}>
                    {children}
                </div>
            </main>
        </div>
    );
}
