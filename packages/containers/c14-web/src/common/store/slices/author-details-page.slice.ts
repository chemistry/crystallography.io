import type { StateCreator } from 'zustand';
import { API_BASE_URL } from '../../config.js';
import { getStructures } from '../../../models/index.js';

export interface AuthorDetailsPageState {
  authorsDetailsPage: {
    meta: { total: number; pages: number; name: string };
    data: {
      structureById: Record<string, Record<string, unknown>>;
      structureIdsLoaded: number[];
      structureIds: number[];
    };
    error: string | null;
    isLoading: boolean;
  };
  fetchAuthorDetailsData: (params: { page: string; name: string }) => Promise<void>;
}

export const createAuthorDetailsPageSlice: StateCreator<AuthorDetailsPageState> = (set) => ({
  authorsDetailsPage: {
    meta: { total: 0, pages: 0, name: '' },
    data: { structureById: {}, structureIdsLoaded: [], structureIds: [] },
    error: null,
    isLoading: false,
  },
  fetchAuthorDetailsData: async ({ page, name }) => {
    try {
      const pageParsed = parseInt(page, 10);
      const pageQ = isFinite(pageParsed) ? pageParsed : 1;

      set((s) => ({
        authorsDetailsPage: { ...s.authorsDetailsPage, isLoading: true, error: null },
      }));

      const response = await fetch(
        `${API_BASE_URL}/api/v1/authors/${encodeURIComponent(name)}?page=${pageQ}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (data?.meta && data?.data && Array.isArray(data.data.results)) {
        set((s) => ({
          authorsDetailsPage: {
            ...s.authorsDetailsPage,
            data: { ...s.authorsDetailsPage.data, structureIdsLoaded: data.data.results },
            meta: data.meta || { total: 0, pages: 0, name: '' },
          },
        }));
        structuresToLoad = data.data.results;
      }

      const structures = await getStructures(structuresToLoad);
      const structureById: Record<string, Record<string, unknown>> = {};
      structures.data.forEach((el) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        authorsDetailsPage: {
          ...s.authorsDetailsPage,
          isLoading: false,
          data: {
            structureById,
            structureIds: s.authorsDetailsPage.data.structureIdsLoaded.slice(0),
            structureIdsLoaded: [],
          },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set((s) => ({
        authorsDetailsPage: { ...s.authorsDetailsPage, isLoading: false, error: message },
      }));
    }
  },
});
