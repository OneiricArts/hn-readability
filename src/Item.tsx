import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';

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

const Item = ({ id, level = 0 }: { id: number, level?: number }) => {
  const [data, setData] = useState<HNItem>({
    id: id,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
      })
    }

    getItem();
  }, [id]);

  const isLoadingClassName = isLoading ? 'loading-skeleton' : '';
  const commentCss = level > 1 ? 'level-indicator-gray ml-3' : '';

  return (
    <div className={`${commentCss} ${level > 0 ? 'item--border' : ''} px-0 `}>
      <div className={`${isLoadingClassName} py-1 px-2`} style={{ wordBreak: 'break-word' }}>
        {data.deleted && '[deleted]'}
        {data.title && <h4>{data.title}</h4>}
        {data.type === 'poll' && <p>Polls are not supported yet!</p>}
        <div dangerouslySetInnerHTML={{ '__html': DOMPurify.sanitize(data.text || '') }} />
      </div>
      {data.kids?.map(itemId => <Item id={itemId} key={itemId} level={level + 1} />)}
    </div>
  );
}

export default Item;
