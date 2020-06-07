import { RefObject } from 'react';
import { HNItem } from '../../api/HNApiTypes';
import DOMPurify from 'dompurify';

export const topOfElIsVisible = (el: RefObject<HTMLElement>, buffer = 0) => {
  const top = el.current?.getBoundingClientRect().top;
  if (top === undefined) return false;
  return top < buffer;
};

export const hNItemLink = (id: number) =>
  `https://news.ycombinator.com/item?id=${id}`;

export const setDocumentTitleWithData = (data: HNItem) => {
  if (data.title) {
    document.getElementsByTagName('title')[0].innerHTML = `${DOMPurify.sanitize(
      data.title
    )} | Dapper`;
  } else if (data.text) {
    const div = document.createElement('div');
    div.innerHTML = DOMPurify.sanitize(data.text);
    let title = div.textContent;

    if (title && title?.length > 90) {
      document.title = `${title.substring(0, 90)}... | Dapper`;
    } else {
      document.title = `${title} | Dapper`;
    }
  }
};

/**
 * ONLY FOR DEVELOPMENT USE
 * @param ms time to "sleep" (wait) in milliseconds
 *
 * usage: await sleep()
 */
export const sleep = async (ms: number = 1000) => {
  await new Promise(r => setTimeout(r, ms));
};
