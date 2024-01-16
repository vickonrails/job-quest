import { type Session } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { type FC, type HTMLAttributes } from 'react';
import { Input } from 'ui';
import { NavbarMenu } from './navbar-menu';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    profile: Profile
    session: Session
}

const Navbar: FC<NavbarProps> = ({ profile, ...props }) => {
    return (
        <nav data-testid="navbar" className="flex justify-between mb-4" {...props}>
            {/* TODO: remove this search bar as it's not really needed here */}
            <Input placeholder="Search" size="sm" />
            <NavbarMenu profile={profile} />
        </nav>
    )
}



export { Navbar };
