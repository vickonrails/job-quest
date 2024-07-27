import { type FC, type HTMLAttributes } from 'react';
import { cn } from 'shared';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary';
}

/** Loading component for application */
const Spinner: FC<SpinnerProps> = ({ className, variant = 'primary', ...rest }) => {
    const isPrimary = variant === 'primary'
    return (
        <div
            style={{ transform: 'rotateZ(45deg)', perspective: '1000px' }}
            className={cn('h-8 w-8', className)}
            {...rest}
        >
            <div
                style={{ transform: 'rotateX(70deg)', borderRadius: '50%' }}
                className={cn('block absolute top-0 w-full h-full left-0 text-white animate-rotate-spinner', isPrimary && 'text-primary')}
            />
            <div
                style={{ transform: 'rotateY(70deg)', borderRadius: '50%' }}
                className={cn('block absolute top-0 w-full h-full left-0 text-white animate-rotate-spinner', isPrimary && 'text-primary')}
            />
        </div>
    )
}

const FullPageSpinner = () => {
    return (
        <div className="w-full flex h-full items-center flex-col mt-20">
            <Spinner variant="primary" />
        </div>
    )
}

export { FullPageSpinner, Spinner };
