// import { sleep } from '../components/item/helpers';

export type StoryTypes = 'top'; //'top' | 'best' | 'new'...

const typeToUrl = {
  top: 'https://hacker-news.firebaseio.com/v0/topstories.json'
};

const getItemsFromApi = async (type: StoryTypes = 'top') => {
  console.log('GET>>');

  const response = await fetch(typeToUrl[type]);
  const data: number[] = await response.json();

  // await sleep(2000);

  console.log('GET DONE____');
  return data;
};

export default getItemsFromApi;
