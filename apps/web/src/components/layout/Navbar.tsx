import { type Session } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { NavbarMenu } from './navbar-menu';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    profile: Profile
    session: Session
    pageTitle?: ReactNode
}

const Navbar: FC<NavbarProps> = ({ profile, pageTitle, ...props }) => {
    const isTitleString = pageTitle instanceof String;
    return (
        <nav data-testid="navbar" className="flex justify-between items-center mb-4" {...props}>
            {isTitleString ? (
                <h1 className="text-xl font-medium">{pageTitle}</h1>
            ) : (
                <span>{pageTitle}</span>
            )}
            <NavbarMenu profile={profile} />
        </nav>
    )
}



export { Navbar };
