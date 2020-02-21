import React, { useEffect, useState } from 'react';
import { Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import Chat from './icons/Chat';

interface HNItem {
  title?: string;
  descendants: number;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  url: string;
  score?: number;
}

type HNItemPlaceHolder = Partial<HNItem>;

const Story = ({ id, rank, selectComment }: { id: number, rank: number, selectComment: any }) => {
  const [storyData, setStoryData] = useState<HNItemPlaceHolder | HNItem>({
    title: 'This is the placeholder story with appr length',
    descendants: 555,
    url: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const data = await response.json();
      // await new Promise(r => setTimeout(r, 200));

      setIsLoading(false);
      setStoryData(data);
    }

    getItem();
  }, [id]);

  const loadingClassName = isLoading ? 'loading-skeleton' : '';

  return (
    <Container fluid className="story--container">
      <Row>
        <a
          className="px-2 pt-2 col-sm-11 col-10"
          href={storyData.url || `https://news.ycombinator.com/item?id=${id}`}
        >
          <div className={loadingClassName}>{storyData.title}</div>
          <span className={`${loadingClassName} text-muted story--info pt-1`}>
            #{rank}&emsp;↑{storyData.score}
          </span>
        </a>
        <div
          className="col-sm-1 col-2 pl-1 pr-1 pt-2 story--comments clickable"
          // to={`/item?id=${id}`}
          onClick={() => selectComment(id)}
        >
          <span className="float-right align-middle small">
            <span className={loadingClassName}>{storyData.descendants}</span> <Chat />
          </span>
        </div>
      </Row>
    </Container>
  );
}

export default Story;
