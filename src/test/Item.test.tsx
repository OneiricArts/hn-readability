import React from 'react';
import { Item } from '../item/Item';
import { render, act, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import sinon from 'sinon';
import mockdate from 'mockdate';

import item8863 from './resources/8863';
import item23326827 from './resources/23326827';
import item23325786 from './resources/23325786';

/**
 * TODO
 *
 * Commented out all kids for mocked items
 * so I don't have to mock all recursive calls.
 *
 * Instead, should snapshot test a UI component after refactors.
 */

/**
 * @jest-environment jsdom
 */

describe('Item', () => {
  beforeEach(() => {
    mockdate.set('6/1/2020');

    // @ts-ignore
    global.document.getElementsByTagName = jest
      .fn()
      .mockReturnValue([{ innerHTML: {} }]);
  });

  afterEach(() => {
    mockdate.reset();
  });

  it('snapshot tests', async () => {
    const testCases = [
      { id: 8863, response: item8863 },
      { id: 23326827, response: item23326827 },
      { id: 23325786, response: item23325786 }
    ];

    for (let i = 0; i < testCases.length; i += 1) {
      const id = testCases[i].id;
      const response = testCases[i].response;

      //@ts-ignore
      let wrapper: RenderResult = undefined;

      await act(async () => {
        wrapper = render(
          <BrowserRouter>
            <Item
              id={id}
              addTopLevelCommentRef={() => undefined}
              getItem={sinon.stub().withArgs(id).resolves(response)}
            />
          </BrowserRouter>
        );
      });

      expect(wrapper.container.firstChild).toMatchSnapshot();
    }
  });
});
