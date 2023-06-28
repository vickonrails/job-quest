import React, { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'

type LogoProps = HTMLAttributes<HTMLElement>;

const Logo: FC<LogoProps> = ({ className, ...rest }) => {
    return (
        <h1 className={
            clsx(
                'text-primary text-xl font-medium',
                className
            )
        }>JobQuest</h1>
    )
}

export default Logo