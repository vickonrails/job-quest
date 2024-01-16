import { cn } from '@utils/cn'
import { cva } from 'class-variance-authority'
import Image, { type ImageProps } from 'next/image'

type IAvatarBorder = 'curved' | 'round' | 'square'
interface AvatarProps extends Omit<ImageProps, 'src'> {
    border?: IAvatarBorder
    size?: 'xs' | 'sm' | 'md' | 'lg'
    src?: string
}

const avatarVariants = cva('', {
    variants: {
        size: {
            xs: 'h-6 w-6',
            sm: 'h-8 w-8',
            md: 'h-9 w-9',
            lg: 'h-12 w-12'
        },
        border: {
            curved: 'rounded-lg',
            round: 'rounded-full',
            square: 'rounded-none'
        }
    }
});

export const Avatar = ({ border = 'round', src, size, alt, className, ...rest }: AvatarProps) => {
    // TODO: fallback to placeholder
    if (!src) return null;

    return (
        <Image
            src={src}
            objectFit="cover"
            height={40}
            width={40}
            className={cn(
                avatarVariants({ size, border }),
                className
            )}
            alt={alt ?? ''}
            {...rest}
        />
    )
}

// TODO: support for image url fallback