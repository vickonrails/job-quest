'use client'

import { Footer, Header } from '@/components/landing-page/header';
import { LandingPageProvider } from '@/components/landing-page/landing-page-context';
import { WaitList } from '@/components/landing-page/wait-list';

export default function LandingPage() {
    return (
        <div className="landing-page py-10 px-4 max-w-7xl mx-auto animate-in">
            <LandingPageProvider>
                <div className="z-10 flex flex-col items-stretch gap-4 w-full">
                    <Header />
                    <WaitList />
                    <Footer />
                </div>
            </LandingPageProvider>
        </div>
    )
}