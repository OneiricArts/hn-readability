import React, { useEffect, useState } from 'react';
import Story from './Story';

const LOAD_INCREMENT = 30;

const FrontPage = ({ url = 'https://hacker-news.firebaseio.com/v0/topstories.json' }) => {
  const [stories, setStories] = useState<number[]>([]);

  useEffect(() => {
    async function getStories() {
      const response = await fetch(url);
      const data: number[] = await response.json();

      setStories(data);
    }

    getStories();
  }, [url]);

  return (
    <div className="p-2 mx-auto" style={{ maxWidth: '600px' }}>
      {stories.slice(0, storiesToShow).map((id, index) => <Story key={id} id={id} rank={index + 1} />)}
    </div>
  );
}

export default FrontPage;
