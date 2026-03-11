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

interface UnitCellSearch {
  a: string;
  b: string;
  c: string;
  alpha: string;
  beta: string;
  gamma: string;
  tolerance: string;
  page: number;
}

export interface SearchByUnitCellState {
  searchByUnitCellSlice: {
    data: { structureById: Record<string, Record<string, unknown>>; structureIds: number[] };
    meta: { totalPages: number; totalResults: number };
    search: UnitCellSearch;
    status: SearchState;
    error: string | null;
    isLoading: boolean;
  };
  searchByUnitCell: (params: UnitCellSearch) => Promise<void>;
}

export const createSearchByUnitCellSlice: StateCreator<SearchByUnitCellState> = (set) => ({
  searchByUnitCellSlice: {
    data: { structureById: {}, structureIds: [] },
    meta: { totalPages: 0, totalResults: 0 },
    search: {
      a: '',
      b: '',
      c: '',
      alpha: '90.0',
      beta: '90.0',
      gamma: '90.0',
      tolerance: '1.5',
      page: 1,
    },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  searchByUnitCell: async ({ a, b, c, alpha, beta, gamma, tolerance, page }) => {
    try {
      set((s) => ({
        searchByUnitCellSlice: {
          ...s.searchByUnitCellSlice,
          data: { structureById: {}, structureIds: [] },
          search: { a, b, c, alpha, beta, gamma, tolerance, page },
          isLoading: true,
          error: null,
          status: SearchState.started,
        },
      }));

      const body = `page=${page}&a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&c=${encodeURIComponent(c)}&alpha=${encodeURIComponent(alpha)}&beta=${encodeURIComponent(beta)}&gamma=${encodeURIComponent(gamma)}&tolerance=${encodeURIComponent(tolerance)}`;
      const response = await fetch(`${API_BASE_URL}/api/v1/search/unit-cell`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (data.data?.structures && Array.isArray(data.data.structures)) {
        structuresToLoad = data.data.structures;
      }

      set((s) => ({
        searchByUnitCellSlice: {
          ...s.searchByUnitCellSlice,
          data: { ...s.searchByUnitCellSlice.data, structureIds: structuresToLoad },
          status: SearchState.processing,
          meta: { totalPages: data.meta?.pages || 0, totalResults: data.meta?.total || 0 },
        },
      }));

      const structures = await getStructures(structuresToLoad);
      const structureById: Record<string, Record<string, unknown>> = {};
      structures.data.forEach((el) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        searchByUnitCellSlice: {
          ...s.searchByUnitCellSlice,
          isLoading: false,
          status: SearchState.success,
          data: { ...s.searchByUnitCellSlice.data, structureById },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set((s) => ({
        searchByUnitCellSlice: {
          ...s.searchByUnitCellSlice,
          isLoading: false,
          status: SearchState.failed,
          error: message,
        },
      }));
    }
  },
});
