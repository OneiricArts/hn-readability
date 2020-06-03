// https://github.com/HackerNews/API#items

export interface HNItem {
  id: number;
  deleted?: boolean;
  type?: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by?: string;
  time?: number; // UNIX time
  text?: string; // HTML
  dead?: boolean; // true if the item is dead.
  parent?: number;
  poll?: number; // a pollopt's poll
  kids?: number[]; // in ranked display order
  url?: string;
  score?: number;
  title?: string; // The title of the story, poll or job. HTML.
  parts?: number[]; // the pollopts of a poll
  descendants?: number;

  /**
   * ADDED BY ME
   */
  error?: boolean;
}
