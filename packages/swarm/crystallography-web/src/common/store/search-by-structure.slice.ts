import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "./common";

export enum SearchState {
    empty,
    started,
    processing,
    success,
    failed
}

const searchByStructureSlice = createSlice({
    name: "searchByStructure",
    initialState: {
        meta: {
        },
        search: {
            molecule: {}
        },
        name: '',
        error: null,
        isLoading: false,
    },
    reducers: {
        searchByStructure(state, action: {payload : { molecule: any }}) {
            const { molecule } = action.payload;
            state.search.molecule = molecule;
        }
    },
});

export const {
    searchByStructure,
} = searchByStructureSlice.actions;
export default searchByStructureSlice.reducer;

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

export const searchStructureByStructure = (
    { molecule }: { molecule: any },
): AppThunk => async (dispatch) => {

    dispatch(searchByStructure({ molecule }));
    // to do ... redirect after search
}
