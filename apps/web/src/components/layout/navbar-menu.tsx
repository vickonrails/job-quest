import { Avatar } from '@components/avatar';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Profile } from 'lib/types';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Button } from 'ui';

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
                trigger={(
                    <Button variant="ghost" className="border flex items-center rounded-3xl gap-2 p-2 py-1">
                        <Avatar src="https://avatars.githubusercontent.com/u/24235881?v=4" alt="" size="sm" />
                        {profile?.full_name}
                        <ChevronDown />
                    </Button>
                )}
            >
                <MenuItem className="py-2" icon={<User size={20} />} onClick={() => router.push('/profile/setup')}>
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