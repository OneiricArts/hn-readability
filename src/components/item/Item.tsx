import React, { useEffect, useState, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { HNItem } from '../../api/HNApiTypes';
import { elipsify, hNItemLink } from './helpers';
import getItemFromApi, { IGetItemFromApi } from '../../api/getItemFromApi';
import { ItemCard } from './ItemCard';
import { CommentRefContext } from './ItemPage';
import { Helmet } from 'react-helmet';
import { decode } from 'he';

interface ItemProps {
  id: number;
  level?: number;
  getItem?: IGetItemFromApi;
}

export const Item = ({
  id,
  level = 0,
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

  const { addTopLevelCommentRef } = useContext(CommentRefContext);
  const containerEl = useRef<HTMLDivElement>(null);
  if (level === 1) addTopLevelCommentRef(containerEl);

  if (level === 0) console.log(data.title);

  return (
    <>
      {/* TODO remove !isLoading when placeholder data no longer needed */}
      {!isLoading && level === 0 && (
        <Helmet titleTemplate="%s | Dapper">
          <title>
            {decode(data.title || (data.text && elipsify(data.text, 90)) || '')}
          </title>
        </Helmet>
      )}

      <ItemCard
        containerEl={containerEl}
        data={data}
        level={level}
        isLoading={isLoading}
        kids={data.kids?.map(itemId => (
          <Item id={itemId} key={itemId} level={level + 1} />
        ))}
      />
    </>
  );
};
