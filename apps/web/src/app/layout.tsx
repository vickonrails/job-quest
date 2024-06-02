import '@/styles/globals.css';
import 'ui/styles';

import { ThemeProvider } from '@/providers/theme-provider';
import { type ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    )
}
