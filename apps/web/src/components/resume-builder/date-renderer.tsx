import { formatDate } from 'shared';

/**
 * render the date depending on the available start & end dates
 */
export function DateRenderer({ startDate, endDate }: { startDate?: string | null, endDate?: string }) {
    if (!startDate) return null;
    const formattedStartDate = formatDate(startDate, true);

    if (!endDate) {
        return `- ${formattedStartDate}`
    }
    const formattedEndDate = formatDate(endDate, true);

    const experienceDate = startDate === '' ? '' : `${formattedStartDate} - ${formattedEndDate}`;

    return ` - (${experienceDate})`;
}