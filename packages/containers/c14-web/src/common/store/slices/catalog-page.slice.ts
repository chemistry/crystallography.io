import type { StateCreator } from 'zustand';
import { getStructures, getCatalogContent } from '../../../models';

export interface CatalogPageState {
  catalogPage: {
    meta: { pages: number };
    data: { structureById: Record<string, any>; structureIdsLoaded: number[]; structureIds: number[] };
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
      const structureById: Record<string, any> = {};
      structuresData.data.forEach((el: any) => {
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
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({ catalogPage: { ...s.catalogPage, isLoading: false, error: message } }));
    }
  },
});
