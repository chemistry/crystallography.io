import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

const authorsDetailsPage = createSlice({
  name: "authorsDetailsPage",
  initialState: {
    meta: {
        total: 0,
        pages: 0,
        name: ""
    },
    data: {
        structureById: {},
        structureIds: [],
    },
    currentPage: 0,
    error: null,
    isLoading: false,
  },
  reducers: {
    loadAuthorsDetailsPageStart(state, action) {
        state.isLoading = true;
        state.error = null;
    },
    loadAuthorsDetailsPageSuccess(state, action) {
        state.isLoading = false;
        state.error = null;

        const { data, meta } = action.payload;
        state.data.structureIds = data.results;
        state.meta = meta || {};
    },
    loadStructureListSuccess(state, { payload }) {
        state.isLoading = false;
        state.error = null;
        const structures: any = { };
        payload.forEach((element: any) => {
            structures[element.id] = element.attributes;
        });
        state.data.structureById = structures;
    },
    loadAuthorsListFailed(state, action) {
        state.isLoading = false;
        state.error = action.payload;
    },
  },
});

export const {
    loadAuthorsDetailsPageStart, loadAuthorsDetailsPageSuccess, loadAuthorsListFailed,
    loadStructureListSuccess
} = authorsDetailsPage.actions;
export default authorsDetailsPage.reducer;

export const fetchAuthorDetailsData = (
    { page, name }: { page: string, name: string },
): AppThunk => async (dispatch) => {
  try {
    const pageParsed = parseInt(page, 10);
    const pageQ = isFinite(pageParsed) ? pageParsed : 1;

    dispatch(loadAuthorsDetailsPageStart({}));

    // Load corresponding catalog page
    const res = await axios.get(`https://crystallography.io/api/v1/authors/${encodeURIComponent(name)}?page=${pageQ}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = res.data || {};
    let structuresToLoad = [];
    if (data && data.meta && data.data && Array.isArray(data.data.results)) {
        dispatch(loadAuthorsDetailsPageSuccess(data));
        structuresToLoad = data.data.results;
    }

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
    dispatch(loadAuthorsListFailed(message));
  }
};
