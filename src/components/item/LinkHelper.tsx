import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LinkHelperProps = {
  openInNewTab?: boolean;
  reactRouterLink?: boolean;
  href: string;
  label: ReactNode;
};

export const LinkHelper: FC<LinkHelperProps> = ({
  openInNewTab,
  href,
  label,
  reactRouterLink
}) => {
  if (reactRouterLink) {
    if (openInNewTab)
      return (
        <Link target="_blank" rel="noopener noreferrer" to={href}>
          {label}
        </Link>
      );

    return <Link to={href}>{label}</Link>;
  }

  if (openInNewTab)
    return (
      <a target="_blank" rel="noopener noreferrer" href={href}>
        {label}
      </a>
    );

  return <a href={href}>{label}</a>;
};
