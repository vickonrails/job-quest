import Image from 'next/image';
import { Nav } from './landing-page-nav';
import { VideoPreview } from './video-preview';

/**
 * Header
 */
export function Header() {
    return (
        <>
            <Nav />
            <header className="text-center pt-36 mb-16 max-w-5xl">
                <h1 className="uppercase text-sm mb-2 tracking-widest">Stay on top of your job search</h1>
                <h2 className="text-7xl mb-4 font-bold leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-transparent bg-clip-text">an open-source operating system for your job search.</h2>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto">JobQuest includes a Job Tracker, a Resume builder, a clipper for grabbing jobs, and generative AI for cover letters, etc. We&apos;re close to a beta release and by joining now, you&apos;ll unlock some features and get immediate support.</p>
            </header>
            <VideoPreview />
            <HorizontalLine />
        </>
    )
}

function HorizontalLine() {
    return (
        <hr className="w-[40%] my-10" />
    )
}

export function Footer() {
    return (
        <footer className="w-full">
            <Image src="/job.quest.1.dark.png" height={100} width={1000} alt="" className="w-full -mb-[1000px]" />
        </footer>
    )
}