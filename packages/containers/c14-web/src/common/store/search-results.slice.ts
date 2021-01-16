import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

export enum SearchState {
    empty = "empty",
    created = "created",
    processing = "processing",
    canceled = "canceled",
    finished  = "finished",
    success = "success",
    failed = "failed",
}

const parsePage = (page?: string): number => {
    let currentPage = parseInt(page, 10);
    currentPage = currentPage && isFinite(currentPage) ? currentPage : 1;
    return currentPage;
}

const searchResultsSlice = createSlice({
    name: "searchResults",
    initialState: {
        meta: {
            id: '',
            status: SearchState.empty,
            progress: 0,
            version: 0,
            found: 0,
            page: 0,
            pagesAvailable: 0,
        },
        data: {
            structureById: {},
            structureIds: [],
        },
        isSubscribedToUpdates: false,
        status: SearchState.empty,
        error: null,
        isLoading: false,
    },
    reducers: {
        searchResultsStart(state,
            action: {
                payload: { id: string; page: string };
            }
        ) {
            const { id, page }  = action.payload;
            state.meta.id = id;
            state.meta.page =  parsePage(page);
            state.error = null;
            state.isLoading = true;
        },
        searchResultsSuccess(state,
            action: {
                payload: { meta: SearchByStructureResponseMeta; ids: number[] };
            }
        ) {
            state.meta = action.payload.meta;
            state.data.structureIds = action.payload.ids.slice(0);
            state.isLoading = false;
            state.error = null;
        },
        searchResultsUpdate(state,
            action: {
                payload: { meta: SearchByStructureResponseMeta; ids: number[] };
            }
        ) {
            state.meta = action.payload.meta;
            state.data.structureIds = action.payload.ids.slice(0);
            state.isLoading = false;
            state.error = null;
        },
        loadStructureListSuccess(state, { payload }) {
            state.isLoading = false;
            state.error = null;
            const structures: any = { };
            payload.forEach((element: any) => {
                structures[element.id] = element.attributes;
            });
            state.data.structureById = structures;
            state.data.structureIds = state.data.structureIds;
        },
        searchResultsFailed(state, action) {
            state.isLoading = false;
            state.status = SearchState.failed,
            state.error = action.payload;
        }
    },
});

interface SearchByStructureResponseMeta {
    id: string;
    status: SearchState;
    progress: number;
    version: number;
    found: number;
    page: number;
    pagesAvailable: number;
}

interface SearchByStructureResponse {
    meta: SearchByStructureResponseMeta;
    data: {
        results: number[];
    };
}

export const {
    searchResultsStart,
    searchResultsSuccess,
    searchResultsUpdate,
    loadStructureListSuccess,
    searchResultsFailed,
} = searchResultsSlice.actions;
export default searchResultsSlice.reducer;


const arrayDifference = (array1: number[], array2: number[]): number[] => {
    return array1.filter(x => !array2.includes(x));
}

export const updateSearchResults = (data: SearchByStructureResponse): AppThunk => async (dispatch, getState) => {

    let structuresToLoad: number[] = [];

    if (data.data && data.data.results && Array.isArray(data.data.results)) {
        structuresToLoad = data.data.results;
    }

    const state =  getState();
    const existingStructures = state.searchResults.data.structureIds;

    dispatch(
        searchResultsUpdate({ ids: structuresToLoad, meta: data.meta })
    );

    const newStructures = arrayDifference(structuresToLoad, existingStructures)

    if (newStructures.length > 0) {
        const res2 = await axios.post(`https://crystallography.io/api/v1/structure`, `ids=[${newStructures.join(",")}]`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const data2 = res2.data?.data;

        dispatch(loadStructureListSuccess(data2));
    }
}

export const fetchSearchResultsData = ({
    id, page
}: {
    id: string, page: string;
}): AppThunk => async (dispatch) => {
    try {
        dispatch(
            searchResultsStart({ id, page })
        );

        const res = await axios.get(
            `https://crystallography.io/api/v1/search/structure/${id}?page=${page}`
        );

        const data: SearchByStructureResponse = res.data as SearchByStructureResponse;
        let structuresToLoad: number[] = [];

        if (data.data && data.data.results && Array.isArray(data.data.results)) {
            structuresToLoad = data.data.results;
        }

        dispatch(
            searchResultsSuccess({ ids: structuresToLoad, meta: data.meta })
        );

        // subscribe to updates here ...

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
        dispatch(searchResultsFailed(err.toString()));
    }
};
