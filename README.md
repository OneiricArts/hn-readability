![screely-1587941888468](https://user-images.githubusercontent.com/2523386/80322142-96c6e100-87e8-11ea-9ade-fb9275becd58.png)

Try it out: https://dapper.dilraj.dev

This is a client for the popular tech-focused [Hacker News](https://news.ycombinator.com/) forum, created with a focus on UX.

Some highlights:

- Designed for desktop, tablet, and mobile
- Light/Dark mode depending on device settings
- UI focuses on content, not on chrome
- A few restrained animations
- Each item has an easy link back to the original Hacker News url
- Front page:
  - floating button to hide read stories (stored locally, does not sync)
  - comment page easily accessibly by clicking chat icon on right
- Comment page:
  - click to collapse comment and that comment's children
  - floating button to navigate to next top-level commment

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Switch between dapper and hacker news with a browser bookmarklet

```
/**
 * Switch between dapper and hacker news articles
 */

const href = document.location.href;
const id = href.split('=')[1];

const url = (a) => `https://${a}/item?id=`;

const hn     = url('news.ycombinator.com');
const dapper = url('dapper.dilraj.dev');

if      (href.includes(hn))     document.location.href = `${dapper}${id}`;
else if (href.includes(dapper)) document.location.href = `${hn}${id}`;
```

minified bookmarklet via https://chriszarate.github.io/bookmarkleter/
(wrapped in IIFE to protect global environment and minified)

```
javascript:void%20function(){const%20a=document.location.href,b=a.split(%22=%22)[1],c=b=%3E`https://${b}/item%3Fid=`,d=c(%22news.ycombinator.com%22),e=c(%22dapper.dilraj.dev%22);a.includes(d)%3Fdocument.location.href=`${e}${b}`:a.includes(e)%26%26(document.location.href=`${d}${b}`)}();
```
