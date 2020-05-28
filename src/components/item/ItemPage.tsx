import React, { RefObject } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { topOfElIsVisible } from './helpers';
import { Item } from './Item';

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

  return (
    <>
      <Link to="/" className="pl-2">
        &laquo; home
      </Link>
      <Item id={id} addTopLevelCommentRef={addTopLevelCommentRef} />
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
