import { format, toZonedTime } from 'date-fns-tz';

const DEFAULT_TIMEZONE = 'Asia/Jakarta';

/**
 * Converts UTC time to a specified timezone.
 * @param {Date|string} date - The date to be converted.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The target timezone. Default is Asia/Jakarta.
 * @returns {string} The converted time in local format.
 */
export const convertToTimezone = (date: Date | string, timezone: string = DEFAULT_TIMEZONE): string => {
  const zonedTime = toZonedTime(new Date(date), timezone);
  return format(zonedTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: timezone });
};

/**
 * Gets the current time in a specified timezone.
 * @param {string} [timezone=DEFAULT_TIMEZONE] - The target timezone. Default is Asia/Jakarta.
 * @returns {string} The current time in local format.
 */
export const getCurrentTimeInTimezone = (timezone = DEFAULT_TIMEZONE) => {
  const now = new Date();
  return convertToTimezone(now, timezone);
};
