import React, { RefObject, createContext, useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { topOfElIsVisible } from './helpers';
import { Item } from './Item';
import ItemStore from '../../ItemStore';

export const CommentRefContext = createContext<{
  addTopLevelCommentRef: (ref: RefObject<HTMLElement>) => void;
}>({ addTopLevelCommentRef: () => {} });

const ItemPage = ({ id }: { id: number }) => {
  const topLevelCommentRefs: RefObject<HTMLElement>[] = [];
  const addTopLevelCommentRef = (ref: RefObject<HTMLElement>) =>
    topLevelCommentRefs.push(ref);

  const goToNextComment = () => {
    const firstCommentWithTopVisible = topLevelCommentRefs.filter(
      e => !topOfElIsVisible(e, 5)
    )[0];

    if (firstCommentWithTopVisible?.current) {
      window.scrollTo({
        top: firstCommentWithTopVisible.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const store = new ItemStore({ id: id });
  console.log(store);

  const [loaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.loadData(10).then(() => setIsLoaded(true));
  });

  if (!loaded) return <div>loading...</div>;

  return (
    <>
      <Link to="/" className="pl-2">
        &laquo; home
      </Link>
      {/* Verify render side effects https://reactjs.org/docs/context.html#caveats */}
      <CommentRefContext.Provider
        value={{ addTopLevelCommentRef: addTopLevelCommentRef }}
      >
        <Item store={store} />
      </CommentRefContext.Provider>
      <Button
        size="lg"
        color="primary"
        className="hnr-floating-button d-md-none"
        onClick={goToNextComment}
      >
        &darr;
      </Button>
      <div className="d-md-none" style={{ paddingBottom: '80px' }}></div>
    </>
  );
};

export default ItemPage;
