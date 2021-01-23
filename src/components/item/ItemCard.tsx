import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { Collapse } from 'reactstrap';
import Icon from '../Icon';
import { Link } from 'react-router-dom';
import Parent from './Parent';
import { HNItem } from '../../api/HNApiTypes';
import { topOfElIsVisible } from './helpers';
import { ShareBar } from './ShareBar';
import { TimeAgo } from '../timeago';
import LinkUrlCard from './LinkUrlCard';
import LinksToHn from './linksToHn';

interface TitleBarProps {
  data: HNItem;
  originalPoster?: string;
  topLevel: boolean;
  isOpen: boolean;
  isLoadingClassName: string;
}

export const TitleBar = ({
  data,
  originalPoster,
  topLevel,
  isOpen,
  isLoadingClassName
}: TitleBarProps) => (
  <div
    className={`${isLoadingClassName} text-muted small pt-1 px-2`}
    style={{ display: 'flex', alignItems: 'center' }}
  >
    {originalPoster === data.by && !topLevel && (
      <span
        style={{
          borderRadius: '5px',
          fontSize: '0.7rem'
        }}
        className="px-1 py-0 op-indicator"
      >
        op
      </span>
    )}
    &nbsp;
    {data.by} {/*TOOD remove this breaks snapshot test*/}
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
);

interface ItemCardProps {
  containerEl: React.RefObject<HTMLDivElement>;
  data: HNItem;
  originalPoster?: string;
  isLoading: boolean;
  level: number;
  kids?: React.ReactElement[];
}

export function ItemCard({
  containerEl,
  data,
  originalPoster,
  level,
  isLoading,
  kids
}: ItemCardProps) {
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
    0: 'orange',
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
      <TitleBar
        data={data}
        originalPoster={originalPoster}
        topLevel={topLevel}
        isOpen={isOpen}
        isLoadingClassName={isLoadingClassName}
      />

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
          {data.title && (
            <h4
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.title)
              }}
            />
          )}
          {data.url && <LinkUrlCard url={data.url} className="mb-2" />}
          {data.type === 'poll' && <p>Polls are not supported yet!</p>}
          <div
            className="item--hn-text"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.text || '')
            }}
          />
        </div>

        {data.text && !data.error && <LinksToHn text={data.text} />}

        {topLevel && <ShareBar id={data.id} title={data.title} />}

        {kids}
      </Collapse>
    </div>
  );
}
