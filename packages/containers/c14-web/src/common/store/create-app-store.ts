import { createStore } from 'zustand/vanilla';
import type { CatalogPageState } from './slices/catalog-page.slice.js';
import type { DetailsPageState } from './slices/details-page.slice.js';
import type { AuthorsListPageState } from './slices/author-list-page.slice.js';
import type { AuthorDetailsPageState } from './slices/author-details-page.slice.js';
import type { SearchByNameState } from './slices/search-by-name-page.slice.js';
import type { SearchByAuthorState } from './slices/search-by-author-page.slice.js';
import type { SearchByFormulaState } from './slices/search-by-formula-page.slice.js';
import type { SearchByUnitCellState } from './slices/search-by-unit-cell-page.slice.js';
import type { SearchByStructureState } from './slices/search-by-structure.slice.js';
import type { SearchResultsState } from './slices/search-results.slice.js';
import { createCatalogPageSlice } from './slices/catalog-page.slice.js';
import { createDetailsPageSlice } from './slices/details-page.slice.js';
import { createAuthorsListPageSlice } from './slices/author-list-page.slice.js';
import { createAuthorDetailsPageSlice } from './slices/author-details-page.slice.js';
import { createSearchByNameSlice } from './slices/search-by-name-page.slice.js';
import { createSearchByAuthorSlice } from './slices/search-by-author-page.slice.js';
import { createSearchByFormulaSlice } from './slices/search-by-formula-page.slice.js';
import { createSearchByUnitCellSlice } from './slices/search-by-unit-cell-page.slice.js';
import { createSearchByStructureSlice } from './slices/search-by-structure.slice.js';
import { createSearchResultsSlice } from './slices/search-results.slice.js';

export interface AppState
  extends
    CatalogPageState,
    DetailsPageState,
    AuthorsListPageState,
    AuthorDetailsPageState,
    SearchByNameState,
    SearchByAuthorState,
    SearchByFormulaState,
    SearchByUnitCellState,
    SearchByStructureState,
    SearchResultsState {}

export const createAppStore = (initialState?: Partial<AppState>) => {
  const store = createStore<AppState>()((...a) => ({
    ...createCatalogPageSlice(...a),
    ...createDetailsPageSlice(...a),
    ...createAuthorsListPageSlice(...a),
    ...createAuthorDetailsPageSlice(...a),
    ...createSearchByNameSlice(...a),
    ...createSearchByAuthorSlice(...a),
    ...createSearchByFormulaSlice(...a),
    ...createSearchByUnitCellSlice(...a),
    ...createSearchByStructureSlice(...a),
    ...createSearchResultsSlice(...a),
  }));

  if (initialState && Object.keys(initialState).length > 0) {
    store.setState(initialState);
  }

  return store;
};

export type AppStore = ReturnType<typeof createAppStore>;
