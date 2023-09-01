import { Avatar } from '@components/avatar';
import { Input } from '@components/input';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Session } from '@supabase/supabase-js';
import { type Database } from 'lib/database.types';
import { type Profile } from 'lib/types';
import { useRouter } from 'next/router';
import { useCallback, type FC, type HTMLAttributes } from 'react';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    profile: Profile
    session: Session
}

const Navbar: FC<NavbarProps> = ({ profile, session, ...props }) => {
    const router = useRouter();
    const client = useSupabaseClient<Database>();

    const handleLogout = useCallback(() => {
        client.auth.signOut().then(async _ => {
            // await queryClient.invalidateQueries({
            //     queryKey: ['auth']
            // })
            return router.push('/sign-in');
        }).catch(err => {
            // console.log(err)
        });
    }, [client.auth, router])

    return (
        <nav data-testid="navbar" className="flex justify-between" {...props}>
            <Input placeholder="Search" size="sm" />
            <section className="flex">
                <button className="mr-4 text-sm" onClick={handleLogout}>Log Out</button>
                <div className="flex items-center overflow-hidden w-48">
                    <Avatar border="round" className="mr-3" src="https://avatars.githubusercontent.com/u/24235881?v=4" alt="Victor Ofoegbu" />
                    <div className="truncate">
                        <p className="truncate">{profile?.username}</p>
                        <p className="truncate text-gray-400 text-sm">{session.user.email}</p>
                    </div>
                </div>
            </section>
        </nav>
    )
}

export { Navbar }