import { RefObject } from 'react';
import { HNItem } from '../../api/HNApiTypes';
import DOMPurify from 'dompurify';

export const topOfElIsVisible = (el: RefObject<HTMLElement>, buffer = 0) => {
  const top = el.current?.getBoundingClientRect().top;
  if (top === undefined) return false;
  return top < buffer;
};

export const elipsify = (text: string, maxLen: number) => {
  if (text.length > maxLen) return `${text.substring(0, maxLen)}...`;

  return text;
};

export const hNItemLink = (id: number) =>
  `https://news.ycombinator.com/item?id=${id}`;

/**
 * ONLY FOR DEVELOPMENT USE
 * @param ms time to "sleep" (wait) in milliseconds
 *
 * usage: await sleep()
 */
export const sleep = async (ms: number = 1000) => {
  await new Promise(r => setTimeout(r, ms));
};
