
import { Logo } from '@components/logo'
import { type FC, type HTMLAttributes } from 'react'

type AuthCardProps = HTMLAttributes<HTMLElement>

// TODO: move to components
/**
 * wrapper card around authentication pages
 */
export const AuthCard: FC<AuthCardProps> = ({ children, ...rest }) => {
    return (
        <main className="flex min-h-screen items-start flex-col">
            <Logo className="p-5" />
            <div
                className="rounded-lg p-4 w-full m-4 mt-20 py-10 max-w-md md:max-w-lg md:flex md:mx-auto md:shadow-crispy xl:max-w-xl xl:m-auto relative"
                {...rest}
            >
                {children}
            </div>
        </main>
    )
}