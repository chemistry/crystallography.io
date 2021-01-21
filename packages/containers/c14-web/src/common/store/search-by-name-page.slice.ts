import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

export enum SearchState {
    empty,
    started,
    processing,
    success,
    failed
}

const searchByNameSlice = createSlice({
  name: "searchByName",
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
        name: '',
    },
    status: SearchState.empty,
    error: null,
    isLoading: false,
  },
  reducers: {
    searchStructureByNameStart(state, action: {payload : { name: string, page: number }}) {
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

    searchStructureByNameIdsSuccess(state, action: {
        payload: { ids: string[], meta: { searchString: string; pages: number, total: number } }
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
        payload.forEach((element: any) => {
            structures[element.id] = element.attributes;
        });
        state.data.structureById = structures;
        state.data.structureIds = state.data.structureIds;
    },
    searchStructureByNameFailed(state, action) {
        state.isLoading = false;
        state.status = SearchState.failed,
        state.error = action.payload;
    },
  },
});

export const {
    searchStructureByNameStart, loadStructureListSuccess,
    searchStructureByNameIdsSuccess, searchStructureByNameFailed,
} = searchByNameSlice.actions;
export default searchByNameSlice.reducer;

interface SearchNameResponse {
    meta: {
        total: number
        pages: number
        took: number
        searchString: string
    },
    data: [{
        id: string
        type: string
        attributes: {
            id: string
            score: number
        }
    }]
}

export const searchStructureByName = (
    { name, page }: { name : string, page: number },
): AppThunk => async (dispatch) => {
    try {
        dispatch(searchStructureByNameStart({ name, page }));

        const res = await axios.post(`https://crystallography.io/api/v1/search/name`, `page=${page}&name=${encodeURIComponent(name)}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const data: SearchNameResponse = res.data as SearchNameResponse;

        let structuresToLoad: string[] = [];

        if (Array.isArray(data.data)) {
            structuresToLoad = data.data.map(({ id }) => {
                return id;
            });
        }

        dispatch(searchStructureByNameIdsSuccess({ ids: structuresToLoad, meta: data.meta }));

        let data2: any[] = [];
        if (structuresToLoad.length > 0) {
            const res2 = await axios.post(`https://crystallography.io/api/v1/structure`, `ids=[${structuresToLoad.join(",")}]`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            data2 = res2.data?.data;
        }

        dispatch(loadStructureListSuccess(data2));
    } catch (err) {
        const errors = err?.response?.data?.errors;
        const message = (Array.isArray(errors) && errors.length > 0) ? errors[0].title: err.toString();
        dispatch(searchStructureByNameFailed(message));
    }
}
