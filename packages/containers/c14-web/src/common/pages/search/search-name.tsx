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
          <i className="form-icon icon icon-search search-layout__search-icon"></i>
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

const _DemoFormData = () => {
  return (
    <div>
      <h2 className="text-primary">Badges</h2>
      <p>
        <span className="text-primary p-1">primary color</span>
      </p>
      <p>
        <span className="text-secondary p-1">secondary color</span>
      </p>
      <p>
        <span className="text-additional p-1">additional color</span>
      </p>
      <p>
        <span className="text-dark p-1">dark color</span>
      </p>
      <p>
        <span className="text-gray p-1">gray color</span>
      </p>
      <p>
        <span className="text-light p-1">light color</span>
      </p>
      <p>
        <span className="text-active p-1">active color</span>
      </p>
      <p>
        <span className="text-success p-1">success color</span>
      </p>
      <p>
        <span className="text-warning p-1">warning color</span>
      </p>
      <p>
        <span className="text-error p-1">error color</span>
      </p>

      <p>
        <span className="bg-primary p-1">primary bg</span>
      </p>
      <p>
        <span className="bg-secondary p-1">secondary bg</span>
      </p>
      <p>
        <span className="bg-additional p-1">additional color</span>
      </p>
      <p>
        <span className="bg-dark p-1">dark bg</span>
      </p>
      <p>
        <span className="bg-default p-1">default bg</span>
      </p>
      <p>
        <span className="bg-active p-1">active bg</span>
      </p>
      <p>
        <span className="bg-success p-1">success bg</span>
      </p>
      <p>
        <span className="bg-warning p-1">warning bg</span>
      </p>
      <p>
        <span className="bg-error p-1">error bg</span>
      </p>
      <hr />

      <h3 className="text-primary">Form radio</h3>
      <div className="form-group">
        <label className="form-radio">
          <input type="radio" name="gender" checked />
          <i className="form-icon"></i> Male
        </label>
        <label className="form-radio">
          <input type="radio" name="gender" />
          <i className="form-icon"></i> Female
        </label>
      </div>
      <hr />

      <h3 className="text-primary">Checkbox</h3>
      <div className="form-group">
        <label className="form-checkbox">
          <input type="checkbox" />
          <i className="form-icon"></i> Remember me
        </label>
      </div>
      <hr />
      <h3 className="text-primary">Form switch</h3>
      <div className="form-group">
        <label className="form-switch">
          <input type="checkbox" />
          <i className="form-icon"></i> Send me emails with news and tips
        </label>
      </div>
      <hr />
      <h3 className="text-primary">Disabled State</h3>

      <fieldset disabled>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" type="text" id="input-example-19" placeholder="Name" />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <label className="form-radio">
            <input type="radio" name="gender" disabled />
            <i className="form-icon"></i> Male
          </label>
          <label className="form-radio">
            <input type="radio" name="gender" disabled />
            <i className="form-icon"></i> Female
          </label>
        </div>
        <div className="form-group">
          <select className="form-select" disabled>
            <option>Choose an option</option>
            <option>Slack</option>
            <option>Skype</option>
            <option>Hipchat</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-switch">
            <input type="checkbox" disabled />
            <i className="form-icon"></i> Send me emails with news and tips
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea
            className="form-input"
            id="input-example-20"
            placeholder="Textarea"
            disabled
          ></textarea>
        </div>
        <div className="form-group">
          <label className="form-checkbox">
            <input type="checkbox" disabled />
            <i className="form-icon"></i> Remember me
          </label>
        </div>
      </fieldset>

      <hr />
      <h3 className="text-primary">Inputs</h3>

      <div className="form-group">
        <select className="form-select">
          <option>Choose an option</option>
          <option>Slack</option>
          <option>Skype</option>
          <option>Hipchat</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label label-sm">Name</label>
        <input className="form-input" type="text" id="input-example-1" placeholder="Name" />
      </div>
      <div className="form-group">
        <label className="form-label label-sm">Message</label>
        <textarea className="form-input" id="input-example-3" placeholder="Textarea"></textarea>
      </div>

      <div className="form-group">
        <label className="form-label label-sm">Name</label>
        <input
          className="form-input is-success"
          type="text"
          id="input-example-1"
          placeholder="Name"
        />
        <div className="form-input-hint">The name is valid</div>
      </div>

      <div className="form-group has-error">
        <label className="form-label label-sm">Password</label>
        <input className="form-input" type="text" id="input-example-1" placeholder="Password" />
        <div className="form-input-hint">Passwords must have at least 8 characters.</div>
      </div>
      <hr />
      <br />
      <h3 className="text-primary">Inputs with icons</h3>
      <div className="form-group">
        <div className="has-icon-right">
          <input type="text" className="form-input" placeholder="..." />
          <i className="form-icon loading"></i>
        </div>
      </div>
      <br />
      <div className="form-group">
        <div className="has-icon-left">
          <input type="text" className="form-input" placeholder="..." />
          <i className="form-icon icon icon-check"></i>
        </div>
      </div>
      <br />
      <hr />
      <h2 className="text-primary">Labels</h2>
      <div className="p-2">
        <span className="label">default label</span>&nbsp;&nbsp;
        <span className="label label-primary">primary label</span>&nbsp;&nbsp;
        <span className="label label-secondary">secondary label</span>&nbsp;&nbsp;
        <span className="label label-success">success label</span>&nbsp;&nbsp;
        <span className="label label-warning">warning label</span>&nbsp;&nbsp;
        <span className="label label-error">error label</span>&nbsp;&nbsp;
      </div>
      <div className="p-2">
        <span className="label label-rounded">default label</span>&nbsp;
        <span className="label label-rounded label-primary">primary label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-secondary">secondary label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-success">success label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-warning">warning label</span>&nbsp;&nbsp;
        <span className="label label-rounded label-error">error label</span>&nbsp;&nbsp;
      </div>
      <hr />
      <h2 className="text-primary">Buttons</h2>
      <div className="p-2 m-2">
        <button className="btn">default button</button>&nbsp;
        <button className="btn btn-primary">primary button</button>&nbsp;
        <button className="btn btn-link">link button</button>&nbsp;
      </div>
      <div className="p-2 m-2">
        <button className="btn btn-active">active button</button>&nbsp;
        <button className="btn btn-success">success button</button>&nbsp;
        <button className="btn btn-error">error button</button>&nbsp;
        <button className="btn btn-warning">warning button</button>
      </div>
      <div className="p-2 m-2">
        <button className="btn btn-primary disabled">primary disabled</button>&nbsp;
        <button className="btn disabled">default disabled</button>&nbsp;
      </div>
      <div className="p-2 m-2">
        <button className="btn loading">button</button>&nbsp;
        <button className="btn btn-primary loading">primary button</button>
      </div>
    </div>
  );
};
