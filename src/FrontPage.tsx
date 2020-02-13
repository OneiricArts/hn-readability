import React, { useEffect, useState } from 'react';
import Story from './Story';

const LOAD_INCREMENT = 30;

const FrontPage = ({ url = 'https://hacker-news.firebaseio.com/v0/topstories.json' }) => {
  const [stories, setStories] = useState<number[]>([]);
  const [storiesToShow, setStoriesToShow] = useState<number>(LOAD_INCREMENT);

  const [doneLoading, setDone] = useState(false); // TODO add reason & check before showing more

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
  }, [storiesToShow, stories]);

  useEffect(() => {
    const onScroll = () => {
      const atBottom =
        (window.innerHeight + document.documentElement.scrollTop) === document.documentElement.offsetHeight;

      if (atBottom) {
        setStoriesToShow(e => {
          if (e > 0 && e === stories.length) setDone(true); // TODO
          return Math.min(e + LOAD_INCREMENT, stories.length);
        })
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [stories]);

  return (
    <div className="p-2 mx-auto front-page--container">
      {stories.slice(0, storiesToShow).map((id, index) => <Story key={id} id={id} rank={index + 1} />)}
      {doneLoading && <div>All Done, time to go outside.</div>}
    </div>
  );
}

export default FrontPage;
