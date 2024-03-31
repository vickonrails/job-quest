export type Size = 'xs' | 'sm' | 'md' | 'lg';

export function getSize(size: Size) {
    switch (size) {
        case 'xs':
            return 'text-sm p-3 py-2'

        case 'sm':
            return 'py-1.5 text-sm px-2.5'

        case 'lg':
            return 'py-3.5 px-4 text-base'

        case 'md':
        default:
            return 'p-3 text-sm'
    }
}