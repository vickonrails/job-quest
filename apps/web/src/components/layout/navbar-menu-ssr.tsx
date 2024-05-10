'use client'

import { createClient } from '@/utils/supabase/server';
import { type UserResponse } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { ChevronDown, LogOut, User } from 'lucide-react';
import router from 'next/router';
import { Button } from 'ui';
import { Avatar } from '../avatar';
import { MenuBar, MenuItem, Separator } from '../menubar';

async function getUser(): Promise<UserResponse> {
    const client = createClient();
    return await client.auth.getUser()
}

export async function NavbarMenu() {
    const { data: { user } } = await getUser();

    // const handleLogout = useCallback(() => {
    //     client.auth.signOut().then(async _ => {
    //         // 
    //         return router.push('/sign-in');
    //     }).catch(() => {
    //         // 
    //     });
    // }, [client.auth, router])

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
                <MenuItem variant="destructive" className="py-2" icon={<LogOut size={20} />}>
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