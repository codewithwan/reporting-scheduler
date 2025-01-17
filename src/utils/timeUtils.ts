import { format, toZonedTime } from 'date-fns-tz';

const DEFAULT_TIMEZONE = 'Asia/Jakarta';

/**
 * Mengonversi waktu UTC ke timezone tertentu.
 * @param {Date|string} date - Waktu yang akan dikonversi.
 * @param {string} timezone - Timezone tujuan. Default: Asia/Jakarta.
 * @returns {string} Waktu yang sudah dikonversi dalam format lokal.
 */
export const convertToTimezone = (date: Date | string, timezone: string = DEFAULT_TIMEZONE): string => {
  const zonedTime = toZonedTime(new Date(date), timezone);
  return format(zonedTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: timezone });
};

/**
 * Mendapatkan waktu sekarang di timezone tertentu.
 * @param {string} timezone - Timezone tujuan. Default: Asia/Jakarta.
 * @returns {string} Waktu sekarang dalam format lokal.
 */
export const getCurrentTimeInTimezone = (timezone = DEFAULT_TIMEZONE) => {
  const now = new Date();
  return convertToTimezone(now, timezone);
};
