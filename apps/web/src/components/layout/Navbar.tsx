import { Avatar } from '@components/avatar';
import { Input } from '@components/input';
import { type Profile } from 'lib/types';
import { type FC, type HTMLAttributes } from 'react';
import { useAuth } from 'src/hooks/useAuth';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    profile?: Profile
}

const Navbar: FC<NavbarProps> = ({ profile, ...props }) => {
    const { data: user } = useAuth()
    return (
        <nav data-testid="navbar" className="flex justify-between" {...props}>
            <Input placeholder="Search" size="sm" />
            <section className="flex">
                <div className="flex items-center overflow-hidden w-48">
                    <Avatar border="round" className="mr-3" src="https://avatars.githubusercontent.com/u/24235881?v=4" alt="Victor Ofoegbu" />
                    <div className="truncate">
                        <p className="truncate">{profile?.username}</p>
                        <p className="truncate text-gray-400 text-sm">{user?.user.email}</p>
                    </div>
                </div>
            </section>
        </nav>
    )
}

export { Navbar }