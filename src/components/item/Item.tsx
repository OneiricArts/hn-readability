import React, { useEffect, useState, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { HNItem } from '../../api/HNApiTypes';
import { hNItemLink, setDocumentTitleWithData } from './helpers';
import getItemFromApi, { IGetItemFromApi } from '../../api/getItemFromApi';
import { ItemCard } from './ItemCard';
import { CommentRefContext } from './ItemPage';

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

      if (data && level === 0) setDocumentTitleWithData(data);

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

  const { addTopLevelCommentRef, opContainer } = useContext(CommentRefContext);
  const containerEl = useRef<HTMLDivElement>(null);
  if (level === 1) addTopLevelCommentRef(containerEl);
  if (level === 0) opContainer.setOriginalPoster(data.by);

  return (
    <ItemCard
      containerEl={containerEl}
      data={data}
      originalPoster={opContainer.originalPoster}
      level={level}
      isLoading={isLoading}
      kids={data.kids?.map(itemId => (
        <Item id={itemId} key={itemId} level={level + 1} />
      ))}
    />
  );
};
