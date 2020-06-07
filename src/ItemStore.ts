import { observable, computed, action } from 'mobx';
import { HNItem } from './api/HNApiTypes';
import getItemFromApi, { IGetItemFromApi } from './api/getItemFromApi';

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

  @action async loadData(depth = 0) {
    const responseData = await this.api(this.id);

    this.data = responseData || {
      id: this.id,
      error: true
    };

    this.kids = this.data?.kids?.map(
      k => new ItemStore({ id: k, parent: this, currLevel: this.currLevl + 1 })
    );

    const kidsLoadingPromises: Promise<any>[] = [];

    if (depth > this.currLevl && this.kids) {
      this.kids.forEach(kid => {
        kidsLoadingPromises.push(kid.loadData());
      });

      return Promise.all(kidsLoadingPromises);
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
