import { HNItem } from './HNApiTypes';

export type IGetItemFromApi = (id: number) => Promise<HNItem | null>;

/**
 * Sometimes HN returns null for an item, need this so entire page doesn't break
 * TODO error boundry?
 * comment page for: https://news.ycombinator.com/item?id=22359574
 * - https://hacker-news.firebaseio.com/v0/item/22360822.json returns null
 * - https://news.ycombinator.com/item?id=22360822 shows a valid comment
 *
 * https://news.ycombinator.com/item?id=23158285
 * https://hacker-news.firebaseio.com/v0/item/23158285.json
 *
 *
 * (┛ಠ_ಠ)┛彡┻━┻
 */

const getItemFromApi: IGetItemFromApi = async (id: number) => {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );

  const data: HNItem | null = await response.json();

  if (!data) return null;

  if (data.deleted) {
    return {
      id: id,
      by: '[deleted]',
      text: '[deleted]',
      deleted: true
    };
  }

  // TODO: Verify what it means if this is empty
  // if (!data.by) {
  //   data.by = '[deleted]';
  // }

  return data;
};

export default getItemFromApi;
