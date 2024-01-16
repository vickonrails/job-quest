import { Avatar } from '@components/avatar';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Profile } from 'lib/types';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function NavbarMenu({ profile }: { profile: Profile }) {
    const client = useSupabaseClient<Database>();
    const router = useRouter()

    const handleLogout = useCallback(() => {
        client.auth.signOut().then(async _ => {
            // 
            return router.push('/sign-in');
        }).catch(() => {
            // 
        });
    }, [client.auth, router])

    return (
        <section className="flex items-center">
            <MenuBar
                contentProps={{ side: 'bottom', align: 'end', className: 'w-lg w-40' }}
                trigger={<NavTrigger profile={profile} />}
            >
                <MenuItem className="py-2" icon={<User size={20} />} onClick={() => router.push('/profile')}>
                    Profile
                </MenuItem>
                <Separator />
                <MenuItem variant="destructive" className="py-2" icon={<LogOut size={20} />} onClick={handleLogout}>
                    Log out
                </MenuItem>
            </MenuBar>
        </section>
    )
}

function NavTrigger({ profile }: { profile: Profile }) {
    return (
        <div className="border flex items-center rounded-3xl p-2 py-1 gap-2 hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100">
            {/* TODO: use real avatar image & provide some fallback */}
            <Avatar src="https://avatars.githubusercontent.com/u/24235881?v=4" alt="" size="sm" />
            <div>
                <p className="text-sm">{profile.full_name}</p>
            </div>
            <ChevronDown />
        </div>
    )
}