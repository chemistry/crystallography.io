import type { StateCreator } from 'zustand';
import { getAuthorsList } from '../../../models';

export interface AuthorsListPageState {
  authorsListPage: {
    meta: { total: number; pages: number };
    data: { authorsList: any[] };
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

      let authors: any[] = [];
      if (Array.isArray(data.data)) {
        authors = data.data.map((el: any) => ({
          id: el.id,
          ...el.attributes,
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
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const message = Array.isArray(errors) && errors.length > 0 ? errors[0].title : err.toString();
      set((s) => ({ authorsListPage: { ...s.authorsListPage, isLoading: false, error: message } }));
    }
  },
});
