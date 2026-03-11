import type { StateCreator } from 'zustand';
import { API_BASE_URL } from '../../config.js';
import { getStructures } from '../../../models/index.js';

export enum SearchState {
  empty,
  started,
  processing,
  success,
  failed,
}

export interface SearchByAuthorState {
  searchByAuthorSlice: {
    data: { structureById: Record<string, Record<string, unknown>>; structureIds: number[] };
    meta: { totalPages: number; totalResults: number; searchString: string };
    search: { page: number; name: string };
    status: SearchState;
    error: string | null;
    isLoading: boolean;
  };
  searchStructureByAuthor: (params: { name: string; page: number }) => Promise<void>;
}

export const createSearchByAuthorSlice: StateCreator<SearchByAuthorState> = (set) => ({
  searchByAuthorSlice: {
    data: { structureById: {}, structureIds: [] },
    meta: { totalPages: 0, totalResults: 0, searchString: '' },
    search: { page: 1, name: '' },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  searchStructureByAuthor: async ({ name, page }) => {
    try {
      set((s) => ({
        searchByAuthorSlice: {
          ...s.searchByAuthorSlice,
          data: { structureById: {}, structureIds: [] },
          search: { name, page },
          isLoading: true,
          error: null,
          status: SearchState.started,
        },
      }));

      const response = await fetch(`${API_BASE_URL}/api/v1/search/author`, {
        method: 'POST',
        body: `page=${page}&name=${encodeURIComponent(name)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (data.data?.structures && Array.isArray(data.data.structures)) {
        structuresToLoad = data.data.structures;
      }

      set((s) => ({
        searchByAuthorSlice: {
          ...s.searchByAuthorSlice,
          data: { ...s.searchByAuthorSlice.data, structureIds: structuresToLoad },
          status: SearchState.processing,
          meta: {
            totalPages: data.meta?.pages || 0,
            totalResults: data.meta?.total || 0,
            searchString: data.meta?.searchString || '',
          },
        },
      }));

      const structures = await getStructures(structuresToLoad);
      const structureById: Record<string, Record<string, unknown>> = {};
      structures.data.forEach((el) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        searchByAuthorSlice: {
          ...s.searchByAuthorSlice,
          isLoading: false,
          status: SearchState.success,
          data: { ...s.searchByAuthorSlice.data, structureById },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set((s) => ({
        searchByAuthorSlice: {
          ...s.searchByAuthorSlice,
          isLoading: false,
          status: SearchState.failed,
          error: message,
        },
      }));
    }
  },
});
