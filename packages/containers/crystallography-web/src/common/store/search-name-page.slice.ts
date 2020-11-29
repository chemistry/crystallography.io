import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

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
        hasResults: false,
    },
    currentPage: 1,
    name: '',
    error: null,
    isLoading: false,
  },
  reducers: {
    searchStructureByNameStart(state, action) {
        state.isLoading = true;
        state.error = null;
    },
    searchStructureByNameIdsSuccess(state, action: { payload: { ids: string[]} }) {
        const { payload } = action;
        const { ids } = payload;

        state.data.structureIds = ids;
        state.isLoading = true;
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
    searchStructureByNameSuccessFailed(state, action) {
        state.isLoading = false;
        state.error = action.payload;
    },
  },
});

export const {
    searchStructureByNameStart, loadStructureListSuccess,
    searchStructureByNameIdsSuccess, searchStructureByNameSuccessFailed,
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
    { name }: { name : string },
): AppThunk => async (dispatch) => {
    try {
        dispatch(searchStructureByNameStart({}));

        const res = await axios.post(`https://api.crystallography.io/api/v1/search/name`, `name=${name}`, {
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

        dispatch(searchStructureByNameIdsSuccess({ ids: structuresToLoad }));

        let data2: any[] = [];
        if (structuresToLoad.length > 0) {
            const res2 = await axios.post(`https://api.crystallography.io/api/v1/structure`, `ids=[${structuresToLoad.join(",")}]`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            data2 = res2.data?.data;
        }

        dispatch(loadStructureListSuccess(data2));
    } catch (err) {
        dispatch(searchStructureByNameSuccessFailed(err.toString()));
    }
}
