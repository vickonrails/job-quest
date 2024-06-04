/**
 * Convert date to UTC to get rid of daylight & other date inconsistencies
 * 
 * @param date 
 * @returns date
 */
export function formatToUTC(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}