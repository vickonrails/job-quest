import '@/styles/globals.css';
import 'ui/styles';

import { ThemeProvider } from '@/providers/theme-provider';
import { ReactQueryClientProvider } from '@/react-query/query-provider';
import { type ReactNode } from 'react';
import Plausible from '@/components/plausible-provider';
import { type Metadata } from 'next';

export const coreMeta = {
    url: 'https://getjobquest.com',
    title: 'Stay on top of your job search - JobQuest',
    description: 'JobQuest includes a Job Tracker, a Resume builder, a clipper for grabbing jobs from popular job sites, and generative AI for cover letters, resumes, etc.'
}

export const metadata: Metadata = {
    ...coreMeta,
    metadataBase: new URL(coreMeta.url),
    keywords: '',
    twitter: {
        ...coreMeta,
        card: 'summary_large_image',
        site: coreMeta.url,
    },
    openGraph: {
        ...coreMeta,
        type: 'website',
        images: [],
        siteName: 'JobQuest',
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <Plausible>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body className="overflow-auto">
                    <ReactQueryClientProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </ReactQueryClientProvider>
                </body>
            </html>
        </Plausible>
    )
}
