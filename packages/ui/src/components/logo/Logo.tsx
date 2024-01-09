import { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'

type LogoProps = HTMLAttributes<HTMLElement>;

const Logo: FC<LogoProps> = ({ className, ...rest }) => {
    return (
        <h1 className={
            clsx(
                'text-primary text-xl font-medium',
                className
            )
        } {...rest}>JQ</h1>
    )
}

export { Logo }