import React from 'react'
import { type FC, type HTMLAttributes } from 'react'
import { cn } from 'shared'
import { Logo } from './logo'

type AuthCardProps = HTMLAttributes<HTMLElement> & {
    onLogoClick?: () => void
}

// TODO: move to components
/**
 * wrapper card around authentication pages
 */
export const AuthCard: FC<AuthCardProps> = ({ children, onLogoClick, className, ...rest }) => {
    return (
        <main className={cn('flex min-h-screen items-start flex-col px-4')}>
            <Logo className="py-4" onClick={onLogoClick}/>
            <div
                className={cn('rounded-lg p-4 w-full mt-20 py-10 md:flex md:mx-auto md:shadow-crispy max-w-xl m-auto relative border', className)}
                {...rest}
            >
                {children}
            </div>
        </main>
    );
}