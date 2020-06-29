import React, { useEffect, useState, FunctionComponent } from 'react';
import {
  Input,
  Row,
  Col,
  CustomInput,
  Collapse,
  InputGroup,
  FormGroup
} from 'reactstrap';
import Story from './Story';

interface SearchStoriesProps {
  showingSearch: boolean;
  setShowingSearch: (b: boolean) => void;
}

type TagType =
  | 'story'
  | 'comment'
  | 'poll'
  | 'pollopt'
  | 'show_hn'
  | 'ask_hn'
  | 'front_page';

interface SearchParamsI {
  base: 'https://hn.algolia.com/api/v1';
  popularityOrRecent: 'search' | 'search_by_date';
  query: string;
  tags: TagType[];
}

const FilterContainer: FunctionComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="pl-3 pr-5 mr-4 my-3">
      <div className="d-flex">
        <span className="h5">Filters</span>

        <span
          className="ml-auto clickable"
          onClick={() => setIsOpen(curr => !curr)}
        >
          {isOpen ? <>hide &#x25B2;</> : <>show &#x25BC;</>}
        </span>
      </div>

      {/* Do not add padding to a Collapse! https://stackoverflow.com/a/33697157 */}
      <Collapse isOpen={isOpen}>
        <div className="py-2 px-3 border border-dark rounded">{children}</div>
      </Collapse>
    </div>
  );
};

export function SearchStories({
  showingSearch,
  setShowingSearch
}: SearchStoriesProps) {
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const [searchParams, setSearchParams] = useState<SearchParamsI>({
    base: 'https://hn.algolia.com/api/v1',
    popularityOrRecent: 'search_by_date',
    tags: ['story'],
    query: ''
  });

  useEffect(() => {
    const formulateUrl = () =>
      `${searchParams.base}/${searchParams.popularityOrRecent}?query=${
        searchParams.query
      }&tags=(${searchParams.tags.join(',')})`;

    async function getSearchedStories() {
      const response = await fetch(formulateUrl());
      const data = await response.json();

      const stories: number[] = data.hits.map((d: any) => d.objectID);

      if (searchParams.query.trim()) {
        setSearchResults(stories);
        setShowingSearch(true);
      } else {
        setSearchResults([]);
      }
    }

    try {
      getSearchedStories();
    } catch {}
  }, [searchParams, setShowingSearch]);

  return (
    <>
      <Row className="p-0 m-0 w-100 py-2">
        <Col xs={showingSearch ? 10 : 12} sm={showingSearch ? 11 : 12}>
          <Input
            placeholder="Search"
            value={searchParams.query}
            onChange={e => {
              const newQuery = e.target.value;
              setSearchParams(curr => {
                return { ...curr, query: newQuery };
              });
            }}
            className={`search-bar ${
              searchBarActive || showingSearch ? '' : 'search-bar-inactive'
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
                setSearchParams(curr => {
                  return { ...curr, query: '' };
                });
                setShowingSearch(false);
              }}
            >
              Cancel
            </span>
          </Col>
        )}
      </Row>

      {showingSearch && (
        <FilterContainer>
          <FormGroup>
            <CustomInput
              type="switch"
              id="popular-or-recent-filter-checkbox"
              label="By Recent"
              checked={searchParams.popularityOrRecent === 'search_by_date'}
              onChange={() =>
                setSearchParams(curr => {
                  if (curr.popularityOrRecent === 'search')
                    return { ...curr, popularityOrRecent: 'search_by_date' };

                  return { ...curr, popularityOrRecent: 'search' };
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <span>Filter By Type</span>
            <InputGroup>
              {(['story', 'comment', 'front_page'] as const).map(type => (
                <CustomInput
                  type="checkbox"
                  id={`${type}-filter-checkbox`}
                  className="mr-2"
                  label={type}
                  checked={searchParams.tags.includes(type)}
                  onChange={() => {
                    setSearchParams(curr => {
                      if (curr.tags.includes(type))
                        return {
                          ...curr,
                          tags: curr.tags.filter(e => e !== type)
                        };

                      return { ...curr, tags: [...curr.tags, type] };
                    });
                  }}
                />
              ))}
            </InputGroup>
          </FormGroup>

          <a href="https://hn.algolia.com/">Advanced search</a>
        </FilterContainer>
      )}

      {showingSearch && (
        <>
          {searchResults.map(id => (
            <Story id={id} key={id} />
          ))}

          {/* NEXT & PREV page arrows */}

          {searchResults.length === 0 && (
            <div className="text-center m-3 pb-3">
              {searchParams.query
                ? 'No Results found :('
                : 'Type to search or press cancel to go back.'}
            </div>
          )}
        </>
      )}
    </>
  );
}
