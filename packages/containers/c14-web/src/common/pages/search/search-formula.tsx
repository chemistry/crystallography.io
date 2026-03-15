import { useState, useRef, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { useAppStore } from '../../store/index.js';
import { Loader, NoSearchResults, Pagination, SearchTab } from '../../components/index.js';
import { StructuresList } from '../../components/structure-list/structure-list.js';
import type { StructureModel } from '../../models/index.js';
import { ErrorToast } from '../../components/toast/index.js';
import { SearchState } from '../../store/slices/search-by-formula-page.slice.js';
import { useValidationError, type Validator } from './common/index.js';

interface SearchFormData {
  formula: string;
}

const nonEmptyValidator: Validator = {
  type: 'empty',
  isValid(value: string) {
    return value !== '';
  },
  message: 'Formula can not be empty',
};

const formulaValidator: Validator = {
  type: 'formula',
  isValid(value: string) {
    const s1 =
      /^((He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Q|H|D|B|C|N|O|F|P|S|K|V|Y|I|W|U){1,1}[*0-9]{0,10})+$/;

    if (!value.match(s1)) {
      return false;
    }
    return true;
  },
  message: 'Incorrect Formula (correct examples: C6H6, C12H*N2, CuSO4)',
};

const SearchByFormulaForm = ({
  onSubmit,
  initialValue,
}: {
  initialValue: string;
  onSubmit: (data: SearchFormData) => void;
}) => {
  const [value, setValue] = useState(initialValue);
  const error = useValidationError([nonEmptyValidator, formulaValidator], value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value) {
      onSubmit({ formula: value });
    }
  };
  const onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
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
          <div className="c-form-input">
            <input
              type="text"
              className="form-input"
              name="formula"
              autoComplete="off"
              value={value}
              onChange={onValueChange}
            />
          </div>
          <button className="form-button btn" disabled={!!error} title={error}>
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
  const isLoading = useAppStore((s) => s.searchByFormulaSlice.isLoading);
  const structureIds = useAppStore((s) => s.searchByFormulaSlice.data.structureIds);
  const structureById = useAppStore((s) => s.searchByFormulaSlice.data.structureById);
  const structures = useMemo(
    () =>
      structureIds
        .map((id) => structureById[id])
        .filter((item) => !!item) as unknown as StructureModel[],
    [structureIds, structureById]
  );
  const currentPage = useAppStore((s) => s.searchByFormulaSlice.search.page);
  const searchString = useAppStore((s) => s.searchByFormulaSlice.search.formula);
  const error = useAppStore((s) => s.searchByFormulaSlice.error);
  const totalPages = useAppStore((s) => s.searchByFormulaSlice.meta.totalPages);
  const status = useAppStore((s) => s.searchByFormulaSlice.status);
  const metaTotalResults = useAppStore((s) => s.searchByFormulaSlice.meta.totalResults);
  const totalResults = useMemo(
    () => Math.max(Object.keys(structureById).length, metaTotalResults),
    [structureById, metaTotalResults]
  );
  const hasNoResults = status === SearchState.success && totalResults === 0;
  const showSummary =
    totalResults !== 0 &&
    [SearchState.processing, SearchState.started, SearchState.success].includes(status);

  const searchStructureByFormula = useAppStore((s) => s.searchStructureByFormula);

  const onPageNavigate = (page: number) => {
    searchStructureByFormula({ formula: searchString, page });
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

export const SearchByFormulaPage = () => {
  const currentPage = useAppStore((s) => s.searchByFormulaSlice.search.page);
  const searchStructureByFormula = useAppStore((s) => s.searchStructureByFormula);

  const handleSubmit = (data: SearchFormData) => {
    searchStructureByFormula({ ...data, page: currentPage });
  };
  const searchString = useAppStore((s) => s.searchByFormulaSlice.search.formula);

  return (
    <div className="search-layout-tabs">
      <header className="app-layout-header">
        <h2 className="text-primary">Crystal Structure Search</h2>
        <SearchTab />
      </header>
      <div className="app-layout-content">
        <div className="search-layout__page">
          <div>
            <SearchByFormulaForm onSubmit={handleSubmit} initialValue={searchString} />
          </div>
          <div>
            <SearchResults />
          </div>
        </div>
      </div>
    </div>
  );
};
