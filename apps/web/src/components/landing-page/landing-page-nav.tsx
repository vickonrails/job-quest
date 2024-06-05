import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'ui/button';
import { useLandingPageContext } from './landing-page-context';

export function Nav() {
    const { openWaitListModal, isOnWaitList } = useLandingPageContext()
    return (
        <nav className="flex items-center w-full rounded-full py-3 justify-between gap-2">
            <Link href="/" className="font-medium flex items-center">
                <Image className="rounded-sm" src="/logo.png" width={35} height={35} alt="" />
                {/* JobQuest */}
            </Link>
            <section className="flex gap-3 flex-row items-center text-sm">
                <Link href="https://youtu.be/oFBXAUy4Jkw" target="_blank" className="transition text-accent-foreground/75 hover:text-secondary-foreground hover:underline flex gap-1 items-center">
                    <span>See Demo</span>
                    <ExternalLink size={20} />
                </Link>
                <Button disabled={isOnWaitList} size="sm" onClick={openWaitListModal}>Early Access</Button>
            </section>
        </nav>
    )
}