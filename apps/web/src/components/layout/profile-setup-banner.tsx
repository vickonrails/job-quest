'use client'

import { type Profile } from 'lib/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Banner } from 'ui/banner'

export function ProfileSetupBanner({ profile }: { profile: Profile }) {
    const pathname = usePathname()
    const isProfileSetupPage = pathname?.startsWith('/profile')
    if (isProfileSetupPage || profile.is_profile_setup) return;

    return (
        <Banner className="flex absolute top-2 z-50 text-sm mx-auto left-1/2 -translate-x-1/2 shadow-sm">
            <div className="pl-2">
                <p>Your profile needs to be setup to get the most out of job quest. {' '}
                    <Link className="underline font-medium" href="/profile/resume-upload">Setup Now</Link>
                </p>
            </div>
        </Banner>
    )
}