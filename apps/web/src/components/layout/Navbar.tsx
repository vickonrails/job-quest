
import { Avatar, Input } from 'ui';
import { type Session } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { type FC, type HTMLAttributes } from 'react';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    session?: Session
    profile?: Profile
}

const Navbar: FC<NavbarProps> = ({ session, profile, ...props }) => {
    return (
        <nav data-testid="navbar" className="flex justify-between" {...props}>
            <Input placeholder="Search" size="sm" />
            <section className="flex">
                <div className="flex items-center overflow-hidden w-48">
                    <Avatar border="round" className="mr-3" src="https://avatars.githubusercontent.com/u/24235881?v=4" alt="Victor Ofoegbu" />
                    <div className="truncate">
                        <p className="truncate">{profile?.username}</p>
                        <p className="truncate text-gray-400 text-sm">{session?.user.email}</p>
                    </div>
                </div>
            </section>
        </nav>
    )
}

export { Navbar }