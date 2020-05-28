import React from 'react';
import Icon from '../Icon';
import { hNItemLink } from './helpers';

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

const Share = ({ title, url }: { title?: string; url: string }) => {
  //@ts-ignore
  if (!navigator?.share) return null;

  const shareTo = async () => {
    try {
      //@ts-ignore
      await navigator.share({ title, url });
      console.log('shared!');
    } catch (e) {
      if (e.name === 'AbortError') console.log('Share aborted');
      else console.log(e);
    }
  };

  return (
    <div className={`${buttonBarClasses} clickable`} onClick={shareTo}>
      <Icon name="share" size={1.5} />
    </div>
  );
};

export const ShareBar = ({ id, title }: { id: number; title?: string }) => (
  <div className="h-border-top d-flex align-items-center">
    <LinkToHN id={id} />
    <Share title={title} url={hNItemLink(id)} />
  </div>
);
