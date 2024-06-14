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

export function formatDate(dateString?: string | null, short = false) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (date.toString() === 'Invalid Date') return dateString;
    const month = months[date.getMonth()] as string;
    return `${!short ? date.getDate() : ''} ${month}, ${date.getFullYear()}`;
}