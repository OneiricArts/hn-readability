import { RefObject } from 'react';

export const topOfElIsVisible = (el: RefObject<HTMLElement>, buffer = 0) => {
  const top = el.current?.getBoundingClientRect().top;
  if (top === undefined) return false;
  return top < buffer;
};

export const hNItemLink = (id: number) =>
  `https://news.ycombinator.com/item?id=${id}`;
