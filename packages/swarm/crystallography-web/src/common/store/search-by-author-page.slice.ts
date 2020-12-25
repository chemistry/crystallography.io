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
    status: SearchState.empty,
    currentPage: 1,
    name: '',
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
        state.name = name;
        state.currentPage = page;
        state.isLoading = true;
        state.error = null;
        state.status = SearchState.started;
    },

    searchStructureByAuthorIdsSuccess(state, action: {
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
    searchStructureByAuthorSuccessFailed(state, action) {
        state.isLoading = false;
        state.status = SearchState.failed,
        state.error = action.payload;
    },
  },
});

export const {
    searchStructureByAuthorStart, loadStructureListSuccess,
    searchStructureByAuthorIdsSuccess, searchStructureByAuthorSuccessFailed,
} = searchByAuthorSlice.actions;
export default searchByAuthorSlice.reducer;

interface SearchAuthorResponse {
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

export const searchStructureByAuthor = (
    { name, page }: { name : string, page: number },
): AppThunk => async (dispatch) => {
    try {
        // @TODO - add Authors Search
    } catch (err) {
        dispatch(searchStructureByAuthorSuccessFailed(err.toString()));
    }
}
