import React, {
  useEffect,
  useState,
  FunctionComponent,
  useReducer,
  useMemo
} from 'react';
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

const tagTypes = [
  'story',
  'comment',
  'poll',
  'pollopt',
  'show_hn',
  'ask_hn',
  'front_page'
] as const;

type TagType = typeof tagTypes[number];

interface SearchParamsI {
  base: 'https://hn.algolia.com/api/v1';
  popularityOrRecent: 'search' | 'search_by_date';
  query: string;
  tags: TagType[];
}

const initSearchParams: SearchParamsI = {
  base: 'https://hn.algolia.com/api/v1',
  popularityOrRecent: 'search_by_date',
  tags: ['story'],
  query: ''
};

const readUrlSearchParams = () => {
  const params = new URLSearchParams(window.location.search);

  // Do not add key: undefined to this object or it will override init state
  // https://stackoverflow.com/a/54497408
  // https://github.com/Microsoft/TypeScript/issues/13195
  const mergeSearchParams: Partial<Omit<SearchParamsI, 'base'>> = {};

  const isTagType = (input: string): input is TagType =>
    (tagTypes as ReadonlyArray<string>).includes(input);

  // TODO with current approach, you cannot bookmark a link with no tags
  const tags = params.getAll('tags')?.filter(isTagType);
  if (tags.length) mergeSearchParams.tags = tags;

  const popularityOrRecentParam = params.get('popularityOrRecent');
  if (
    popularityOrRecentParam === 'search' ||
    popularityOrRecentParam === 'search_by_date'
  ) {
    mergeSearchParams.popularityOrRecent = popularityOrRecentParam;
  }

  const query = params.get('query');
  if (query) mergeSearchParams.query = query;

  return mergeSearchParams;
};

const setUrlSearchParams = (state: Omit<SearchParamsI, 'base'>) => {
  const { tags, ...stateWithoutTags } = state;

  const params = new URLSearchParams({ ...stateWithoutTags });
  tags.map(tag => params.append('tags', tag));

  if (state.query === '') {
    window.history.replaceState({}, '', document.location.pathname);
  } else {
    window.history.replaceState(
      {},
      '',
      `${document.location.pathname}?${params}`
    );
  }
};

type SearchParamAction =
  | { type: 'togglePopularityOrRecent' }
  | { type: 'setQuery'; query: string }
  | { type: 'toggleTag'; tag: TagType };

type SearchParamReducer = (
  prevState: SearchParamsI,
  action: SearchParamAction
) => SearchParamsI;

const searchParamReducer: SearchParamReducer = (prevState, action) => {
  let newState: SearchParamsI;

  switch (action.type) {
    case 'togglePopularityOrRecent':
      if (prevState.popularityOrRecent === 'search')
        newState = { ...prevState, popularityOrRecent: 'search_by_date' };
      else newState = { ...prevState, popularityOrRecent: 'search' };
      break;

    case 'setQuery':
      newState = { ...prevState, query: action.query };
      break;

    case 'toggleTag':
      if (prevState.tags.includes(action.tag))
        newState = {
          ...prevState,
          tags: prevState.tags.filter(e => e !== action.tag)
        };
      else newState = { ...prevState, tags: [...prevState.tags, action.tag] };
      break;

    default:
      throw new Error('Not supported action type for searchParamReducer.');
  }

  const { base, ...urlParams } = newState;
  setUrlSearchParams(urlParams);

  return newState;
};

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

  const mergedInitAndUrlSearchParams = useMemo(() => {
    return {
      ...initSearchParams,
      ...readUrlSearchParams()
    };
  }, []);

  const [searchParams, searchParamDispatch] = useReducer(
    searchParamReducer,
    mergedInitAndUrlSearchParams
  );

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
              searchParamDispatch({ type: 'setQuery', query: newQuery });
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
                searchParamDispatch({ type: 'setQuery', query: '' });
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
                searchParamDispatch({ type: 'togglePopularityOrRecent' })
              }
            />
          </FormGroup>

          <FormGroup>
            <span>Filter By Type</span>
            <InputGroup>
              {(['story', 'comment', 'front_page'] as const).map(tagType => (
                <CustomInput
                  key={tagType}
                  type="checkbox"
                  id={`${tagType}-filter-checkbox`}
                  className="mr-2"
                  label={tagType}
                  checked={searchParams.tags.includes(tagType)}
                  onChange={() =>
                    searchParamDispatch({ type: 'toggleTag', tag: tagType })
                  }
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
