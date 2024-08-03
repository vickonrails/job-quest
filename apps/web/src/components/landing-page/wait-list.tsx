'use client'

import { Youtube } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'ui/button'

export function WaitList() {
    return (
        <section className="text-left md:text-center md:mx-auto max-w-5xl md:max-w-3xl">
            <section className="mb-6">
                <p className="uppercase mb-4 text-sm tracking-widest text-muted-foreground">JobQuest is launching very soon.</p>
                <h2 className="text-3xl md:text-6xl mb-4 font-bold leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-transparent bg-clip-text">be first to know<br /> when it launches.</h2>
            </section>

            <section className="flex gap-3 md:justify-center flex-row items-center text-sm">
                <Button asChild>
                    <Link href="/waitlist">Join Waitlist</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="https://youtu.be/oFBXAUy4Jkw" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Youtube size={20} />
                        <span>See Demo</span>
                    </Link>
                </Button>
            </section>
        </section>
    )
}