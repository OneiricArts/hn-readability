export type StoryTypes = 'top' | 'best' | 'new' | 'ask' | 'show' | 'jobs';

const typeToUrl = {
  top: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  best: 'https://hacker-news.firebaseio.com/v0/beststories.json',
  new: 'https://hacker-news.firebaseio.com/v0/newstories.json',
  ask: 'https://hacker-news.firebaseio.com/v0/askstories.json',
  show: 'https://hacker-news.firebaseio.com/v0/showstories.json',
  jobs: 'https://hacker-news.firebaseio.com/v0/jobstories.json'
};

const getItemsFromApi = async (type: StoryTypes = 'top') => {
  const response = await fetch(typeToUrl[type]);
  const data: number[] = await response.json();

  return data;
};

export default getItemsFromApi;
