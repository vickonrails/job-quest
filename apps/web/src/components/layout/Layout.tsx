import React, { useState, type FC, type HTMLAttributes, useEffect } from 'react'
import { Sidebar } from './Sidebar';

import { type Session } from '@supabase/auth-helpers-react'
import { Navbar } from './Navbar';
import { type Profile } from '../../../lib/types';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session?: Session
    profile?: Profile
}

export const Layout: FC<LayoutProps> = ({ children, profile, session, ...rest }) => {
    return (
        <div className="flex h-full" {...rest}>
            <Sidebar className="basis-64" />
            <main className="bg-indigo-50 flex-1 p-6 pr-10">
                <Navbar session={session} profile={profile} />
                <div className="mt-7">
                    {children}
                </div>
            </main>
        </div>
    )
}

