import type { StateCreator } from 'zustand';
import { getStructures } from '../../../models';

export enum SearchState {
  empty = 'empty',
  created = 'created',
  processing = 'processing',
  canceled = 'canceled',
  finished = 'finished',
  success = 'success',
  failed = 'failed',
}

interface SearchResultsMeta {
  id: string;
  status: SearchState;
  progress: number;
  version: number;
  found: number;
  page: number;
  pagesAvailable: number;
}

const parsePage = (page?: string): number => {
  const currentPage = parseInt(page as string, 10);
  return currentPage && isFinite(currentPage) ? currentPage : 1;
};

export interface SearchResultsState {
  searchResults: {
    meta: SearchResultsMeta;
    data: { structureById: Record<string, any>; structureIds: number[] };
    status: SearchState;
    error: string | null;
    isLoading: boolean;
  };
  fetchSearchResultsData: (params: { id: string; page: string }) => Promise<void>;
  updateSearchResults: (data: {
    meta: SearchResultsMeta;
    data: { results: number[] };
  }) => Promise<void>;
}

export const createSearchResultsSlice: StateCreator<SearchResultsState> = (set, get) => ({
  searchResults: {
    meta: {
      id: '',
      status: SearchState.empty,
      progress: 0,
      version: 0,
      found: 0,
      page: 0,
      pagesAvailable: 0,
    },
    data: { structureById: {}, structureIds: [] },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  fetchSearchResultsData: async ({ id, page }) => {
    try {
      set((s) => ({
        searchResults: {
          ...s.searchResults,
          meta: { ...s.searchResults.meta, id, page: parsePage(page) },
          error: null,
          isLoading: true,
        },
      }));

      const response = await fetch(
        `https://crystallography.io/api/v1/search/structure/${id}?page=${page}`,
        { method: 'GET' }
      );
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (data.data?.results && Array.isArray(data.data.results)) {
        structuresToLoad = data.data.results;
      }

      set((s) => ({
        searchResults: {
          ...s.searchResults,
          meta: data.meta,
          data: { ...s.searchResults.data, structureIds: structuresToLoad.slice(0) },
          isLoading: false,
        },
      }));

      const structures = await getStructures(structuresToLoad);
      const structureById: Record<string, any> = {};
      structures.data.forEach((el: any) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        searchResults: {
          ...s.searchResults,
          data: {
            ...s.searchResults.data,
            structureById: { ...structureById, ...s.searchResults.data.structureById },
          },
        },
      }));
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({
        searchResults: {
          ...s.searchResults,
          isLoading: false,
          status: SearchState.failed,
          error: message,
        },
      }));
    }
  },
  updateSearchResults: async (data) => {
    let structuresToLoad: number[] = [];
    if (data.data?.results && Array.isArray(data.data.results)) {
      structuresToLoad = data.data.results;
    }

    const state = get();
    const existingIds = state.searchResults.data.structureIds;

    set((s) => ({
      searchResults: {
        ...s.searchResults,
        meta: data.meta,
        data: { ...s.searchResults.data, structureIds: structuresToLoad.slice(0) },
        isLoading: false,
      },
    }));

    const newStructures = structuresToLoad.filter((x) => !existingIds.includes(x));

    if (newStructures.length > 0) {
      const response2 = await fetch('https://crystallography.io/api/v1/structure', {
        method: 'POST',
        body: `ids=[${structuresToLoad.join(',')}]`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const res2 = await response2.json();

      const structureById: Record<string, any> = {};
      res2.data.forEach((el: any) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        searchResults: {
          ...s.searchResults,
          data: {
            ...s.searchResults.data,
            structureById: { ...structureById, ...s.searchResults.data.structureById },
          },
        },
      }));
    }
  },
});
