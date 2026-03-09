import type { StateCreator } from 'zustand';
import { getStructures, getCatalogContent } from '../../../models/index.js';

export interface CatalogPageState {
  catalogPage: {
    meta: { pages: number };
    data: {
      structureById: Record<string, Record<string, unknown>>;
      structureIdsLoaded: number[];
      structureIds: number[];
    };
    error: string | null;
    isLoading: boolean;
  };
  fetchCatalogData: (params: { page: string }) => Promise<void>;
}

export const createCatalogPageSlice: StateCreator<CatalogPageState> = (set) => ({
  catalogPage: {
    meta: { pages: 0 },
    data: { structureById: {}, structureIdsLoaded: [], structureIds: [] },
    error: null,
    isLoading: false,
  },
  fetchCatalogData: async ({ page }) => {
    try {
      const pageParsed = parseInt(page, 10);
      const pageQ = isFinite(pageParsed) ? pageParsed : 1;

      set((s) => ({ catalogPage: { ...s.catalogPage, isLoading: true, error: null } }));

      const { meta, structures } = await getCatalogContent(pageQ);

      set((s) => ({
        catalogPage: {
          ...s.catalogPage,
          isLoading: true,
          data: { ...s.catalogPage.data, structureIdsLoaded: structures },
          meta,
        },
      }));

      const structuresData = await getStructures(structures);
      const structureById: Record<string, Record<string, unknown>> = {};
      structuresData.data.forEach((el) => {
        structureById[el.id] = el.attributes;
      });

      set((s) => ({
        catalogPage: {
          ...s.catalogPage,
          isLoading: false,
          data: {
            structureById,
            structureIds: s.catalogPage.data.structureIdsLoaded,
            structureIdsLoaded: [],
          },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set((s) => ({ catalogPage: { ...s.catalogPage, isLoading: false, error: message } }));
    }
  },
});
