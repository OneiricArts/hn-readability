import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';

interface HNItem {
  title: string;
  descendants: number;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  url: string;
}

type HNItemPlaceHolder = Pick<HNItem, 'title' | 'descendants' | 'url'>;
// type HNItemPlaceHolder = Partial<HNItem>;

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

  return (
    <div className="p-2">
      <Card>
        <div className="container-fluid w-100">
          <div className="row">
            <div
              className="col-10"
              onClick={() => window.open(storyData.url)}
              style={{ cursor: 'pointer' }}
            >
              <span className={(isLoading && 'loading-skeleton') || ''}>{rank}. {storyData.title}</span>
            </div>
            <div
              className="col-2 pl-1 pr-1"
              style={{ backgroundColor: '#F0F0F0', cursor: 'pointer' }}
              onClick={() => window.open(`https://news.ycombinator.com/item?id=${id}`)}
            >
              <small>
                <span className="float-right align-middle">
                  <span className={(isLoading && 'loading-skeleton') || ''}>
                    {storyData.descendants}
                  </span> 💬
                </span>
              </small>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Story;
