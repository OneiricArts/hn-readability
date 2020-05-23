import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import Icon from './icons/Icon';
import { HNItem } from './HNApiTypes';
import { TimeAgo } from './timeago';

type HNItemPlaceHolder = Partial<HNItem>;

interface StoryProps {
  id: number;
  rank?: number;
  onStoryClick?: (id: number) => void;
  viewedStory?: boolean;
}

const Story = ({ id, rank, onStoryClick = n => undefined, viewedStory }: StoryProps) => {
  const [storyData, setStoryData] = useState<HNItemPlaceHolder | HNItem>({
    title: 'This is the placeholder story with appr length',
    descendants: 555,
    url: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      // TODO make an API library for HN that handles returning nullable type (┛ಠ_ಠ)┛彡┻━┻
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const data = await response.json();
      // await new Promise(r => setTimeout(r, 200));

      setIsLoading(false);

      // https://news.ycombinator.com/item?id=23158285
      // https://hacker-news.firebaseio.com/v0/item/23158285.json
      setStoryData(data || {
        title: 'API error :( -- click to view @ news.ycombinator',
        url: `https://news.ycombinator.com/item?id=${id}`
      })
    }

    getItem();
  }, [id]);

  const loadingClassName = isLoading ? 'loading-skeleton' : '';

  let urlHostName: string | undefined;
  if (storyData.url) {
    const url = new URL(storyData.url);
    urlHostName = url.hostname;
  }

  const onClick = () => onStoryClick(id);
  const viewedStoryCss = viewedStory ? 'text-muted' : '';
  const showComments = storyData.descendants !== undefined;

  return (
    <Container fluid className="story--container">
      <Row>
        <a
          className={`px-2 pt-2 ${showComments ? 'col-sm-11 col-10' : 'col-12'} ${viewedStoryCss}`}
          href={storyData.url || `https://news.ycombinator.com/item?id=${id}`}
          onClick={onClick}
          rel="noopener noreferrer" target="_blank"
        >
          <div className={loadingClassName} dangerouslySetInnerHTML={{ '__html': DOMPurify.sanitize(storyData.title || '') }} />
          <span className={`${loadingClassName} text-muted story--info pt-2`} style={{ display: 'flex', alignItems: 'center' }}>
            {rank && <>#{rank}&emsp;</>}↑{storyData.score}&emsp;<TimeAgo time={storyData.time} icon />&emsp;{urlHostName}
          </span>
        </a>
        {showComments &&
          <Link
            className={`col-sm-1 col-2 pl-1 pr-1 pt-2 story--comments ${viewedStoryCss}`}
            to={`/item?id=${id}`}
            onClick={onClick}
            rel="noopener noreferrer" target="_blank"
          >
            <span className={`${loadingClassName} float-right small`} style={{ display: 'flex', alignItems: 'center' }}>
              {storyData.descendants}&nbsp;<Icon name="chat-bubbles" />
            </span>
          </Link>}
      </Row>
    </Container>
  );
}

export default Story;
