import type { StateCreator } from 'zustand';
import { getStructures } from '../../../models';

export enum SearchState {
  empty,
  started,
  processing,
  success,
  failed,
}

export interface SearchByFormulaState {
  searchByFormulaSlice: {
    data: { structureById: Record<string, any>; structureIds: number[] };
    meta: { totalPages: number; totalResults: number; searchString: string };
    search: { page: number; formula: string };
    status: SearchState;
    error: string | null;
    isLoading: boolean;
  };
  searchStructureByFormula: (params: { formula: string; page: number }) => Promise<void>;
}

export const createSearchByFormulaSlice: StateCreator<SearchByFormulaState> = (set) => ({
  searchByFormulaSlice: {
    data: { structureById: {}, structureIds: [] },
    meta: { totalPages: 0, totalResults: 0, searchString: '' },
    search: { page: 1, formula: '' },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  searchStructureByFormula: async ({ formula, page }) => {
    try {
      set((s) => ({
        searchByFormulaSlice: {
          ...s.searchByFormulaSlice,
          data: { structureById: {}, structureIds: [] },
          search: { formula, page },
          isLoading: true,
          error: null,
          status: SearchState.started,
        },
      }));

      const response = await fetch('https://crystallography.io/api/v1/search/formula', {
        method: 'POST',
        body: `page=${page}&formula=${encodeURIComponent(formula)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (data.data?.structures && Array.isArray(data.data.structures)) {
        structuresToLoad = data.data.structures;
      }

      set((s) => ({
        searchByFormulaSlice: {
          ...s.searchByFormulaSlice,
          data: { ...s.searchByFormulaSlice.data, structureIds: structuresToLoad },
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
        searchByFormulaSlice: {
          ...s.searchByFormulaSlice,
          isLoading: false,
          status: SearchState.success,
          data: { ...s.searchByFormulaSlice.data, structureById },
        },
      }));
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({
        searchByFormulaSlice: {
          ...s.searchByFormulaSlice,
          isLoading: false,
          status: SearchState.failed,
          error: message,
        },
      }));
    }
  },
});
