import type { StateCreator } from 'zustand';
import { getStructures } from '../../../models';

export enum SearchState {
  empty,
  started,
  processing,
  success,
  failed,
}

export interface SearchByNameState {
  searchByNameSlice: {
    data: { structureById: Record<string, any>; structureIds: number[] };
    meta: { totalPages: number; totalResults: number; searchString: string };
    search: { page: number; name: string };
    status: SearchState;
    error: string | null;
    isLoading: boolean;
  };
  searchStructureByName: (params: { name: string; page: number }) => Promise<void>;
}

export const createSearchByNameSlice: StateCreator<SearchByNameState> = (set) => ({
  searchByNameSlice: {
    data: { structureById: {}, structureIds: [] },
    meta: { totalPages: 0, totalResults: 0, searchString: '' },
    search: { page: 1, name: '' },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  searchStructureByName: async ({ name, page }) => {
    try {
      set((s) => ({
        searchByNameSlice: {
          ...s.searchByNameSlice,
          data: { structureById: {}, structureIds: [] },
          search: { name, page },
          isLoading: true,
          error: null,
          status: SearchState.started,
        },
      }));

      const response = await fetch('https://crystallography.io/api/v1/search/name', {
        method: 'POST',
        body: `page=${page}&name=${encodeURIComponent(name)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (Array.isArray(data.data)) {
        structuresToLoad = data.data.map(({ id }: { id: number }) => id);
      }

      set((s) => ({
        searchByNameSlice: {
          ...s.searchByNameSlice,
          data: { ...s.searchByNameSlice.data, structureIds: structuresToLoad },
          status: SearchState.processing,
          meta: {
            totalPages: data.meta?.pages || 0,
            totalResults: data.meta?.total || 0,
            searchString: data.meta?.searchString || '',
          },
        },
      }));

      const structures = await getStructures(structuresToLoad);
      const structureById: Record<string, any> = {};
      structures.data.forEach((el: any) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        searchByNameSlice: {
          ...s.searchByNameSlice,
          isLoading: false,
          status: SearchState.success,
          data: { ...s.searchByNameSlice.data, structureById },
        },
      }));
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({
        searchByNameSlice: {
          ...s.searchByNameSlice,
          isLoading: false,
          status: SearchState.failed,
          error: message,
        },
      }));
    }
  },
});
