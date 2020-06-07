import React, { useEffect, useState, useRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { HNItem } from '../../api/HNApiTypes';
import { hNItemLink } from './helpers';
import getItemFromApi, { IGetItemFromApi } from '../../api/getItemFromApi';
import { ItemCard } from './ItemCard';

interface ItemProps {
  id: number;
  level?: number;
  addTopLevelCommentRef: (r: RefObject<HTMLElement>) => void;
  getItem?: IGetItemFromApi;
}

export const Item = ({
  id,
  level = 0,
  addTopLevelCommentRef,
  getItem = getItemFromApi
}: ItemProps) => {
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
    async function getItemAsync() {
      const data = await getItem(id);

      if (data && level === 0) {
        if (data.title) {
          document.getElementsByTagName(
            'title'
          )[0].innerHTML = `${DOMPurify.sanitize(data.title)} | Dapper`;
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
      }

      ReactDOM.unstable_batchedUpdates(() => {
        setIsLoading(false);

        setData(
          data || {
            id,
            text: `API error :( <a href="${hNItemLink(id)}">view on hn</a>`,
            error: true
          }
        );
      });
    }

    getItemAsync();
  }, [id, level, getItem]);

  const containerEl = useRef<HTMLDivElement>(null);
  if (level === 1) addTopLevelCommentRef(containerEl);

  return (
    <ItemCard
      containerEl={containerEl}
      data={data}
      level={level}
      isLoading={isLoading}
      kids={data.kids?.map(itemId => (
        <Item
          id={itemId}
          key={itemId}
          level={level + 1}
          addTopLevelCommentRef={addTopLevelCommentRef}
        />
      ))}
    />
  );
};
