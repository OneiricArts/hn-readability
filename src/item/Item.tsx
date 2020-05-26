import React, { useEffect, useState, useRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import { Collapse } from 'reactstrap';
import Icon from '../icons/Icon';
import { Link } from 'react-router-dom';
import Parent from './Parent';
import { HNItem } from '../HNApiTypes';
import { topOfElIsVisible } from './helpers';
import { Share } from './Share';
import { TimeAgo } from '../timeago';
import LinkUrlCard from './LinkUrlCard';
import LinksToHn from './linksToHn';

const hNItemLink = (id: number) => `https://news.ycombinator.com/item?id=${id}`;

export const buttonBarClasses =
  'd-inline-flex align-items-center h-border-right py-2 px-2';

const LinkToHN = ({ id }: { id: number }) => (
  <a
    className={`${buttonBarClasses} hnr-inherit-color`}
    role="button"
    href={hNItemLink(id)}
  >
    <Icon name="link" size={1.5} />
  </a>
);

interface ItemProps {
  id: number;
  level?: number;
  addTopLevelCommentRef: (r: RefObject<HTMLElement>) => void;
}

export const Item = ({ id, level = 0, addTopLevelCommentRef }: ItemProps) => {
  const [data, setData] = useState<HNItem>({
    id: id,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: 'Lorem ipsum dolor sit amet',
    descendants: 55,
    url: '',
    type: 'comment'
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      const data: HNItem = await response.json();

      if (level === 0) {
        if (data.title) {
          document.getElementsByTagName(
            'title'
          )[0].innerHTML = `${DOMPurify.sanitize(data.title)} | Dapper`;
        } else if (data.text) {
          const div = document.createElement('div');
          div.innerHTML = DOMPurify.sanitize(data.text);
          let title = div.textContent;

          if (title && title?.length > 90) {
            document.title = `${title.substring(0, 90)}... | Dapper`;
          } else {
            document.title = `${title} | Dapper`;
          }
        }
      }

      ReactDOM.unstable_batchedUpdates(() => {
        setIsLoading(false);
        /**
         * Sometimes HN returns null for an item, need this so entire page doesn't break
         * TODO error boundry?
         * comment page for: https://news.ycombinator.com/item?id=22359574
         * - https://hacker-news.firebaseio.com/v0/item/22360822.json returns null
         * - https://news.ycombinator.com/item?id=22360822 shows a valid comment
         * (┛ಠ_ಠ)┛彡┻━┻
         */
        setData(
          data || {
            text: `API error :( <a href="${hNItemLink(id)}">view on hn</a>`,
            type: 'comment'
          }
        );
      });
    }

    getItem();
  }, [id, level]);

  const containerEl = useRef<HTMLDivElement>(null);
  if (level === 1) addTopLevelCommentRef(containerEl);

  const [isOpen, setIsOpen] = useState(true);
  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (level === 0) return;

    // do not collapse comment if user is selecting text
    const selection = window.getSelection();
    if (selection?.type === 'Range') return;

    // do not collapse comment if clicking on link inside div (HTML from api), or link icon, or dapper link at bottom
    const target = e.target as HTMLElement;
    if (target.nodeName === 'A' || target.nodeName === 'svg') return;
    if (
      target.parentNode?.nodeName === 'A' ||
      target.parentNode?.nodeName === 'svg'
    )
      return;

    e.stopPropagation();
    setIsOpen(!isOpen);

    if (containerEl?.current && topOfElIsVisible(containerEl))
      window.scrollTo({
        top: containerEl.current.offsetTop - 10,
        behavior: 'smooth'
      });
  };

  const levelToColorMap = {
    2: 'blue',
    3: 'gray',
    4: 'purple',
    5: 'green',
    0: 'orange', // use %, so 0 is last (6th)
    1: 'red' // level 1 does not show any, so this is first used on level 7
  };

  // @ts-ignore
  const levelBorderColor = () => `level-border-${levelToColorMap[level % 6]}`;

  const isLoadingClassName = isLoading ? 'loading-skeleton' : '';
  const commentCss = level > 1 ? `${levelBorderColor()} ml-3` : '';
  const topLevel = level === 0;

  return (
    <div
      ref={containerEl}
      className={`${commentCss} ${level > 0 ? 'h-border-top' : ''} px-0 `}
      onClick={toggle}
    >
      <div
        className={`${isLoadingClassName} text-muted small pt-1 px-2`}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {data.by || '[deleted]'}{' '}
        {/* TODO: Verify what it means if this is empty */}
        {topLevel && (
          <>
            &emsp;{data.score && `↑${data.score}`}&emsp;
            <TimeAgo time={data.time} icon />
          </>
        )}
        {!topLevel && (
          <span className="ml-auto">
            <Link to={`/item?id=${data.id}`} className="mr-3 hnr-inherit-color">
              <Icon name="link" svgClassName="ignore" />
            </Link>
            <TimeAgo time={data.time} />
            &nbsp;
            {isOpen ? String.fromCharCode(8593) : String.fromCharCode(8595)}
          </span>
        )}
      </div>

      {topLevel && (
        <div className="px-2 py-1 text-muted small w-100 text-truncate">
          {data.parent && <Parent parent={data.parent} />}
        </div>
      )}

      <Collapse isOpen={isOpen}>
        <div
          className={`${isLoadingClassName} py-1 px-2`}
          style={{ wordBreak: 'break-word' }}
        >
          {data.deleted && '[deleted]'}
          {data.title && (
            <h4
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.title)
              }}
            />
          )}
          {data.url && <LinkUrlCard url={data.url} />}
          {data.type === 'poll' && <p>Polls are not supported yet!</p>}
          <div
            className="item--hn-text"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.text || '')
            }}
          />
        </div>

        {/* If item contains link to hacker news item,
        append link cards to dapper url of item */}
        {data.text && <LinksToHn text={data.text} />}

        {topLevel && (
          <div className="h-border-top d-flex align-items-center">
            <LinkToHN id={id} />
            <Share title={data.title} url={hNItemLink(id)} />
          </div>
        )}
        {data.kids?.map(itemId => (
          <Item
            id={itemId}
            key={itemId}
            level={level + 1}
            addTopLevelCommentRef={addTopLevelCommentRef}
          />
        ))}
      </Collapse>
    </div>
  );
};
