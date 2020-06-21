export type StoryTypes = 'top'; //'top' | 'best' | 'new'...

const typeToUrl = {
  top: 'https://hacker-news.firebaseio.com/v0/topstories.json'
};

const getItemsFromApi = async (type: StoryTypes = 'top') => {
  const response = await fetch(typeToUrl[type]);
  const data: number[] = await response.json();

  return data;
};

export default getItemsFromApi;
