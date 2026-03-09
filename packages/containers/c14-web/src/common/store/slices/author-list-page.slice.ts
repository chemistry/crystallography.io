import type { StateCreator } from 'zustand';
import { getAuthorsList } from '../../../models/index.js';

export interface AuthorsListPageState {
  authorsListPage: {
    meta: { total: number; pages: number };
    data: { authorsList: { full: string; count: number; updated: string; id: number }[] };
    error: string | null;
    isLoading: boolean;
  };
  fetchAuthorsListData: (params: { page: string }) => Promise<void>;
}

export const createAuthorsListPageSlice: StateCreator<AuthorsListPageState> = (set) => ({
  authorsListPage: {
    meta: { total: 0, pages: 0 },
    data: { authorsList: [] },
    error: null,
    isLoading: false,
  },
  fetchAuthorsListData: async ({ page }) => {
    try {
      const pageParsed = parseInt(page, 10);
      const pageQ = isFinite(pageParsed) ? pageParsed : 1;

      set((s) => ({ authorsListPage: { ...s.authorsListPage, isLoading: true, error: null } }));

      const data = await getAuthorsList(pageQ);

      let authors: { full: string; count: number; updated: string; id: number }[] = [];
      if (Array.isArray(data.data)) {
        authors = data.data.map((el) => ({
          id: el.id,
          full: el.attributes.full,
          count: el.attributes.count,
          updated: el.attributes.updated,
        }));
      }

      set((s) => ({
        authorsListPage: {
          ...s.authorsListPage,
          isLoading: false,
          data: { authorsList: authors },
          meta: data.meta || { total: 0, pages: 0 },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set((s) => ({ authorsListPage: { ...s.authorsListPage, isLoading: false, error: message } }));
    }
  },
});
