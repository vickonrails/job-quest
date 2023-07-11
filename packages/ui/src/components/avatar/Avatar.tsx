import { ImgHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type IAvatarBorder = 'curved' | 'round' | 'square'
interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    border?: IAvatarBorder
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

type IBorderLookup = Record<IAvatarBorder, string>;
const borderLookup: IBorderLookup = {

    /**
     * curved borders - 8px
     */
    curved: 'rounded-lg',

    /**
     * full circle avatar
     */
    round: 'rounded-full',

    /**
     * perfect square avatar
     */
    square: 'rounded-none'
}

export const Avatar = ({ border = 'round', className, size = 'sm', alt, ...rest }: AvatarProps) => {

    // TODO: use appropriate figure component
    return (
        <img
            className={clsx(borderLookup[border], className)}
            width={40}
            height={40}
            title={alt}
            alt={alt}
            {...rest}
        />
    )
}

// TODO: support for image url fallback