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
        searchByStructureFailed(state, action) {
            state.isLoading = false;
            state.status = SearchState.failed,
            state.error = action.payload;
        },
    },
});

export const {
    searchByStructure,
    searchByStructureSuccess,
    searchByStructureFailed
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

    try {
        dispatch(searchByStructure({ molecule }));

        const response = await fetch(`https://crystallography.io/api/v1/search/structure`, {
            method: 'POST',
            body: `searchQuery=${encodeURIComponent(JSON.stringify(molecule))}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        const data: SearchByStructureResponse = await response.json();
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

    } catch (err) {
        const errors = err?.response?.data?.errors;
        const message = (Array.isArray(errors) && errors.length > 0) ? errors[0].title: err.toString();

        dispatch(searchByStructureFailed(message));
    }
};
