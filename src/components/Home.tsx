import React, { useState } from 'react';
import { StoryTypes } from '../api/getItemsFromApi';
import FrontPage from './FrontPage';
import { SearchStories } from './SearchStories';
import { StorySelection } from './StorySelection';

export default function Home({
  initStoryType = 'top'
}: {
  initStoryType?: StoryTypes;
}) {
  const [showingSearch, setShowingSearch] = useState(false);

  return (
    <>
      <SearchStories
        showingSearch={showingSearch}
        setShowingSearch={setShowingSearch}
      />

      {!showingSearch && (
        <StorySelection
          initStoryType={initStoryType}
          render={storyType => <FrontPage storyType={storyType} />}
        />
      )}
    </>
  );
}
