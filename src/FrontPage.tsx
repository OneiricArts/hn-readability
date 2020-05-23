import React, { useEffect, useState, Fragment } from 'react';
import { Button } from 'reactstrap';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Story from './Story';
import Icon from './icons/Icon';

const LOAD_INCREMENT = 30;

const FrontPage = ({ url = 'https://hacker-news.firebaseio.com/v0/topstories.json' }) => {
  const [stories, setStories] = useState<number[]>([]);
  const [storiesToShow, setStoriesToShow] = useState<number>(LOAD_INCREMENT);

  const [doneLoading, setDone] = useState(false); // TODO add reason & check before showing more

  const [viewedStories, setViewedStories] = useState<number[]>(() => {
    const cache = localStorage.getItem('HNR_VIEWED_STORIES_CACHE');
    if (cache) return JSON.parse(cache);
    return [];
  });

  const [storiesToHide, setStoriesToHide] = useState<number[]>([]);
  const hideViewedStories = () => setStoriesToHide(viewedStories);

  useEffect(() => {
    async function getStories() {
      const response = await fetch(url);
      const data: number[] = await response.json();

      setStories(data);
    }

    getStories();
  }, [url]);

  useEffect(() => {
    // TODO change to calculating on this document vs. App div
    const moreEmptyRroom = document.documentElement.getBoundingClientRect().height < window.innerHeight;

    if (moreEmptyRroom) {
      setStoriesToShow(e => {
        if (e > 0 && e === stories.length) setDone(true); // TODO
        return Math.min(e + LOAD_INCREMENT, stories.length);
      })
    }
  }, [storiesToShow, stories, storiesToHide]);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        (document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop)) < 400;

      if (nearBottom) {
        setStoriesToShow(e => {
          if (e > 0 && e === stories.length) setDone(true); // TODO
          return Math.min(e + LOAD_INCREMENT, stories.length);
        })
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [stories]);

  const onStoryClick = (id: number) => {
    const currViewedStories = viewedStories;

    if (currViewedStories.length > 50) currViewedStories.pop();
    if (currViewedStories.indexOf(id) < 0) setViewedStories([id, ...currViewedStories]);
  }

  useEffect(() => localStorage.setItem('HNR_VIEWED_STORIES_CACHE', JSON.stringify(viewedStories)), [viewedStories]);

  const viewedStory = (id: number) => viewedStories.indexOf(id) > -1;

  return (
    <Fragment>
      <TransitionGroup>
        {stories.slice(0, storiesToShow)
          .map((id, index) =>
            storiesToHide.indexOf(id) < 0 &&
            <CSSTransition
              key={id}
              in
              timeout={300}
              classNames={{
                exit: 'animated faster fadeOutRight',
              }}
            >
              <Story id={id} rank={index + 1} onStoryClick={onStoryClick} viewedStory={viewedStory(id)} />
            </CSSTransition>
          )
        }
      </TransitionGroup>

      {doneLoading && <div>All Done, time to go outside.</div>}
      <Button
        size="lg"
        color="primary"
        className="hnr-floating-button ml-auto d-inline-flex"
        onClick={hideViewedStories}
      >
        <Icon name="eye-off" />
      </Button>
    </Fragment>
  );
}

export default FrontPage;
