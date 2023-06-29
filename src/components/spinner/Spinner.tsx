import React, { type FC, type HTMLAttributes } from 'react'
import classes from './spinner.module.css'
import clsx from 'clsx'

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary';
}

const Spinner: FC<SpinnerProps> = ({ variant = 'primary', ...rest }) => {
    return (
        <span data-testid='spinner' className={clsx(
            classes.spinner,
            variant === 'secondary' && classes.secondary,
        )} {...rest} />
    )
}

export default Spinner