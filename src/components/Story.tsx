import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { HNItem } from '../api/HNApiTypes';
import { TimeAgo } from './timeago';
import getItemFromApi from '../api/getItemFromApi';
import { elipsify } from './item/helpers';

const noop = () => undefined;

interface StoryProps {
  id: number;
  rank?: number;
  onStoryClick?: (id: number) => void;
  viewedStory?: boolean;
}

const Story = ({ id, rank, onStoryClick = noop, viewedStory }: StoryProps) => {
  const [storyData, setStoryData] = useState<HNItem>({
    id,
    title: 'This is the placeholder story with appr length',
    descendants: 555,
    url: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      const data = await getItemFromApi(id);
      // await sleep(200)

      setIsLoading(false);

      setStoryData(
        data || {
          id: id,
          title: 'API error :( -- click to view @ news.ycombinator',
          url: `https://news.ycombinator.com/item?id=${id}`
        }
      );
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
  const showComments =
    storyData.descendants !== undefined || storyData.kids !== undefined;

  return (
    <Container fluid className="story--container">
      <Row>
        <a
          className={`px-2 pt-2 ${
            showComments ? 'col-sm-11 col-10' : 'col-12'
          } ${viewedStoryCss}`}
          href={storyData.url || `https://dapper.dilraj.dev/item?id=${id}`}
          onClick={onClick}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div
            className={loadingClassName}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(storyData.title || '')
            }}
          />
          {!storyData.title && storyData.text && (
            <div
              className={loadingClassName}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(elipsify(storyData.text.trim(), 200))
              }}
            />
          )}
          <span
            className={`${loadingClassName} text-muted story--info pt-2`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {rank && <>#{rank}&emsp;</>}↑{storyData.score}&emsp;
            <TimeAgo time={storyData.time} icon />
            &emsp;{urlHostName}
          </span>
        </a>
        {showComments && (
          <Link
            className={`col-sm-1 col-2 pl-1 pr-1 pt-2 story--comments ${viewedStoryCss}`}
            to={`/item?id=${id}`}
            onClick={onClick}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span
              className={`${loadingClassName} float-right small`}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {storyData.descendants ?? storyData.kids?.length}&nbsp;
              <Icon name="chat-bubbles" />
            </span>
          </Link>
        )}
      </Row>
    </Container>
  );
};

export default Story;
