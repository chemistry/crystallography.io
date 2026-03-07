import type { StateCreator } from 'zustand';
import { getStructures } from '../../../models';

export interface AuthorDetailsPageState {
  authorsDetailsPage: {
    meta: { total: number; pages: number; name: string };
    data: {
      structureById: Record<string, any>;
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
        `https://crystallography.io/api/v1/authors/${encodeURIComponent(name)}?page=${pageQ}`,
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
      const structureById: Record<string, any> = {};
      structures.data.forEach((el: any) => {
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
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({
        authorsDetailsPage: { ...s.authorsDetailsPage, isLoading: false, error: message },
      }));
    }
  },
});
