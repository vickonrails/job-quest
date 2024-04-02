import { inter } from '@/app/ui/fonts';
import '@/app/ui/global.css';
import { cn } from 'shared';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={cn(inter.className, 'antialiased')}>{children}</body>
        </html>
    );
}