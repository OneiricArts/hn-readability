import React, { useEffect, useState } from 'react';
import { Input, Row, Col } from 'reactstrap';
import Story from './Story';

interface SearchStoriesProps {
  showingSearch: boolean;
  setShowingSearch: (b: boolean) => void;
}

export function SearchStories({
  showingSearch,
  setShowingSearch
}: SearchStoriesProps) {
  const [searchTerm, setSearchterm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchBarActive, setSearchBarActive] = useState(false);

  useEffect(() => {
    async function getSearchedStories() {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${searchTerm}&tags=story`
      );
      const data = await response.json();

      const stories: number[] = data.hits.map((d: any) => d.objectID);

      if (searchTerm.trim()) {
        setSearchResults(stories);
        setShowingSearch(true);
      } else {
        setSearchResults([]);
      }
    }

    try {
      getSearchedStories();
    } catch {}
  }, [searchTerm, setShowingSearch]);

  return (
    <>
      <Row className="p-0 m-0 w-100 py-2">
        <Col xs={showingSearch ? 10 : 12} sm={showingSearch ? 11 : 12}>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchterm(e.target.value)}
            className={`search-bar ${
              searchBarActive ? '' : 'search-bar-inactive'
            }`}
            onSelect={() => setSearchBarActive(true)}
            onBlur={() => setSearchBarActive(false)}
          />
        </Col>

        {showingSearch && (
          <Col
            xs={2}
            sm={1}
            className="m-0 p-0 text-center d-flex align-items-center"
          >
            <span
              className="clickable hnr-blue"
              onClick={() => {
                setSearchterm('');
                setShowingSearch(false);
              }}
            >
              Cancel
            </span>
          </Col>
        )}
      </Row>

      {showingSearch && (
        <>
          {searchResults.map(id => (
            <Story id={id} key={id} />
          ))}

          {searchResults.length === 0 && (
            <div className="text-center m-3 pb-3">
              {searchTerm
                ? 'No Results found :('
                : 'Type to search or press cancel to go back.'}
            </div>
          )}
        </>
      )}
    </>
  );
}
