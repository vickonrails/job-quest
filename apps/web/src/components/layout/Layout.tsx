import React, { type FC, type HTMLAttributes, useEffect } from 'react'
import { Sidebar } from './Sidebar';

import { type Session } from '@supabase/auth-helpers-react'
import { Navbar } from './Navbar';
import { type Profile } from '../../../lib/types';
import clsx from 'clsx';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session?: Session
    profile?: Profile
    containerClasses?: string
}

export const Layout: FC<LayoutProps> = ({ children, className, containerClasses, profile, session, ...rest }) => {
    return (
        <div className={clsx('flex h-full', className)} {...rest}>
            <Sidebar className="basis-64" />
            <main className="bg-indigo-50 flex-1 p-6 flex flex-col overflow-auto">
                <Navbar session={session} profile={profile} />
                {/* TODO: make this element fill the vertical space */}
                {/*TODO: fix issue that makes layout overflow out of main on mac */}
                <div className={clsx('flex-1', containerClasses)}>
                    {children}
                </div>
            </main>
        </div>
    )
}

