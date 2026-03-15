import { useState, useRef, useMemo, type FormEvent } from 'react';
import { useAppStore } from '../../store/index.js';
import { Loader, NoSearchResults, Pagination, SearchTab } from '../../components/index.js';
import { Input } from '../../components/input/index.js';
import type { AutocompleteOptions } from '../../components/input/index.js';
import { StructuresList } from '../../components/structure-list/structure-list.js';
import type { StructureModel } from '../../models/index.js';
import { ErrorToast } from '../../components/toast/index.js';
import { SearchState } from '../../store/slices/search-by-name-page.slice.js';
import { useValidationError, type Validator } from './common/index.js';

interface SearchFormData {
  name: string;
}

interface SuggestedName {
  value: string;
  count: number;
  isSelected: boolean;
}

const renderItemValue = (item: SuggestedName, search: string): React.ReactNode => {
  search = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const re = new RegExp('(^' + search.split(' ').join('|') + ')', 'gi');

  if (item.value && item.count) {
    let valueWords = item.value.split(' ');
    valueWords = valueWords.map((word: string) => {
      return word.replace(re, '<b>$1</b>');
    });

    const html = valueWords.join(' ');
    return (
      <span>
        <span dangerouslySetInnerHTML={{ __html: html }} />
        <span className="comments">{item.count}</span>
      </span>
    );
  }
  return null;
};

const autoCompleteSource = (
  value: string,
  response: (value: string, data: { value: string; isSelected: boolean }[]) => void
) => {
  fetch('/api/v1/autocomplete/name?name=' + encodeURIComponent(value), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data: { data?: { name: string; count: number }[] }) => {
      if (data.data && Array.isArray(data.data)) {
        const responseData = data.data.map((item) => ({
          value: item.name,
          count: item.count,
          isSelected: false,
        }));
        response(value, responseData);
        return;
      }
      response(value, []);
    })
    .catch(() => {
      response(value, []);
    });
};

function countWords(searchText: string) {
  const SMALL_WORDS_SIZE = 3;

  if (searchText) {
    const text = searchText.replace(/[^a-z0-9]/gim, ' ').replace(/\s+/g, ' ');
    const searchWords = text.split(' ').filter((word) => word.length > SMALL_WORDS_SIZE);
    return searchWords.length;
  }
  return 0;
}

const rangeValidator: Validator = {
  type: 'range',
  isValid(value: string) {
    return value.length > 3 && value.length < 255;
  },
  message: 'Name should contain at least 4 symbols',
};

const countWordsValidator: Validator = {
  type: 'countWords',
  isValid(value: string) {
    if (value !== '') {
      const words = countWords(value);
      return words > 0;
    }
    return true;
  },
  message: 'Search name should contain words with at least three letters',
};

const SearchByNameForm = ({
  onSubmit,
  initialValue,
}: {
  initialValue: string;
  onSubmit: (data: SearchFormData) => void;
}) => {
  const [name, setName] = useState(initialValue);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const error = useValidationError([rangeValidator, countWordsValidator], name);

  const autoCompleteOptions: Partial<AutocompleteOptions> = {
    minChars: 1,
    delay: 100,
    source: autoCompleteSource,
    renderItemValue: renderItemValue as AutocompleteOptions['renderItemValue'],
  };

  const handleNameChange = (nameValue: string) => {
    setName(nameValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setSuggestionsVisible(false);
    event.preventDefault();
    if (name !== '') {
      onSubmit({ name });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="has-icon-left has-button-right">
          <svg
            className="form-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="var(--color-grey)"
            />
          </svg>
          <Input
            initialValue={initialValue}
            name="name"
            onChange={handleNameChange}
            placeholder="Enter keyword"
            suggestionsVisible={suggestionsVisible}
            setSuggestionsVisible={setSuggestionsVisible}
            autoCompleteOptions={autoCompleteOptions}
          />
          <button className="form-button btn" title={error}>
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

const SearchSummary = ({ totalResults }: { totalResults: number }) => {
  return (
    <div className="search-layout__results-header">
      <h4 className="text-primary">Results: {totalResults}</h4>
    </div>
  );
};

const SearchResults = () => {
  const containerRef = useRef(null);
  const isLoading = useAppStore((s) => s.searchByNameSlice.isLoading);
  const structureIds = useAppStore((s) => s.searchByNameSlice.data.structureIds);
  const structureById = useAppStore((s) => s.searchByNameSlice.data.structureById);
  const structures = useMemo(
    () =>
      structureIds
        .map((id) => structureById[id])
        .filter((item) => !!item) as unknown as StructureModel[],
    [structureIds, structureById]
  );
  const currentPage = useAppStore((s) => s.searchByNameSlice.search.page);
  const searchString = useAppStore((s) => s.searchByNameSlice.search.name);
  const error = useAppStore((s) => s.searchByNameSlice.error);
  const totalPages = useAppStore((s) => s.searchByNameSlice.meta.totalPages);
  const status = useAppStore((s) => s.searchByNameSlice.status);
  const metaTotalResults = useAppStore((s) => s.searchByNameSlice.meta.totalResults);
  const totalResults = useMemo(
    () => Math.max(Object.keys(structureById).length, metaTotalResults),
    [structureById, metaTotalResults]
  );
  const hasNoResults = status === SearchState.success && totalResults === 0;
  const showSummary =
    totalResults !== 0 &&
    [SearchState.processing, SearchState.started, SearchState.success].includes(status);

  const searchStructureByName = useAppStore((s) => s.searchStructureByName);

  const onPageNavigate = (page: number) => {
    searchStructureByName({ name: searchString, page });
  };

  return (
    <div>
      <div className="search-layout__results-list">
        <div ref={containerRef}>
          {showSummary ? <SearchSummary totalResults={totalResults} /> : null}
          {hasNoResults ? <NoSearchResults /> : null}
          {error ? <ErrorToast error={error} /> : null}
          <Loader isVisible={isLoading} scrollElement={containerRef}>
            <Pagination
              currentPage={currentPage}
              maxPages={10}
              totalPages={totalPages}
              url="/search"
              onPageNavigate={onPageNavigate}
            />
            <StructuresList list={structures} />
          </Loader>
        </div>
      </div>
    </div>
  );
};

export const SearchByNamePage = () => {
  const page = useAppStore((s) => s.searchByNameSlice.search.page);
  const searchStructureByName = useAppStore((s) => s.searchStructureByName);

  const handleSubmit = (data: SearchFormData) => {
    searchStructureByName({ ...data, page });
  };
  const searchString = useAppStore((s) => s.searchByNameSlice.meta.searchString);

  return (
    <div className="search-layout-tabs">
      <header className="app-layout-header">
        <h2 className="text-primary">Crystal Structure Search</h2>
        <SearchTab />
      </header>
      <div className="app-layout-content">
        <div className="search-layout__page">
          <div>
            <SearchByNameForm onSubmit={handleSubmit} initialValue={searchString} />
          </div>
          <div>
            <SearchResults />
          </div>
        </div>
      </div>
    </div>
  );
};
