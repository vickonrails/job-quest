
import { type FC, type HTMLAttributes } from 'react'
import { cn } from '../utils'
import { cva } from 'class-variance-authority'
import { Info } from 'lucide-react'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface BannerProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'error' | 'success' | 'info'
}

const bannerVariants = cva(
    'text-left border text-primary-dark px-3 py-2 rounded-lg block mb-5',
    {
        variants: {
            variant: {
                error: 'bg-red-50 border-red-200 text-red-800',
                success: 'bg-green-50 border-green-200 text-green-800',
                info: 'bg-blue-100 border-blue-200 text-blue-800',
            }
        }
    }
)

// TODO: add accessibility support
export const Banner: FC<BannerProps> = ({ children, className, variant = 'info', ...rest }) => {
    return (
        <span className={
            cn(
                bannerVariants({ variant }),
                className
            )
        } {...rest}>
            <BannerIcon variant={variant} />
            {children}
        </span >
    )
}

function BannerIcon({ variant }: { variant: BannerProps['variant'] }) {
    switch (variant) {
        case 'error':
            return <AlertTriangle size={20} />

        case 'success':
            return <CheckCircle size={20} />

        case 'info':
        default:
            return <Info size={20} />
    }
}
