'use client';

import React from 'react'
import PlausibleProvider from 'next-plausible'
import { env } from '@/env.mjs';

export default function Plausible({ children }: { children: React.ReactNode }) {
    return (
        <PlausibleProvider domain={env.NEXT_PUBLIC_SITE_URL}>
            {children}
        </PlausibleProvider>
    )
}
