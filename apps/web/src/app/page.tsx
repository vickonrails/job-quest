import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'ui/button'

export default function AppRoot() {
    return (
        <div className="landing-page py-10 max-w-7xl mx-auto">
            <div className="z-10 flex flex-col items-center gap-4">
                <Header />
                <Waitlist />
                <Footer />
            </div>
        </div>
    )
}

/**
 * Footer
 */

function Footer() {
    return (
        <footer className="w-full">
            <Image src="/job.quest.1.dark.png" height={100} width={1000} alt="" className="w-full -mb-[1000px]" />
        </footer>
    )
}

/**
 * Demo Video
 */
function DemoVideo() {
    return (
        <div className="border shadow-md rounded-lg">
            <video autoPlay muted loop>
                <source src="/Job.quest-demo-dark.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}

/**
 * Header
 */
function Header() {
    return (
        <>
            <Nav />
            <header className="text-center pt-36 mb-16 max-w-5xl">
                <h1 className="uppercase text-sm mb-4 tracking-widest text-muted-foreground">Stay on top of your job search</h1>
                <h2 className="text-7xl font-bold leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-transparent bg-clip-text">jobquest is an open-source operating system for your job search.</h2>
            </header>
            {/* <DemoVideo /> */}
            <HorizontalLine />
        </>
    )
}

/**
 * Nav
 */
function Nav() {
    return (
        <nav className="flex bg-muted max-w-2xl items-center w-full rounded-full p-3 pl-4 justify-between gap-2">
            <Link href="/" className="font-medium flex items-center">
                <Image className="rounded-sm" src="/logo.png" width={35} height={35} alt="" />
                {/* JobQuest */}
            </Link>
            <section className="flex gap-3 flex-row items-center text-sm">
                {/* <Link href="/" className="hover:text-accent-foreground">Changelog</Link> */}
                <Link href="https://demo.getjobquest.com" target="_blank" className="transition text-accent-foreground/75 hover:text-secondary-foreground hover:underline flex gap-1 items-center">
                    <span>See Demo</span>
                    <ExternalLink size={20} />
                </Link>
                <Button>Get Early Access</Button>
            </section>
        </nav>
    )
}

function HorizontalLine() {
    return (
        <hr className="w-[40%] my-10" />
    )
}

/**
 * Waitlist   
 */
function Waitlist() {
    return (
        <section className="text-center pt-40 pb-28 max-w-lg">
            <section className="mb-6">
                <Image className="animate-pulse rounded-sm mx-auto mb-6" src="/logo.png" width={80} height={80} alt="" />
                <p className="uppercase text-sm tracking-widest text-muted-foreground">What&apos;s stopping you?</p>
                <h2 className="text-6xl max-w-5xl font-medium leading-tight ">join the waitlist.</h2>
                <p className="text-base text-muted-foreground ">jobquest includes a Job Tracker, a Resume builder, a browser clipper for grabbing jobs anywhere on the internet, and an AI assistant to help with cover letters, etc. We&apos;re close to a beta release and by joining now, you&apos;ll unlock some features and get immediate support.</p>
            </section>
            <Button className="font-medium">Get Early Access</Button>
        </section>
    )
}