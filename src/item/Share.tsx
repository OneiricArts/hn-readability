import React from 'react';
import Icon from '../icons/Icon';
import { buttonBarClasses } from './Item';
export const Share = ({ title, url }: { title?: string; url: string; }) => {
  //@ts-ignore
  if (!navigator?.share)
    return null;

  const shareTo = async () => {
    try {
      //@ts-ignore
      await navigator.share({ title, url });
      console.log('shared!');
    }
    catch (e) {
      if (e.name === 'AbortError')
        console.log('Share aborted');
      else
        console.log(e);
    }
  };

  return (
    <div className={`${buttonBarClasses} clickable`} onClick={shareTo}>
      <Icon name="share" size={1.5} />
    </div>
  );
};
