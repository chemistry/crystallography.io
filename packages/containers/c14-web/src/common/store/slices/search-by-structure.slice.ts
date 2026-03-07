import type { StateCreator } from 'zustand';

export interface SearchByStructureState {
  searchByStructure: {
    meta: { id: string; status: string; progress: number; version: number; found: number; page: number; pagesAvailable: number };
    search: { molecule: any };
    data: { structureById: Record<string, any>; structureIds: number[] };
    error: string | null;
    isLoading: boolean;
  };
  searchStructureByStructure: (params: { molecule: any }) => Promise<string | null>;
}

export const createSearchByStructureSlice: StateCreator<SearchByStructureState> = (set) => ({
  searchByStructure: {
    meta: { id: '', status: 'new', progress: 0, version: 0, found: 0, page: 0, pagesAvailable: 0 },
    search: { molecule: {} },
    data: { structureById: {}, structureIds: [] },
    error: null,
    isLoading: false,
  },
  searchStructureByStructure: async ({ molecule }) => {
    try {
      set((s) => ({
        searchByStructure: {
          ...s.searchByStructure,
          search: { molecule },
          error: null,
          isLoading: true,
        },
      }));

      const response = await fetch('https://crystallography.io/api/v1/search/structure', {
        method: 'POST',
        body: `searchQuery=${encodeURIComponent(JSON.stringify(molecule))}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await response.json();

      let structuresToLoad: number[] = [];
      if (data.data?.results && Array.isArray(data.data.results)) {
        structuresToLoad = data.data.results;
      }

      set((s) => ({
        searchByStructure: {
          ...s.searchByStructure,
          meta: data.meta,
          data: { ...s.searchByStructure.data, structureIds: structuresToLoad.slice(0) },
          isLoading: true,
        },
      }));

      if (data?.meta?.id) {
        return data.meta.id;
      }
      return null;
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({
        searchByStructure: { ...s.searchByStructure, isLoading: false, error: message },
      }));
      return null;
    }
  },
});
