/** type for size (input|buttons) */
export type Size = 'xs' | 'sm' | 'md' | 'lg';

/**
 * 
 * @param size - desired size
 * @returns - tailwindcss class for the desired size
 */

export const getSize = (size: Size) => {
    switch (size) {
        case 'xs':
            return 'py-0.5 text-sm'

        case 'sm':
            return 'py-1.5 text-sm'

        case 'lg':
            return 'py-3.5 text-lg'

        case 'md':
        default:
            return 'py-2.5 text-base'
    }
}
