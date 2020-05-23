import React, { useState } from 'react';
import FrontPage from './FrontPage';
import { SearchStories } from './SearchStories';

export default function Home() {
  const [showingSearch, setShowingSearch] = useState(false);

  return (
    <>
      {!showingSearch && <FrontPage />}
    </>
  );
}
