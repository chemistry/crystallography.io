import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

const authorsListPageSlice = createSlice({
  name: "authorsListPage",
  initialState: {
    meta: {
        total: 0,
        pages: 0
    },
    data: {
        authorsList: [],
    },
    error: null,
    isLoading: false,
  },
  reducers: {
    loadAuthorsListPageStarted(state, action) {
        // state.meta = { pages: 0, total: 0 };
        // state.data.authorsList = [];
        state.isLoading = true;
        state.error = null;
    },
    loadAuthorsListSuccess(state, action) {
        state.isLoading = false;
        state.error = null;

        const { data, meta } = action.payload;
        let authors: any[] = [];
        if (Array.isArray(data)) {
            authors = data.map((element : any)=> {
                return {
                    id: element.id,
                    ...element.attributes
                }
            });
        }
        state.data.authorsList = authors;
        state.meta = meta || {};
    },
    loadAuthorsListFailed(state, action) {
        state.isLoading = false;
        state.error = action.payload;
    },
  },
});

export const {
    loadAuthorsListPageStarted, loadAuthorsListSuccess, loadAuthorsListFailed,
} = authorsListPageSlice.actions;
export default authorsListPageSlice.reducer;

export const fetchAuthorsListData = (
    { page }: { page: string },
): AppThunk => async (dispatch) => {
  try {
    const pageParsed = parseInt(page, 10);
    const pageQ = isFinite(pageParsed) ? pageParsed : 1;

    dispatch(loadAuthorsListPageStarted({}));

    // Load corresponding catalog page
    const res = await axios.get(`https://crystallography.io/api/v1/authors?page=${pageQ}`);
    const data = res.data || {};

    dispatch(loadAuthorsListSuccess(data));

  } catch (err) {
    const errors = err?.response?.data?.errors;
    const message = (Array.isArray(errors) && errors.length > 0) ? errors[0].title: err.toString();
    dispatch(loadAuthorsListFailed(message));
  }
};
