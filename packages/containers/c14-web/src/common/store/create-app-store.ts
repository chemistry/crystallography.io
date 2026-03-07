import { createStore } from 'zustand/vanilla';
import type { CatalogPageState } from './slices/catalog-page.slice';
import type { DetailsPageState } from './slices/details-page.slice';
import type { AuthorsListPageState } from './slices/author-list-page.slice';
import type { AuthorDetailsPageState } from './slices/author-details-page.slice';
import type { SearchByNameState } from './slices/search-by-name-page.slice';
import type { SearchByAuthorState } from './slices/search-by-author-page.slice';
import type { SearchByFormulaState } from './slices/search-by-formula-page.slice';
import type { SearchByUnitCellState } from './slices/search-by-unit-cell-page.slice';
import type { SearchByStructureState } from './slices/search-by-structure.slice';
import type { SearchResultsState } from './slices/search-results.slice';
import type { UserState } from './slices/user.slice';
import { createCatalogPageSlice } from './slices/catalog-page.slice';
import { createDetailsPageSlice } from './slices/details-page.slice';
import { createAuthorsListPageSlice } from './slices/author-list-page.slice';
import { createAuthorDetailsPageSlice } from './slices/author-details-page.slice';
import { createSearchByNameSlice } from './slices/search-by-name-page.slice';
import { createSearchByAuthorSlice } from './slices/search-by-author-page.slice';
import { createSearchByFormulaSlice } from './slices/search-by-formula-page.slice';
import { createSearchByUnitCellSlice } from './slices/search-by-unit-cell-page.slice';
import { createSearchByStructureSlice } from './slices/search-by-structure.slice';
import { createSearchResultsSlice } from './slices/search-results.slice';
import { createUserSlice } from './slices/user.slice';

export interface AppState
  extends CatalogPageState,
    DetailsPageState,
    AuthorsListPageState,
    AuthorDetailsPageState,
    SearchByNameState,
    SearchByAuthorState,
    SearchByFormulaState,
    SearchByUnitCellState,
    SearchByStructureState,
    SearchResultsState,
    UserState {}

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
    ...createUserSlice(...a),
  }));

  if (initialState && Object.keys(initialState).length > 0) {
    store.setState(initialState);
  }

  return store;
};

export type AppStore = ReturnType<typeof createAppStore>;
