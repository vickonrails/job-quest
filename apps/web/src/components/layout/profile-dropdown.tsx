'use client'

import { signOut } from '@/actions/sign-out';
import { type User } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { ChevronUp, LogOut, Palette, Trash, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from 'ui/dropdown-menu';
import { Avatar } from '../avatar';
import { ThemeSwitcher } from '../theme-switcher';

// TODO: consider accessiblity fo allow for navigating around through this component with the keyboard
export function ProfileDropdown({ profile, user }: { profile: Profile, user: User }) {
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full justify-between text-muted-foreground hover:text-accent-foreground flex rounded-md hover:bg-muted cursor-default gap-3 px-3 py-2 items-center">
                    <span className="flex gap-2 items-center">
                        <Avatar border="curved" src={profile.avatar_url ?? ''} fallbackText={profile.full_name ?? ''} alt="" />
                        <span className="flex flex-col items-start">
                            <span className="text-sm font-medium">{profile.full_name?.split(' ')[0]}</span>
                            <span className="text-xs text-muted-foreground">victor@gmail.com</span>
                        </span>
                    </span>
                    <ChevronUp size={18} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={6} side="top" className="w-52">
                <DropdownMenuItem className="flex flex-row justify-between items-center gap-2" onClick={(ev) => ev.preventDefault()}>
                    <div className="flex items-center gap-2">
                        <Palette size={16} />
                        Theme
                    </div>
                    <ThemeSwitcher />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-row items-center gap-2" onClick={() => router.push('/profile/setup')}>
                    <UserIcon size={16} />
                    Update Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-row items-center gap-2" onClick={() => signOut()}>
                    <LogOut size={16} />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}