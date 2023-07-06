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
            return 'tw-py-0.5 tw-text-sm'

        case 'sm':
            return 'tw-py-1.5 tw-text-sm'

        case 'lg':
            return 'tw-py-3.5'

        case 'md':
        default:
            return 'tw-py-2.5'
    }
}
