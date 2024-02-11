
import { type FC, type HTMLAttributes } from 'react'
import { cn } from '../../utils'
import { Logo } from '../logo'

type AuthCardProps = HTMLAttributes<HTMLElement>

// TODO: move to components
/**
 * wrapper card around authentication pages
 */
export const AuthCard: FC<AuthCardProps> = ({ children, className, ...rest }) => {
    return (
        <main className={cn("flex min-h-screen items-start flex-col bg-gray-50", className)}>
            <Logo className="p-5" />
            <div
                className="rounded-lg p-4 w-full m-4 mt-20 py-10 md:flex md:mx-auto md:shadow-crispy xl:max-w-xl xl:m-auto relative border bg-white"
                {...rest}
            >
                {children}
            </div>
        </main>
    )
}