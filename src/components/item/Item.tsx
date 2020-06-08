import React, { useEffect, useState, useRef, useContext } from 'react';
import { setDocumentTitleWithData } from './helpers';
import { CommentRefContext } from './ItemPage';
import { ItemCard } from './ItemCard';
import ItemStore from '../../ItemStore';
import { observer } from 'mobx-react-lite';

interface ItemProps {
  store: ItemStore;
}

export const Item = observer(({ store }: ItemProps) => {
  const data = store.data || {
    id: store.id,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: 'Lorem ipsum dolor sit amet',
    descendants: 55,
    url: '',
    type: 'comment'
  };

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (!store.data) {
  //     setIsLoading(true);
  //     console.log('fetching');

  //     store.loadData().then(() => setIsLoading(false));
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [store]);

  if (store.data && store.currLevl === 0) setDocumentTitleWithData(store.data);

  const { addTopLevelCommentRef } = useContext(CommentRefContext);
  const containerEl = useRef<HTMLDivElement>(null);
  if (store.currLevl === 1) addTopLevelCommentRef(containerEl);

  return (
    <ItemCard
      containerEl={containerEl}
      data={data}
      level={store.currLevl}
      isLoading={isLoading}
      kids={store.kids
        ?.filter(k => k.data)
        .map(kid => (
          <Item store={kid} key={kid.id} />
        ))}
    />
  );
});
