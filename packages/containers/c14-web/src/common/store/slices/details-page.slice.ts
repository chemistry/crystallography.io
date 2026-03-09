import type { StateCreator } from 'zustand';

export interface DetailsPageState {
  detailsPage: {
    data: { details: Record<string, unknown> };
    error: string | null;
    isLoading: boolean;
  };
  fetchStructureDetailsData: (params: { id: string }) => Promise<void>;
}

export const createDetailsPageSlice: StateCreator<DetailsPageState> = (set) => ({
  detailsPage: {
    data: { details: {} },
    error: null,
    isLoading: false,
  },
  fetchStructureDetailsData: async ({ id }) => {
    try {
      set((s) => ({
        detailsPage: { ...s.detailsPage, isLoading: true, error: null, data: { details: {} } },
      }));

      const response = await fetch('https://crystallography.io/api/v1/structure', {
        method: 'POST',
        body: `ids=[${id}]&expand=true`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const res = await response.json();
      const data = res.data;

      let details: Record<string, unknown> = {};
      if (Array.isArray(data) && data.length === 1 && data[0].attributes) {
        details = data[0].attributes;
      }

      set((s) => ({
        detailsPage: { ...s.detailsPage, isLoading: true, data: { details } },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set((s) => ({ detailsPage: { ...s.detailsPage, isLoading: false, error: message } }));
    }
  },
});
