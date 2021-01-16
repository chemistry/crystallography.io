import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

export enum SearchState {
    empty,
    started,
    processing,
    success,
    failed,
}

const searchByStructureSlice = createSlice({
    name: "searchByStructure",
    initialState: {
        meta: {
            id: "",
            status: "new",
            progress: 0,
            version: 0,
            found: 0,
            page: 0,
            pagesAvailable: 0,
        },
        search: {
            molecule: {},
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
        searchByStructure(state, action: { payload: { molecule: any } }) {
            const { molecule } = action.payload;
            state.search.molecule = molecule;
            state.error = null;
            state.isLoading = true;
        },
        searchByStructureSuccess(
            state,
            action: {
                payload: { meta: SearchByStructureResponseMeta; ids: number[] };
            }
        ) {
            state.meta = action.payload.meta;
            state.data.structureIds = action.payload.ids.slice(0);
            state.error = null;
            state.isLoading = true;
        },
    },
});

export const {
    searchByStructure,
    searchByStructureSuccess,
} = searchByStructureSlice.actions;
export default searchByStructureSlice.reducer;

interface SearchByStructureResponseMeta {
    id: string;
    status: "created" | "finished" | "canceled";
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

export const searchStructureByStructure = ({
    molecule,
}: {
    molecule: any;
}): AppThunk => async (dispatch) => {
    dispatch(searchByStructure({ molecule }));

    const res = await axios.post(
        `https://crystallography.io/api/v1/search/structure`,
        `searchQuery=${encodeURIComponent(JSON.stringify(molecule))}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    const data: SearchByStructureResponse = res.data as SearchByStructureResponse;
    let structuresToLoad: number[] = [];

    if (data.data && data.data.results && Array.isArray(data.data.results)) {
        structuresToLoad = data.data.results;
    }

    dispatch(
        searchByStructureSuccess({ ids: structuresToLoad, meta: data.meta })
    );

    if (data && data.meta && data.meta.id) {
        return data.meta.id;
    }

    return null;
};
