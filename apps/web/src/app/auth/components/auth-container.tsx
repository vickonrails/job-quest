'use client'

import { useRouter } from 'next/navigation'
import React, { type ReactNode } from 'react'
import { AuthCard } from 'ui/auth-card'

export default function AuthContainer({ children }: { children: ReactNode }) {
    const router = useRouter()
    return (
        <AuthCard onLogoClick={() => router.push('/')}>
            {children}
        </AuthCard>
    )
}
