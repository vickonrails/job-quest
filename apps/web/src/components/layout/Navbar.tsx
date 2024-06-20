import { getUserProfile } from '@/db/api/profile.api';
import { PanelLeftClose } from 'lucide-react';
import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { Feedback } from '../feedback/feedback-popover';
import { ThemeSwitcher } from '../theme-switcher';
import { NavbarMenu } from './navbar-menu';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    toggleSidebar?: () => void
    pageTitle?: ReactNode
}

// TODO: I might need to visually separate the close button from the title
// TODO: consider putting profile inside a react query cache so we can invalidate it once an item changes (Like editing the name in profile setup)
// TODO: Page Title lookup here

const Navbar: FC<NavbarProps> = async ({ pageTitle, toggleSidebar, ...props }) => {
    const isTitleString = typeof pageTitle === 'string';
    const { data: profile } = await getUserProfile();
    if (!profile) return null;

    return (
        <nav data-testid="navbar" className="sticky top-0 border-b" {...props}>
            <section className="p-4 py-1 flex justify-between items-center">
                <section className="flex items-center gap-2">
                    <button onClick={toggleSidebar}>
                        <PanelLeftClose size={22} />
                    </button>
                    {isTitleString ? (
                        <h1 className="text-base font-medium select-none">{pageTitle}</h1>
                    ) : (
                        <span>{pageTitle}</span>
                    )}
                </section>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <Feedback />
                    <NavbarMenu profile={profile} />
                </div>
            </section>
        </nav>
    )
}

export { Navbar };
