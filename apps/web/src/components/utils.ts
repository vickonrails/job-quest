/** type for size (input|buttons) */
export type Size = 'xs' | 'sm' | 'md' | 'lg';

/**
 * 
 * @param size - desired size
 * @returns - tailwindcss class for the desired size
 */

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

export function getSize(size: Size) {
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


export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = months[date.getMonth()] as string;
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
}


export function djb2Hash(str: string, arrayLength: number) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash) % arrayLength;
}