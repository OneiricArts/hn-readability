import React from 'react';
import Icon from './icons/Icon';

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary/11832950#11832950
const formatNumber = (num: number, maxNumOfDec = 0) => {
  if (maxNumOfDec < 1) return Math.floor(num);

  return (
    Math.round((num + Number.EPSILON) * (10 * maxNumOfDec)) / (10 * maxNumOfDec)
  );
};

/**
 * @param from milliseconds
 * @param to milliseconds, will default to now
 */
export function timeago(from: number, to = new Date().getTime()) {
  const ellapsedMs = to - from;

  const years = formatNumber(ellapsedMs / 31536000000, 1);
  if (years >= 1) return `${years}y`;

  const months = formatNumber(ellapsedMs / 2592000000);
  if (months >= 1) return `${months}mo`;

  const weeks = formatNumber(ellapsedMs / 604800000);
  if (weeks >= 1) return `${weeks}w`;

  const days = formatNumber(ellapsedMs / 86400000);
  if (days >= 1) return `${days}d`;

  const hours = formatNumber(ellapsedMs / 3600000);
  if (hours >= 1) return `${hours}h`;

  const minutes = formatNumber(ellapsedMs / 60000);
  if (minutes >= 1) return `${minutes}m`;

  // const seconds = formatNumber(ellapsed / 1000);
  // if (seconds) return `${seconds} s`;

  return 'now';
}

/**
 * Takes time from in Unix (seconds) time
 */
export const TimeAgo = ({
  time,
  icon = false
}: {
  time?: number;
  icon?: boolean;
}) => {
  if (!time) return null;

  return (
    <>
      {icon && <Icon name="time" />}
      {timeago(time * 1000)}
    </>
  );
};
