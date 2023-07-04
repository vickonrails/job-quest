import { add } from 'ui'

/** type for size (input|buttons) */
export type Size = 'xs' | 'sm' | 'md' | 'lg';

/**
 * 
 * @param size - desired size
 * @returns - tailwindcss class for the desired size
 */

console.log(add(1, 2, 3));

export const getSize = (size: Size) => {
    switch (size) {
        case 'xs':
            return 'py-0.5 text-sm'

        case 'sm':
            return 'py-1.5 text-sm'

        case 'lg':
            return 'py-3.5'

        case 'md':
        default:
            return 'py-2.5'
    }
}
