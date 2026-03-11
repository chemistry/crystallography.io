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

export interface SearchByFormulaState {
  searchByFormulaSlice: {
    data: { structureById: Record<string, Record<string, unknown>>; structureIds: number[] };
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

      const response = await fetch(`${API_BASE_URL}/api/v1/search/formula`, {
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
      const structureById: Record<string, Record<string, unknown>> = {};
      structures.data.forEach((el) => {
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
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
