import React, { type FC, type HTMLAttributes } from 'react'
import { Sidebar } from './Sidebar';

import { Navbar } from './Navbar';
import { type Profile } from '../../../lib/types';
import clsx from 'clsx';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    profile?: Profile
    containerClasses?: string
}

export const Layout: FC<LayoutProps> = ({ children, className, containerClasses, profile, ...rest }) => {
    return (
        <div className={clsx('flex h-full', className)} {...rest}>
            <Sidebar className="basis-64" />
            <main className="bg-indigo-50 flex-1 p-6 flex flex-col overflow-auto">
                <Navbar profile={profile} />
                {/* TODO: make this element fill the vertical space */}
                {/*TODO: fix issue that makes layout overflow out of main on mac */}
                <div className={clsx('flex-1', containerClasses)}>
                    {children}
                </div>
            </main>
        </div>
    )
}

