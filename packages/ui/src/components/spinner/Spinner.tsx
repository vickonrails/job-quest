import { type FC, type HTMLAttributes } from 'react'
import classes from './spinner.module.css'
import clsx from 'clsx'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary';
}

/** Loading component for application */
const Spinner: FC<SpinnerProps> = ({ variant = 'primary', ...rest }) => {
    return (
        <>Loading...</>
    );

    return (
        <span data-testid='spinner' className={clsx(
            classes.spinner,
            variant === 'secondary' && classes.secondary,
        )} {...rest} />
    )
}

export { Spinner }