import React, { FunctionComponent, ReactNode, useReducer } from 'react';
import { StoryTypes } from '../api/getItemsFromApi';
import { Button } from 'reactstrap';
import { Helmet } from 'react-helmet';

type StoryTypeOptions = {
  active: boolean;
  label: string;
  value: StoryTypes;
}[];

const initStoryTypes: StoryTypeOptions = [
  { active: false, label: 'Top Stories', value: 'top' },
  { active: false, label: 'New Stories', value: 'new' },
  { active: false, label: 'Ask HN', value: 'ask' },
  { active: false, label: 'Show HN', value: 'show' },
  { active: false, label: 'Jobs', value: 'jobs' }
];

const initStoryTypesActive = (type: StoryTypes): StoryTypeOptions =>
  initStoryTypes.map(s => (s.value === type ? { ...s, active: true } : s));

type Action = { type: 'setActive'; value: StoryTypes };

const reducer = (prevState: StoryTypeOptions, action: Action) => {
  let newState: StoryTypeOptions = [...prevState];

  switch (action.type) {
    case 'setActive':
      newState.map(s => (s.active = s.value === action.value));
      break;

    default:
      throw Error('not supported action type');
  }

  const activeStoryType = newState.find(s => s.active)?.value;

  window.history.replaceState(
    {},
    '',
    `/${activeStoryType === 'top' ? '' : activeStoryType}`
  );

  return newState;
};

export const StorySelection: FunctionComponent<{
  initStoryType: StoryTypes;
  render: (storyType?: StoryTypes) => ReactNode;
}> = ({ render, initStoryType = 'top' }) => {
  const [storyTypes, dispatch] = useReducer(
    reducer,
    initStoryTypesActive(initStoryType)
  );

  const activeStoryType = storyTypes.find(s => s.active);

  return (
    <>
      <Helmet>
        <title>
          {activeStoryType?.value === 'top' && activeStoryType?.label}
        </title>
      </Helmet>

      <div className="ml-2 pb-1 h-border-bottom">
        {storyTypes.map(e => (
          <Button
            key={e.value}
            color="link"
            style={{ textDecoration: 'none' }}
            className={`${e.active ? '' : 'text-muted'} p-1 `}
            onClick={() => dispatch({ type: 'setActive', value: e.value })}
          >
            {e.label}
          </Button>
        ))}
      </div>

      {render(activeStoryType?.value)}
    </>
  );
};
