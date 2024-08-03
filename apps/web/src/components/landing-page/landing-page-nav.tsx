import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Nav() {
    return (
        <nav className="flex items-center w-full rounded-full py-3 justify-between gap-2">
            <Link href="/" className="font-medium flex items-center">
                <Image className="rounded-sm" src="/logo.png" width={35} height={35} alt="" />
            </Link>
            <section className="flex gap-3 flex-row items-center text-sm">
                {/* <Link href="https://youtu.be/oFBXAUy4Jkw" target="_blank" className="transition text-accent-foreground/75 hover:text-secondary-foreground hover:underline flex gap-1 items-center">
                    <span>See Demo</span>
                    <ExternalLink size={20} />
                </Link> */}
                {/* <Button asChild size="sm">
                    <Link href="https://youtu.be/oFBXAUy4Jkw" target="_blank" rel="noopener noreferrer">
                        Watch Demo
                    </Link>
                </Button> */}
                <Link href="https://github.com/vickonrails/job-quest" target="_blank" rel="noreferrer noopener" className="p-2 hover:bg-accent rounded-md">
                    <Github size={24} className="text-muted-foreground" />
                </Link>
            </section>
        </nav>
    )
}