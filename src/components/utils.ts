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
            return 'py-0.5'

        case 'sm':
            return 'py-1.5'

        case 'lg':
            return 'py-3.5'

        case 'md':
        default:
            return 'py-2.5'
    }
}
