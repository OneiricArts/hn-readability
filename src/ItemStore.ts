import { observable, computed, action } from 'mobx';
import { HNItem } from './api/HNApiTypes';
import getItemFromApi, { IGetItemFromApi } from './api/getItemFromApi';
import { sleep } from './components/item/helpers';

type ItemStoreInit = {
  id: number;
  api?: IGetItemFromApi;
  currLevel?: number;
  parent?: ItemStore;
};

class ItemStore {
  id: number;
  currLevl: number;
  parent?: ItemStore;
  api: IGetItemFromApi;

  // use mobx 5.. todo banner if no proxy
  @observable data?: HNItem;

  constructor({
    id,
    api = getItemFromApi,
    currLevel = 0,
    parent = undefined
  }: ItemStoreInit) {
    this.id = id;
    this.currLevl = currLevel;
    this.api = api;

    if (parent) this.parent = parent;
  }

  @observable kids?: ItemStore[];

  // isFirstChild = () => this.parent?.kids && this.parent.kids[0] === this;
  get isFirstChild(): boolean {
    return this.parent?.kids !== undefined && this.parent.kids[0] === this;
  }

  // private promises: Promise<any>[] = [];
  @action async hydrate() {}

  @action async loadData(depth = 0) {
    const responseData = await this.api(this.id);
    await sleep(1000);

    this.data = responseData || {
      id: this.id,
      error: true
    };

    const kidsLoadingPromises: Promise<any>[] = [];

    this.kids = this.data?.kids?.map(
      k => new ItemStore({ id: k, parent: this, currLevel: this.currLevl + 1 })
    );

    if (depth > this.currLevl && this.kids) {
      this.kids.forEach(kid => {
        kidsLoadingPromises.push(kid.loadData(depth));
      });

      return await Promise.all(kidsLoadingPromises);
    }
  }
}

export default ItemStore;

// @computed
// get kids() {
//   return this.data?.kids?.map(k => new ItemStore(k));
// }
// autorun/reaction?

// class RootStore {
//   currId: number;

//   constructor(currId: number) {
//     this.currId = currId;
//   }
// }
