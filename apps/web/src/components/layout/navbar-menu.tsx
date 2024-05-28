'use client'

import { type Profile } from 'lib/types';
import { AvatarMenu } from './avatar-menu';

export function NavbarMenu({ profile }: { profile?: Profile | null }) {
    return (
        <section className="flex items-center">
            <AvatarMenu profile={profile} />
        </section>
    )
}