import hashColors from '@utils/hash-colors'
import { cva } from 'class-variance-authority'
import Image, { type ImageProps } from 'next/image'
import { type HTMLAttributes } from 'react'
import { cn } from 'shared'

type IAvatarBorder = 'curved' | 'round' | 'square'
interface AvatarProps extends Omit<ImageProps, 'src'> {
    border?: IAvatarBorder
    size?: 'xs' | 'sm' | 'md' | 'lg'
    src?: string
    fallbackText?: string
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

export const Avatar = ({ border = 'round', src, size = 'md', alt, className, fallbackText, ...rest }: AvatarProps) => {
    if (!src) return (
        <AvatarFallback
            size={size}
            border={border}
            text={fallbackText ?? ''}
        />
    );

    return (
        <Image
            src={src}
            objectFit="cover"
            height={40}
            width={40}
            className={cn(
                avatarVariants({ border, size }),
                className
            )}
            alt={alt ?? ''}
            {...rest}
        />
    )
}

/** -------------------------- Avatar Fallback ------------------------ */
interface AvatarFallbackProps extends HTMLAttributes<HTMLDivElement> {
    size?: AvatarProps['size']
    border: AvatarProps['border']
    text: string
}

function AvatarFallback({ size, className, border = 'round', text }: AvatarFallbackProps) {
    const variantColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500']
    return (
        <div className={cn(avatarVariants({ size, border }), 'text-white', hashColors(text, variantColors), className)}>
            <div
                className={cn('flex items-center justify-center h-full w-full uppercase', size === 'sm' && 'text-xs')}
            >
                {getDisplayText(text)}
            </div>
        </div>
    )
}

/**
 * returns an Avatar display text from a given string
 * @param text text to get display text from
 * @returns a split text
 */

function getDisplayText(text: string) {
    if (text.split(' ').length > 1) {
        return text.split(' ').map(word => word[0]).join('')
    }

    return text.slice(0, 2)
}

// TODO: support for image url fallback