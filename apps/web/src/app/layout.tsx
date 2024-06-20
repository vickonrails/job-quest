import '@/styles/globals.css';
import 'ui/styles';

import { ThemeProvider } from '@/providers/theme-provider';
import { ReactQueryClientProvider } from '@/react-query/query-provider';
import { type ReactNode } from 'react';
import Plausible from '@/components/plausible-provider';

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
