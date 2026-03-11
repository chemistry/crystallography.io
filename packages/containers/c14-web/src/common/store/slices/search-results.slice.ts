import type { StateCreator } from 'zustand';
import { API_BASE_URL } from '../../config.js';
import { getStructures } from '../../../models/index.js';

export enum SearchState {
  empty = 'empty',
  created = 'created',
  processing = 'processing',
  canceled = 'canceled',
  finished = 'finished',
  success = 'success',
  failed = 'failed',
}

export interface SearchResultsMeta {
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
    data: { structureById: Record<string, Record<string, unknown>>; structureIds: number[] };
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

      const response = await fetch(`${API_BASE_URL}/api/v1/search/structure/${id}?page=${page}`, {
        method: 'GET',
      });
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
      const structureById: Record<string, Record<string, unknown>> = {};
      structures.data.forEach((el) => {
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
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
      const response2 = await fetch(`${API_BASE_URL}/api/v1/structure`, {
        method: 'POST',
        body: `ids=[${structuresToLoad.join(',')}]`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const res2 = await response2.json();

      const structureById: Record<string, Record<string, unknown>> = {};
      const resData = res2.data as { id: string; attributes: Record<string, unknown> }[];
      resData.forEach((el) => {
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
