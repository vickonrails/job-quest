import { type FC, type HTMLAttributes } from 'react'
import classes from './spinner.module.css'
import clsx from 'clsx'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary';
}

/** Loading component for application */
const Spinner: FC<SpinnerProps> = ({ variant = 'primary', ...rest }) => {
    return (
        <span data-testid="spinner" className={clsx(
            classes.spinner,
            variant === 'secondary' && classes.secondary,
        )} {...rest} />
    )
}

const FullPageSpinner = () => {
    return (
        <div className="w-full flex h-full items-center flex-col">
            <div>
                <Spinner />
            </div>
        </div>
    )
}

export { Spinner, FullPageSpinner }