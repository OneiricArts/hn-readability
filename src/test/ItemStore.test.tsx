import ItemStore from '../ItemStore';
import sinon from 'sinon';

test('renders learn react link', async () => {
  const mockApi = sinon.stub().resolves({
    id: 123123,
    kids: [124324, 383983]
  });

  const store = new ItemStore({ id: 123123, api: mockApi });

  expect(store.id).toBe(123123);
  expect(store.kids).toEqual(undefined);

  await store.loadData();

  const kids = store.kids;

  expect(kids?.map(k => k.id)).toEqual([124324, 383983]);

  expect(kids).toBe(store.kids);
});
