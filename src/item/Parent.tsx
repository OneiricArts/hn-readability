import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { HNItem } from '../HNApiTypes';
// import Icon from "../icons/Icon";

// TODO track max level?
async function getOnComment(id: number): Promise<HNItem | null> {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    const data: HNItem = await response.json();

    if (data.type === 'comment' && data.parent)
      return getOnComment(data.parent);
    else return data;
  } catch {
    return null;
  }
}

const Parent = ({ parent }: { parent: number }) => {
  const [on, setOn] = useState<HNItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getOn() {
      const data = await getOnComment(parent);
      setOn(data);
      setLoading(false);
    }

    getOn();
  }, [parent]);

  if (loading) return <span className="loading-skeleton px-5" />;
  if (!on) return null;

  return (
    <>
      {parent !== on.id && (
        <>
          <Link className="text-muted" to={`/item?id=${parent}`}>
            parent
          </Link>
          &nbsp;&#124;&nbsp;
        </>
      )}
      <Link to={`/item?id=${on.id}`} className="text-muted">
        {/* <Icon name="return-up" />&nbsp; */}
        on:&nbsp;
        <span
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(on.title || '')
          }}
        />
      </Link>
    </>
  );
};

export default Parent;
