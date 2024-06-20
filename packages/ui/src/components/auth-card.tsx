import React from 'react'
import { type FC, type HTMLAttributes } from 'react'
import { cn } from 'shared'
import { Logo } from './logo'

type AuthCardProps = HTMLAttributes<HTMLElement>

// TODO: move to components
/**
 * wrapper card around authentication pages
 */
export const AuthCard: FC<AuthCardProps> = ({ children, className, ...rest }) => {
    return (
        <main className={cn('flex min-h-screen items-start flex-col')}>
            <Logo className="p-5" />
            <div
                className={cn('rounded-lg p-4 w-full m-4 mt-20 py-10 md:flex md:mx-auto md:shadow-crispy xl:max-w-xl xl:m-auto relative border', className)}
                {...rest}
            >
                {children}
            </div>
        </main>
    );
}