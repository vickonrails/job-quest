import { Avatar } from '@components/avatar';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { createClient } from '@lib/supabase/component';
import { type Profile } from 'lib/types';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Button } from 'ui';

export function NavbarMenu({ profile }: { profile: Profile }) {
    const client = createClient();
    const router = useRouter()

    const handleLogout = useCallback(() => {
        client.auth.signOut().then(async _ => {
            // 
            return router.push('/sign-in');
        }).catch(() => {
            // 
        });
    }, [client.auth, router])

    const avatarDisplay = profile.full_name ?? profile.email_address ?? ''

    return (
        <section className="flex items-center">
            <MenuBar
                contentProps={{ side: 'bottom', sideOffset: 10, align: 'end', className: 'w-lg w-40' }}
                trigger={(
                    <Button variant="ghost" className="flex items-center rounded-3xl gap-2 p-2 py-1">
                        <Avatar size="sm" alt={profile.full_name ?? ''} fallbackText={avatarDisplay} />
                        {trimText(avatarDisplay, 10)}
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

function trimText(text: string, length = 2) {
    if (text.length <= length) return text
    return `${text.slice(0, length)}...`
}