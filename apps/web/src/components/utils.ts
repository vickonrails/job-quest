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
            return 'text-sm p-3 py-2'

        case 'sm':
            return 'py-1.5 text-sm px-2.5'

        case 'lg':
            return 'py-3.5 px-4'

        case 'md':
        default:
            return 'py-2.5 px-3.5'
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