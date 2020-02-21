import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

interface HNItem {
  title?: string;
  text?: string;
  descendants?: number;
  kids?: number[],
  parent?: number,
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  url?: string;
  deleted?: boolean;
  by?: string; // required?
}

export const ItemPage = ({ id, selectComment }: { id: string, selectComment: any }) => (
  <div className="mx-auto item--container">
    <Item id={id} selectComment={selectComment} />
  </div>
);

const Item = ({ id, level = 1, selectComment }: { id: string, level?: 0 | 1 | 2 | 3 | 4 | 5, selectComment?: any }) => {
  const [data, setData] = useState<HNItem>({
    // title: 'This is the placeholder story with appr length',
    text: 'asdfjkajsdfkljsadfkljasdklfjasdklfjaskldfjaklsdfjlsadfjalksdfjklasdfjkladsfjklsadjflkasdjfklasdjfklasdjflkasjdfkljsdfkljasdklfjaskldfjalsdkfjl',
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
        setData(data);
        if (data.deleted) setIsOpen(false);
      })
    }

    getItem();
  }, [id]);

  const containerEl = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);

    // containerEl.current?.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start'
    // });

    if (containerEl.current) {
      const top = containerEl.current.getBoundingClientRect().top;
      if (top < 0) { // user is collapsing an item that is above the screen
        window.scrollTo({ top: containerEl.current.offsetTop - 10, behavior: 'smooth' });
      }
    }
  }

  const levelCollorIndicators = {
    // 0: 'gray',
    1: 'red',
    2: 'blue',
    3: 'gray',
    4: 'red',
    5: 'green'
  }

  const hnDirectLink = `https://news.ycombinator.com/item?id=${id}`;

  const topLevel = level === 0;

  if (data.title || topLevel) {
    return (
      <div>

      <div className="clickable" onClick={() => selectComment(null)}>
        back
      </div>

        <a className="py-3 px-3" style={{display: 'block'}} href={data.url || '#'}>
          {data.title}
        </a>

        <a className="pb-1 px-3 text-muted small" style={{display: 'block'}} href={hnDirectLink}>
          View on HN &#8599;
        </a>

          {/* <div>
            <a className="text-muted small" href={hnDirectLink}> View on HN &#8599; </a>
          </div> */}

        {
          data.title &&
          //@ts-ignore
          (level < 5) && data.kids?.map(itemId => <Item id={itemId} level={level + 1} />)
        }
      </div>
    );
  }

  const showingChildren = data.kids?.length && level < 5;

  const collapsedClassName = isOpen ? '' : 'collapsed';

  //@ts-ignore
  const levelBorderIndicator = level > 2 ? `level-indicator-${levelCollorIndicators[level]}` : '';
  return (
    <div
      ref={containerEl}
      className={`py-0 ${!data.title && level > 2 && 'ml-1'} pr-0 item--border ${collapsedClassName} ${levelBorderIndicator}`}
      onClick={toggle}
    >
      <div className={`${!data.title && level > 2 &&  'pl-3'}`}>
      {data.by && <div className="text-muted small py-1">
        {data.by}/ {level} <span className="float-right">{isOpen ? String.fromCharCode(8593) : String.fromCharCode(8595)} </span>
      </div>}

      <Collapse isOpen={isOpen}>
        {data.deleted && <div>[deleted]</div>}

        <div
          className={`${(isLoading && 'loading-skeleton') || ''} ${showingChildren ? 'item--border= ' : ''} pb-2 px-2`}
          style={{wordBreak: 'break-word'}}
          dangerouslySetInnerHTML={{ '__html' : DOMPurify.sanitize(data.text || '')}}
          // onClick={e => e.preventDefault()}
        >
        </div>

        {(level > 4 && data.kids?.length) && <a href={`/${id}`}>see children &gt;&gt;</a>}

        {(level < 5) && data.kids?.map(itemId => (
          //@ts-ignore
          <Item id={itemId} level={level + 1} />
        ))}
      </Collapse>
      </div>
    </div>
  );
}

export default Item;
