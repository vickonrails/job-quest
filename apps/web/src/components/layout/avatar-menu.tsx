import { signOut } from '@/db/api/actions/sign-out.action'
import { type Profile } from 'lib/types'
import { useRouter } from 'next/navigation'
import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from 'ui/dropdown-menu'
import { Avatar } from '../avatar'

export function AvatarMenu({ profile }: { profile?: Profile | null }) {
    const avatarDisplay = profile?.full_name ?? profile?.email_address ?? ''
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <Avatar size="sm" alt={profile?.full_name ?? ''} fallbackText={avatarDisplay} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={15}>
                <DropdownMenuLabel>{profile?.full_name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile/setup')}>Update Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
