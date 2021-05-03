import React from 'react';
import { Emoji } from './Emoji';
import { LinkHelper } from './LinkHelper';
import { ResponsiveComponent } from './ResponsiveComponent';

export const Footer = () => (
  <ResponsiveComponent
    xs={
      <div className="h-border-top" style={{ padding: '40px 10px 0px 10px' }}>
        <div className="text-muted small">
          <Content />
        </div>
      </div>
    }
    sm={
      <div className="h-border-top" style={{ padding: '40px 50px 20px' }}>
        <div
          className="text-muted text-center small "
          style={{ paddingTop: '20px' }}
        >
          <Content />
        </div>
      </div>
    }
  />
);

const Content = () => (
  <>
    <img
      src="./logo192.png"
      width="20px"
      alt="Dapper Logo"
      style={{ display: 'inline-block', verticalAlign: 'top' }}
    />
    <span style={{ marginLeft: '-2px' }}>
      apper, a&nbsp;
      <LinkHelper
        openInNewTab
        href="https://news.ycombinator.com"
        label="Hacker News"
      />
      &nbsp;client
    </span>

    <span>&nbsp;|&nbsp;</span>

    <span>
      <LinkHelper
        openInNewTab
        href="https://github.com/OneiricArts/hn-readability"
        label="Github"
      />
    </span>

    <span>&nbsp;|&nbsp;</span>

    <LinkHelper reactRouterLink openInNewTab href="/contact" label="Contact" />

    <span>&nbsp;|&nbsp;</span>

    <LinkHelper
      reactRouterLink
      openInNewTab
      href="/contact"
      label={
        <>
          Buy me a coffee&nbsp;
          <Emoji emoji={<>☕️</>} label="coffee emoji" />
        </>
      }
    />
  </>
);
