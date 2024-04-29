import { FeedbackButton } from '@components/feedback-widget';
import { type Session } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { PanelLeftClose } from 'lucide-react';
import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { NavbarMenu } from './navbar-menu';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    toggleSidebar: () => void
    profile: Profile
    session: Session
    pageTitle?: ReactNode
}

// TODO: I might need to visually separate the close button from the title
// TODO: consider putting profile inside a react query cache so we can invalidate it once an item changes (Like editing the name in profile setup)

const Navbar: FC<NavbarProps> = ({ profile, pageTitle, toggleSidebar, ...props }) => {
    const isTitleString = typeof pageTitle === 'string';
    return (
        <nav data-testid="navbar" className="sticky top-0 border-b bg-white" {...props}>
            <section className="p-4 py-1 flex justify-between items-center">
                <section className="flex items-center gap-2">
                    <button onClick={toggleSidebar}>
                        <PanelLeftClose size={22} />
                    </button>
                    {isTitleString ? (
                        <h1 className="text-base font-medium">{pageTitle}</h1>
                    ) : (
                        <span>{pageTitle}</span>
                    )}
                </section>
                <div className="flex items-center gap-2">
                    <FeedbackButton />
                    <NavbarMenu profile={profile} />
                </div>
            </section>
        </nav>
    )
}

export { Navbar };
