import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';

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
    descendants: 55,
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
    <div className="p-2">
      <Card className="container-fluid">
        <div className="row clickable">
          <div
            className="col-10 px-2"
            // TODO Change to item view
            onClick={() => window.open(storyData.url || `https://news.ycombinator.com/item?id=${id}`)}
          >
            <div className={loadingClassName}>{storyData.title}</div>
            <div className="text-muted story--info">#{rank}&emsp;↑{storyData.score}</div>
          </div>
          <div
            className="col-2 pl-1 pr-1 story--comments"
            onClick={() => window.open(`https://news.ycombinator.com/item?id=${id}`)}
          >
            <span className="float-right align-middle small">
              <span className={loadingClassName}>
                {storyData.descendants}
              </span> 💬
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Story;
