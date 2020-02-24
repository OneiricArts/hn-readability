import React, { useEffect, useState, useRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { Collapse } from 'reactstrap';

// https://github.com/HackerNews/API#items
interface HNItem {
  id: number;
  deleted?: boolean;
  type?: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by?: string;
  time?: number; // UNIX time
  text?: string; // HTML
  dead?: boolean; // true if the item is dead.
  parent?: number;
  poll?: number; // a pollopt's poll
  kids?: number[]; // in ranked display order
  url?: string;
  score?: number;
  title?: string; // The title of the story, poll or job. HTML.
  parts?: number[]; // the pollopts of a poll
  descendants?: number;
}

const LinkToHN = ({ id }: { id: number }) => (
  <a
    className="btn btn-sm btn-outline-dark py-0 px-1"
    role="button"
    href={`https://news.ycombinator.com/item?id=${id}`}
  >
    @ HN
  </a>
);

const Item = ({ id, level = 0 }: { id: number, level?: number }) => {
  const [data, setData] = useState<HNItem>({
    id: id,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: 'Lorem ipsum dolor sit amet',
    descendants: 55,
    url: '',
    type: 'comment'
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const data = await response.json();

      ReactDOM.unstable_batchedUpdates(() => {
        setIsLoading(false);
        /**
         * Sometimes HN returns null for an item, need this so entire page doesn't break
         * TODO error boundry?
         * comment page for: https://news.ycombinator.com/item?id=22359574
         * - https://hacker-news.firebaseio.com/v0/item/22360822.json returns null
         * - https://news.ycombinator.com/item?id=22360822 shows a valid comment
         * (┛ಠ_ಠ)┛彡┻━┻
         */
        setData(data || {
          text: `API error :( <a href="https://news.ycombinator.com/item?id=${id}">view on hn</a>`,
          type: 'comment'
        });
      })
    }

    getItem();
  }, [id]);

  const topOfElIsVisible = (el: RefObject<HTMLElement>) => {
    const top = el.current?.getBoundingClientRect().top;
    if (top === undefined) return false;
    return top < 0;
  }

  const containerEl = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (level === 0) return;

    e.stopPropagation();
    setIsOpen(!isOpen);

    if (containerEl?.current && topOfElIsVisible(containerEl))
      window.scrollTo({ top: containerEl.current.offsetTop - 10, behavior: 'smooth' });
  };

  const levelToColorMap = {
    0: 'orange',
    1: 'red',
    2: 'blue',
    3: 'gray',
    4: 'purple',
    5: 'green'
  }

  // @ts-ignore
  const levelBorderColor = () => `level-border-${levelToColorMap[level % 5]}`;

  const isLoadingClassName = isLoading ? 'loading-skeleton' : '';
  const commentCss = level > 1 ? `${levelBorderColor()} ml-3` : '';
  const topLevel = level === 0;

  return (
    <div ref={containerEl} className={`${commentCss} ${level > 0 ? 'border-top' : ''} px-0 `} onClick={toggle}>
      <div className={`${isLoadingClassName} text-muted small py-1 px-2`}>
        {data.by || '[deleted]'} {/* TODO: Verify what it means if this is empty */}
        {!topLevel && <span className="float-right">
          {isOpen ? String.fromCharCode(8593) : String.fromCharCode(8595)}
        </span>}
      </div>

      <Collapse isOpen={isOpen}>
        <div className={`${isLoadingClassName} py-1 px-2`} style={{ wordBreak: 'break-word' }}>
          {data.deleted && '[deleted]'}
          {data.title && <h4>{data.title}</h4>}
          {data.type === 'poll' && <p>Polls are not supported yet!</p>}
          <div className="item--hn-text" dangerouslySetInnerHTML={{ '__html': DOMPurify.sanitize(data.text || '') }} />
        </div>
        {topLevel && <div className="p-2 gray-background border-top"><LinkToHN id={id} /></div>}
        {data.kids?.map(itemId => <Item id={itemId} key={itemId} level={level + 1} />)}
      </Collapse>
    </div>
  );
}

export default Item;
