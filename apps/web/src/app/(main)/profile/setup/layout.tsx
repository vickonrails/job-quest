import SetupNav from '@/components/resume-builder/setup/components/setup-navigator';
import { cn } from 'shared';

export default function ProfileSetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={cn('flex h-full max-w-screen-2xl m-auto')}>
            <SetupNav />
            <main className="p-6 flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
