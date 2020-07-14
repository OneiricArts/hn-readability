import React, { FC } from 'react';
import Icon from '../Icon';

type LinkUrlCardProps = {
  url: string;
  className?: string;
};

const LinkUrlCard: FC<LinkUrlCardProps> = ({ url, className }) => (
  <a
    href={url}
    className={`p-1 link-card d-flex align-items-center ${className}`}
  >
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
