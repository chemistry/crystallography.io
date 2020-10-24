import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "./common";

const authorsListPageSlice = createSlice({
  name: "authorsListPage",
  initialState: {
    data: {
        authorsList: [],
    },
    error: null,
    isLoading: false,
  },
  reducers: {
    loadAuthorsListPageStarted(state, action) {
        state.isLoading = true;
        state.error = null;
        state.data.authorsList = [];
    },
    loadAuthorsListSuccess(state, action) {
        state.isLoading = true;
        state.error = null;

        const { payload } = action;
        let authors: any[] = [];
        if (Array.isArray(payload)) {
            authors = payload.map((element : any)=> {
                return {
                    id: element.id,
                    ...element.attributes
                }
            })
        }
        state.data.authorsList = authors;
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
    const res = await axios.get(`https://api.crystallography.io/api/v1/authors?page=${Math.ceil(pageQ / 100)}`);
    const data = res.data?.data;

    dispatch(loadAuthorsListSuccess(data));

  } catch (err) {
    dispatch(loadAuthorsListFailed(err.toString()));
  }
};
