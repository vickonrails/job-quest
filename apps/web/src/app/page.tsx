import { Footer, Header } from '@/components/landing-page/header';
import { WaitList } from '@/components/landing-page/wait-list';

export default function LandingPage() {
    return (
        <div className="landing-page py-10 px-4 max-w-7xl mx-auto animate-in">
            <div className="z-10 flex flex-col items-stretch gap-14 w-full">
                <Header />
                <WaitList />
                <Footer />
            </div>
        </div>
    )
}