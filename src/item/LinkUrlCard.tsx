import React from 'react';
import Icon from '../icons/Icon';

const LinkUrlCard = ({ url }: { url: string }) => (
  <a href={url} className="p-1 mb-2 link-card d-flex align-items-center">
    <Icon size={2} name="compass" />
    <span
      className="pl-2 ml-2 pr-2 link-card--text text-truncate"
      style={{ flex: '1' }}
    >
      {url}
    </span>
  </a>
);

export default LinkUrlCard;
