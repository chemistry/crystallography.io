import { createSlice } from "@reduxjs/toolkit";
import { getStructures } from "../../models";
import { AppThunk } from "./common";

export enum SearchState {
    empty,
    started,
    processing,
    success,
    failed
}

const searchByUnitCellSlice = createSlice({
  name: "searchByUnitCell",
  initialState: {
    data: {
        structureById: {},
        structureIds: [],
    },
    meta: {
        totalPages: 0,
        totalResults: 0,
    },
    search: {
        a: '', b: '', c: '', alpha: '90.0', beta: '90.0', gamma: '90.0', tolerance: '1.5',
        page: 1
    },
    status: SearchState.empty,
    name: '',
    error: null,
    isLoading: false,
  },
  reducers: {
    searchByUnitCellStart(state, action: {payload : {
        a: string, b: string, c: string, alpha: string, beta: string,
        gamma: string, tolerance: string, page: number
    }}) {
        const { payload } = action;
        const { a, b, c, alpha, beta, gamma, tolerance, page } = payload;
        state.data = {
            structureById: {},
            structureIds: [],
        };
        state.search = { a, b, c, alpha, beta, gamma, tolerance, page };
        state.isLoading = true;
        state.error = null;
        state.status = SearchState.started;
    },

    searchByUnitCellIdsSuccess(state, action: {
        payload: { ids: number[], meta: { pages: number, total: number } }
    }) {
        const { payload } = action;
        const { ids, meta } = payload;
        const { pages, total } = meta;

        state.data.structureIds = ids;
        state.status = SearchState.processing;
        state.meta.totalPages = pages;
        state.meta.totalResults = total;

        state.isLoading = true;
        state.error = null;
    },
    loadStructureListSuccess(state, { payload }) {
        state.isLoading = false;
        state.error = null;
        state.status = SearchState.success;
        const structures: any = { };
        payload.data.forEach((element: any) => {
            structures[element.id] = element.attributes;
        });
        state.data.structureById = structures;
        state.data.structureIds = state.data.structureIds;
    },
    searchByUnitCellFailed(state, action) {
        state.isLoading = false;
        state.status = SearchState.failed,
        state.error = action.payload;
    },
  },
});

export const {
    searchByUnitCellStart, loadStructureListSuccess,
    searchByUnitCellIdsSuccess, searchByUnitCellFailed,
} = searchByUnitCellSlice.actions;
export default searchByUnitCellSlice.reducer;

interface SearchNameResponse {
    meta: {
        total: number;
        pages: number;
        took: number;
    },
    data: {
        structures: number[]
    }
}

export const searchByUnitCell = ({
    a, b, c, alpha, beta, gamma, tolerance, page
}: {
    a: string, b: string, c: string, alpha: string, beta: string, gamma: string, tolerance: string, page: number
}): AppThunk => async (dispatch) => {
    try {
        dispatch(searchByUnitCellStart({ a, b, c, alpha, beta, gamma, tolerance, page }));

        const response = await fetch(`https://crystallography.io/api/v1/search/unit-cell`, {
            method: 'POST',
            body: `page=${page}&a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&c=${encodeURIComponent(c)}&alpha=${encodeURIComponent(alpha)}&beta=${encodeURIComponent(beta)}&gamma=${encodeURIComponent(gamma)}&tolerance=${encodeURIComponent(tolerance)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        const data: SearchNameResponse = await response.json();

        let structuresToLoad: number[] = [];

        if (data.data && data.data.structures && Array.isArray(data.data.structures)) {
            structuresToLoad = data.data.structures;
        }

        dispatch(searchByUnitCellIdsSuccess({ ids: structuresToLoad, meta: data.meta }));

        const structures = await getStructures(structuresToLoad);
        dispatch(loadStructureListSuccess(structures));

    } catch (err) {
        const errors = err?.response?.data?.errors;
        const message = (Array.isArray(errors) && errors.length > 0) ? errors[0].title: err.toString();

        dispatch(searchByUnitCellFailed(message));
    }
}
