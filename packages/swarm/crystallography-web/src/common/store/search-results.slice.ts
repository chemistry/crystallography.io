import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

export enum SearchState {
    empty = "empty",
    created = "created",
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
            id: "",
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
            state.error = null;
            state.isLoading = true;
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
        searchResultsFailed(state, action) {
            state.isLoading = false;
            state.status = SearchState.failed,
            state.error = action.payload;
        },
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
    loadStructureListSuccess,
    searchResultsFailed
} = searchResultsSlice.actions;
export default searchResultsSlice.reducer;

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
