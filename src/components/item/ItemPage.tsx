import React, { RefObject, createContext } from 'react';
import { Link } from 'react-router-dom';
import { topOfElIsVisible } from './helpers';
import { Item } from './Item';
import { FloatingButton } from '../FloatingButton';
import { Footer } from './Footer';

type OpContainerI = {
  originalPoster?: string;
  setOriginalPoster: (op?: string) => void;
};

export const CommentRefContext = createContext<{
  addTopLevelCommentRef: (ref: RefObject<HTMLElement>) => void;
  opContainer: OpContainerI;
}>({
  addTopLevelCommentRef: () => {},
  opContainer: {
    originalPoster: undefined,
    setOriginalPoster: () => {}
  }
});

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

  const opContainer: OpContainerI = {
    originalPoster: undefined,
    setOriginalPoster: (op?: string) => (opContainer.originalPoster = op)
  };

  return (
    <>
      <Link to="/" className="pl-2">
        &laquo; home
      </Link>
      {/* Verify render side effects https://reactjs.org/docs/context.html#caveats */}
      <CommentRefContext.Provider
        value={{ addTopLevelCommentRef, opContainer }}
      >
        <Item id={id} />
      </CommentRefContext.Provider>

      <Footer />

      <FloatingButton onClick={goToNextComment} className="d-md-none">
        &darr;
      </FloatingButton>
      <div className="d-md-none" style={{ paddingBottom: '80px' }}></div>
    </>
  );
};

export default ItemPage;
