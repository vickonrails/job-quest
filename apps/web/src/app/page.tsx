'use client'

import { Footer, Header } from '@/components/landing-page/header';
import { LandingPageProvider } from '@/components/landing-page/landing-page-context';
import { WaitList } from '@/components/landing-page/wait-list';

export default function LandingPage() {
    return (
        <LandingPageProvider>
            <div className="landing-page py-10 max-w-7xl mx-auto">
                <div className="z-10 flex flex-col items-center gap-4">
                    <Header />
                    <WaitList />
                    <Footer />
                </div>
            </div>
        </LandingPageProvider>
    )
}