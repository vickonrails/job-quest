import { formatDate } from '@components/utils';

/**
 * render the date depending on the available start & end dates
 */
export function DateRenderer({ startDate, endDate }: { startDate: string, endDate?: string }) {
    if (!startDate) return;
    const formattedStartDate = formatDate(startDate);

    if (!endDate) {
        return `- ${formattedStartDate}`
    }
    const formattedEndDate = formatDate(endDate);

    const experienceDate = startDate === '' ? '' : `${formattedStartDate} - ${formattedEndDate}`;

    return ` - (${experienceDate})`;
}