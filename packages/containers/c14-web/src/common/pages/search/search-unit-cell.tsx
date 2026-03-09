import { useRef, useState, type FormEvent } from 'react';
import { useAppStore } from '../../store/index.js';
import { Loader, NoSearchResults, Pagination, SearchTab } from '../../components/index.js';
import { StructuresList } from '../../components/structure-list/structure-list.js';
import type { StructureModel } from '../../models/index.js';
import { ErrorToast } from '../../components/toast/index.js';
import { SearchState } from '../../store/slices/search-by-unit-cell-page.slice.js';
import { useValidationError } from './common/index.js';

const getPramsValidators = (param: string) => {
  return [
    {
      type: 'required',
      isValid(value: string) {
        return value !== '';
      },
      message: `Param ${param} can not be empty`,
    },
    {
      type: 'number',
      isValid(value: string) {
        return !isNaN(parseFloat(value));
      },
      message: `Param ${param} should be a valid number`,
    },
    {
      type: 'range',
      isValid(value: string) {
        const v = parseFloat(value);
        return v > 0 && v < 1000;
      },
      message: `Param ${param} should be in range 0...1000`,
    },
  ];
};

const _getAngleValidators = (param: string) => {
  return [
    {
      type: 'required',
      isValid(value: string) {
        return value !== '';
      },
      message: `Param ${param} can not be empty`,
    },
    {
      type: 'number',
      isValid(value: string) {
        return !isNaN(parseFloat(value));
      },
      message: `Param ${param} should be a valid number`,
    },
    {
      type: 'range',
      isValid(value: string) {
        const v = parseFloat(value);
        return v > 2 && v < 180;
      },
      message: `Param ${param} should be in range 2...180`,
    },
  ];
};

const toleranceValidators = [
  {
    type: 'required',
    isValid(value: string) {
      return value !== '';
    },
    message: 'Param tolerance can not be empty',
  },
  {
    type: 'number',
    isValid(value: string) {
      return !isNaN(parseFloat(value));
    },
    message: 'Param tolerance should be a valid number',
  },
  {
    type: 'range',
    isValid(value: string) {
      const v = parseFloat(value);
      return v > 0 && v < 100;
    },
    message: 'Param tolerance should be in range 0...100',
  },
];

interface FormInitialValue {
  a: string;
  b: string;
  c: string;
  alpha: string;
  beta: string;
  gamma: string;
  tolerance: string;
}

interface SearchFormData {
  a: string;
  b: string;
  c: string;
  alpha: string;
  beta: string;
  gamma: string;
  tolerance: string;
}

const SearchByUnitCellForm = ({
  onSubmit,
  initialValue,
}: {
  initialValue: FormInitialValue;
  onSubmit: (data: SearchFormData) => void;
}) => {
  const [a, setA] = useState(initialValue.a);
  const [b, setB] = useState(initialValue.b);
  const [c, setC] = useState(initialValue.c);
  const [alpha, setAlpha] = useState(initialValue.alpha);
  const [beta, setBeta] = useState(initialValue.beta);
  const [gamma, setGamma] = useState(initialValue.gamma);
  const [tolerance, setTolerance] = useState(initialValue.tolerance);

  const aError = useValidationError(getPramsValidators('a'), a);
  const bError = useValidationError(getPramsValidators('b'), b);
  const cError = useValidationError(getPramsValidators('c'), c);

  const alphaError = useValidationError(getPramsValidators('alpha'), alpha);
  const betaError = useValidationError(getPramsValidators('beta'), beta);
  const gammaError = useValidationError(getPramsValidators('gamma'), gamma);
  const toleranceError = useValidationError(toleranceValidators, tolerance);

  const error =
    aError || bError || cError || alphaError || betaError || gammaError || toleranceError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ a, b, c, alpha, beta, gamma, tolerance });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="search-layout__search_form">
        <div className="columns">
          <div className="column col-6">
            <label className="form-label">a</label>
            <input
              type="text"
              className="form-input"
              name="name"
              autoComplete="off"
              onChange={(e) => {
                setA(e.target.value);
              }}
              value={a}
            ></input>
          </div>
          <div className="column col-6">
            <label className="form-label">α</label>
            <input
              type="text"
              className="form-input"
              name="name"
              autoComplete="off"
              onChange={(e) => {
                setAlpha(e.target.value);
              }}
              value={alpha}
            ></input>
          </div>
        </div>
        <div className="columns">
          <div className="column col-6">
            <label className="form-label">b</label>
            <input
              type="text"
              className="form-input"
              name="name"
              autoComplete="off"
              onChange={(e) => {
                setB(e.target.value);
              }}
              value={b}
            ></input>
          </div>
          <div className="column col-6">
            <label className="form-label">β</label>
            <input
              type="text"
              className="form-input"
              name="name"
              autoComplete="off"
              value={beta}
              onChange={(e) => {
                setBeta(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <div className="columns">
          <div className="column col-6">
            <label className="form-label">c</label>
            <input
              type="text"
              className="form-input"
              name="name"
              autoComplete="off"
              onChange={(e) => {
                setC(e.target.value);
              }}
              value={c}
            ></input>
          </div>
          <div className="column col-6">
            <label className="form-label">γ</label>
            <input
              type="text"
              className="form-input"
              name="name"
              autoComplete="off"
              value={gamma}
              onChange={(e) => {
                setGamma(e.target.value);
              }}
            ></input>
          </div>
        </div>

        <div className="columns">
          <div className="column col-12">
            <label className="form-label">tolerance (%)</label>
            <input
              type="text"
              className="form-input"
              name="tolerance"
              autoComplete="off"
              value={tolerance}
              onChange={(e) => {
                setTolerance(e.target.value);
              }}
            ></input>
          </div>
        </div>

        <div className="columns search-layout__search_row">
          <div className="column col-6">
            <button
              className="btn btn-active input-inline search-layout__search_btn"
              disabled={!!error}
              title={error}
            >
              Search
            </button>
          </div>
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
  const isLoading = useAppStore((s) => s.searchByUnitCellSlice.isLoading);
  const structures = useAppStore((s) => {
    const structuresIds = s.searchByUnitCellSlice.data.structureIds;
    const structuresById = s.searchByUnitCellSlice.data.structureById;
    return structuresIds
      .map((id) => structuresById[id])
      .filter((item) => !!item) as unknown as StructureModel[];
  });
  const currentPage = useAppStore((s) => s.searchByUnitCellSlice.search.page);
  const totalPages = useAppStore((s) => s.searchByUnitCellSlice.meta.totalPages);
  const error = useAppStore((s) => s.searchByUnitCellSlice.error);
  const hasNoResults = useAppStore((s) => {
    const status = s.searchByUnitCellSlice.status;
    const resultCount = Object.keys(s.searchByUnitCellSlice.data.structureById).length;
    return status === SearchState.success && resultCount === 0;
  });
  const totalResults = useAppStore((s) => {
    return Math.max(
      Object.keys(s.searchByUnitCellSlice.data.structureById).length,
      s.searchByUnitCellSlice.meta.totalResults
    );
  });
  const search = useAppStore((s) => s.searchByUnitCellSlice.search);

  const showSummary = useAppStore((s) => {
    const status = s.searchByUnitCellSlice.status;
    const resultCount = Math.max(
      Object.keys(s.searchByUnitCellSlice.data.structureById).length,
      s.searchByUnitCellSlice.meta.totalResults
    );
    return (
      resultCount !== 0 &&
      [SearchState.processing, SearchState.started, SearchState.success].includes(status)
    );
  });

  const searchByUnitCell = useAppStore((s) => s.searchByUnitCell);

  const onPageNavigate = (page: number) => {
    searchByUnitCell({ ...search, page });
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

export const SearchByUnitCellPage = () => {
  const { a, b, c, alpha, beta, gamma, tolerance } = useAppStore(
    (s) => s.searchByUnitCellSlice.search
  );
  const searchByUnitCell = useAppStore((s) => s.searchByUnitCell);

  const handleSubmit = (data: SearchFormData) => {
    searchByUnitCell({ ...data, page: 1 });
  };

  return (
    <div className="search-layout-tabs">
      <header className="app-layout-header">
        <h2 className="text-primary">Crystal Structure Search</h2>
        <SearchTab />
      </header>
      <div className="app-layout-content">
        <div className="search-layout__page">
          <div>
            <SearchByUnitCellForm
              onSubmit={handleSubmit}
              initialValue={{ a, b, c, alpha, beta, gamma, tolerance }}
            />
          </div>
          <div>
            <SearchResults />
          </div>
        </div>
      </div>
    </div>
  );
};
