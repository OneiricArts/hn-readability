import React, { useEffect, useState, useRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { Collapse, Button } from 'reactstrap';
import Icon from './icons/Icon';

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

const hNItemLink = (id: number) => `https://news.ycombinator.com/item?id=${id}`;

const buttonBarClasses = "d-inline-flex align-items-center h-border-right py-2 px-2";

const topLevelCommentRefs: RefObject<HTMLElement>[] = [];

const topOfElIsVisible = (el: RefObject<HTMLElement>, buffer = 0) => {
  const top = el.current?.getBoundingClientRect().top;
  if (top === undefined) return false;
  return top < buffer;
}

const LinkToHN = ({ id }: { id: number }) => (
  <a className={`${buttonBarClasses}`} role="button" href={hNItemLink(id)}>
    <Icon name="link" size={1.5} />
  </a>
);

const Share = ({ title, url }: { title?: string, url: string }) => {
  //@ts-ignore
  if (!navigator?.share) return null;

  const shareTo = async () => {
    try {
      //@ts-ignore
      await navigator.share({ title, url });
      console.log('shared!')
    } catch (e) {
      if (e.name === 'AbortError') console.log('Share aborted')
      else console.log(e);
    }
  };

  return (
    <div className={`${buttonBarClasses} clickable`} onClick={shareTo}>
      <Icon name="share" size={1.5} />
    </div>
  );
};

const LinkUrlCard = ({ url }: { url: string }) => (
  <a href={url} className="p-1 mb-2 link-card d-flex align-items-center">
    <Icon size={2} color="gray" name="compass" />
    <span className="pl-2 ml-2 pr-2 link-card--text text-truncate" style={{ flex: '1' }}>{url}</span>
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

      if (level === 0) document.title = `${data.title} | Dapper`;

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
          text: `API error :( <a href="${hNItemLink(id)}">view on hn</a>`,
          type: 'comment'
        });
      })
    }

    getItem();
  }, [id]);

  const containerEl = useRef<HTMLDivElement>(null);
  if (level === 1) topLevelCommentRefs.push(containerEl);

  const [isOpen, setIsOpen] = useState(true);
  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (level === 0) return;

    // do not collapse comment if clicking on link inside div (HTML from api)
    const target = e.target as HTMLElement;
    if (target.nodeName === 'A') return;

    e.stopPropagation();
    setIsOpen(!isOpen);

    if (containerEl?.current && topOfElIsVisible(containerEl))
      window.scrollTo({ top: containerEl.current.offsetTop - 10, behavior: 'smooth' });
  };

  const levelToColorMap = {
    2: 'blue',
    3: 'gray',
    4: 'purple',
    5: 'green',
    0: 'orange', // use %, so 0 is last (6th)
    1: 'red' // level 1 does not show any, so this is first used on level 7
  }

  // @ts-ignore
  const levelBorderColor = () => `level-border-${levelToColorMap[level % 6]}`;

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
          {data.url && <LinkUrlCard url={data.url} />}
          {data.type === 'poll' && <p>Polls are not supported yet!</p>}
          <div className="item--hn-text" dangerouslySetInnerHTML={{ '__html': DOMPurify.sanitize(data.text || '') }} />
        </div>
        {
          topLevel &&
          <div className="button-bar-background border-top d-flex align-items-center">
            <LinkToHN id={id} />
            <Share title={data.title} url={hNItemLink(id)} />
          </div>
        }
        {data.kids?.map(itemId => <Item id={itemId} key={itemId} level={level + 1} />)}
      </Collapse>
    </div>
  );
}

const ItemPage = ({ id }: { id: number }) => {
  const goToNextComment = () => {
    const firstCommentWithTopVisible = topLevelCommentRefs.filter(e => !topOfElIsVisible(e, 5))[0];

    if (firstCommentWithTopVisible && firstCommentWithTopVisible?.current) {
      window.scrollTo({ top: firstCommentWithTopVisible.current.offsetTop, behavior: 'smooth' });
    }
  }

  return (
    <>
      <Item id={id} />
      <Button size="lg" color="dark" className="rounded-circle floating-button d-md-none" onClick={goToNextComment}>
        &darr;
      </Button>
      <div className="d-md-none" style={{ paddingBottom: '80px' }}></div>
    </>
  );
};

export default ItemPage;
