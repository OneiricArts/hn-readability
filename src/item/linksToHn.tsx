import React from 'react';
import LinkUrlCard from './LinkUrlCard';

/**
 * Searches text for urls to Hacker News and creates corresponding cards
 * for links to dapper urls for item
 */
export default function LinksToHn({ text }: { text: string }) {
  let linksToHn: string[] = [];

  let regexp = /news\.ycombinator\.com\S+item\?id=\d*/g;
  let matches = [...text.matchAll(regexp)];

  const ids = matches.map(a => a[0]).map(a => a.split('=')[1]);
  linksToHn = [...new Set(ids)];

  return (
    <>
      {linksToHn.map(id => (
        <div className="mt-2 mx-2" key={id}>
          <LinkUrlCard url={`https://dapper.dilraj.dev/item?id=${id}`} />
        </div>
      ))}
    </>
  );
}
