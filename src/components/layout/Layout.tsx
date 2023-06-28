import { Avatar } from '@components/avatar';
import { Input } from '@components/input';
import React, { type FC, type HTMLAttributes, useCallback } from 'react'
import { Sidebar } from './Sidebar';

import { useRouter } from 'next/router'
import { type Session } from '@supabase/auth-helpers-react'

interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session: Session | null
}

export const Layout: FC<LayoutProps> = ({ children, session, ...rest }) => {
    const router = useRouter();

    return (
        <div className='flex min-h-screen' {...rest}>
            <Sidebar className='basis-64' />
            <main className='bg-indigo-50 flex-1 p-6 pr-10'>
                <Navbar session={session} />
                <div className='mt-10'>
                    {children}
                </div>
            </main>
        </div>
    )
}

interface NavbarProps extends HTMLAttributes<HTMLElement> {
    session: Session | null
}

const Navbar: FC<NavbarProps> = ({ session, ...props }) => {
    return (
        <nav className='flex justify-between' {...props}>
            <Input placeholder='Search' size='sm' />
            <section className='flex'>
                <div className='flex items-center overflow-hidden w-48'>
                    <Avatar border='round' className='mr-3' src='https://avatars.githubusercontent.com/u/24235881?v=4' alt="Victor Ofoegbu" />
                    <div className='truncate'>
                        <p className='truncate'>Victor Ofoegbu</p>
                        <p className='truncate text-gray-400 text-sm'>{session?.user.email}</p>
                    </div>
                </div>
            </section>
        </nav>
    )
}