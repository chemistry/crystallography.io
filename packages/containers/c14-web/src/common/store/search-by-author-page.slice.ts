import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "./common";
import { getStructures } from '../../models';

export enum SearchState {
    empty,
    started,
    processing,
    success,
    failed
}

const searchByAuthorSlice = createSlice({
  name: "searchByAuthor",
  initialState: {
    data: {
        structureById: {},
        structureIds: [],
    },
    meta: {
        totalPages: 0,
        totalResults: 0,
        searchString: ''
    },
    search: {
        page: 1,
        name: ''
    },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  reducers: {
    searchStructureByAuthorStart(state, action: {payload : { name: string, page: number }}) {
        const { payload } = action;
        const { name, page } = payload;
        state.data = {
            structureById: {},
            structureIds: [],
        };
        state.search = { name, page };
        state.isLoading = true;
        state.error = null;
        state.status = SearchState.started;
    },

    searchStructureByAuthorIdsSuccess(state, action: {
        payload: { ids: number[], meta: { searchString: string; pages: number, total: number } }
    }) {
        const { payload } = action;
        const { ids, meta } = payload;
        const { pages, total, searchString } = meta;

        state.data.structureIds = ids;
        state.status = SearchState.processing;
        state.meta.totalPages = pages;
        state.meta.totalResults = total;
        state.meta.searchString = searchString;

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
    searchStructureByAuthorFailed(state, action) {
        state.isLoading = false;
        state.status = SearchState.failed,
        state.error = action.payload;
    },
  },
});

export const {
    searchStructureByAuthorStart, loadStructureListSuccess,
    searchStructureByAuthorIdsSuccess, searchStructureByAuthorFailed,
} = searchByAuthorSlice.actions;
export default searchByAuthorSlice.reducer;

interface SearchAuthorResponse {
    meta: {
        total: number
        pages: number
        took: number
        searchString: string
    },
    data: {
        structures: number[];
    }
}

export const searchStructureByAuthor = (
    { name, page }: { name : string, page: number },
): AppThunk => async (dispatch) => {
    try {
        dispatch(searchStructureByAuthorStart({ name, page }));

        const response = await fetch(`https://crystallography.io/api/v1/search/author`, {
            method: 'POST',
            body: `page=${page}&name=${encodeURIComponent(name)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        const data = await response.json();

        let structuresToLoad = [];

        if (data.data && data.data.structures && Array.isArray(data.data.structures)) {
            structuresToLoad = data.data.structures;
        }

        dispatch(searchStructureByAuthorIdsSuccess({ ids: structuresToLoad, meta: data.meta }));

        const structures = await getStructures(structuresToLoad)
        dispatch(loadStructureListSuccess(structures));

        dispatch(loadStructureListSuccess(structures));

    } catch (err) {
        const errors = err?.response?.data?.errors;
        const message = (Array.isArray(errors) && errors.length > 0) ? errors[0].title: err.toString();

        dispatch(searchStructureByAuthorFailed(message));
    }
}
