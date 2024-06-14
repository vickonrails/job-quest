import Image from 'next/image';
import { Nav } from './landing-page-nav';
import { VideoPreview } from './video-preview';
import Link from 'next/link';
import { Github } from 'lucide-react';

/**
 * Header
 */
export function Header() {
    return (
        <div className="mx-auto w-full">
            <Nav />
            <header className="text-left md:text-center pt-36 mb-4 md:mb-16 md:max-w-[80%] lg:max-w-5xl mx-auto">
                <h1 className="uppercase text-sm mb-2 tracking-widest">Stay on top of your job search</h1>
                <h2 className="text-4xl md:text-5xl lg:text-7xl mb-4 font-bold md:leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-transparent bg-clip-text">an open-source operating system for your job search.</h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto mb-4">JobQuest includes a Job Tracker, a Resume builder, a clipper for grabbing jobs from popular job sites, and generative AI for cover letters, resumes, etc.</p>

                <section className="flex items-center justify-center text-muted-foreground">
                    <Link href="https://discord.gg/GS2F6zVP" target="_blank" rel="noreferrer noopener" className="p-2 hover:bg-accent rounded-md">
                        <Image src="/discord-icon.svg" height={30} width={30} alt="" />
                    </Link>
                    <Link href="https://github.com/vickonrails/job-quest" target="_blank" rel="noreferrer noopener" className="p-2 hover:bg-accent rounded-md">
                        <Github size={30} />
                    </Link>
                </section>
            </header>

            <VideoPreview />
            {/* <HorizontalLine /> */}
        </div>
    )
}

function HorizontalLine() {
    return (
        <hr className="w-[40%] my-10 mx-auto" />
    )
}

export function Footer() {
    return (
        <footer className="w-full">
            <Image src="/screenshot-tracker.png" height={100} width={1000} alt="" className="w-full -mb-[1000px]" />
        </footer>
    )
}