import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'reactstrap';

interface HNItem {
  title: string;
  descendants: number;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  url: string;
  score?: number;
}

type HNItemPlaceHolder = Partial<HNItem>;

const Story = ({ id, rank }: { id: number, rank: number }) => {
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
        <Col
          sm={11}
          xs={10}
          className="px-2 pt-2 clickable"
          onClick={() => window.open(storyData.url || `https://news.ycombinator.com/item?id=${id}`)}
        >
          <div className={loadingClassName}>{storyData.title}</div>
          <span className={`${loadingClassName} text-muted story--info pt-1`}>
            #{rank}&emsp;↑{storyData.score}
          </span>
        </Col>
        <Col
          sm={1}
          xs={2}
          className="pl-1 pr-1 story--comments clickable"
          onClick={() => window.open(`https://news.ycombinator.com/item?id=${id}`)}
        >
          <span className="float-right align-middle small">
            <span className={loadingClassName}>{storyData.descendants}</span> 💬
          </span>
        </Col>
      </Row>
    </Container>
  );
}

export default Story;
