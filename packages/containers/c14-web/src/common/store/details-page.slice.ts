import { createSlice } from "@reduxjs/toolkit";
import { AppThunk} from "./common";

const detailsPageSlice = createSlice({
  name: "detailsPage",
  initialState: {
    data: {
        details: {},
    },
    error: null,
    isLoading: false,
  },
  reducers: {
    loadStructureStarted(state, action) {
        state.isLoading = true;
        state.error = null;
        state.data.details = {};
    },
    loadStructureSuccess(state, action) {
        const { payload } = action;
        state.isLoading = true;
        state.error = null;
        if (
            Array.isArray(payload) &&
            payload.length === 1 &&
            action.payload[0].attributes
        ) {
            state.data.details = action.payload[0].attributes;
        }
    },
    loadStructureFailed(state, action) {
        state.isLoading = false;
        state.error = action.payload;
    },
  },
});

export const {
    loadStructureStarted, loadStructureSuccess, loadStructureFailed,
} = detailsPageSlice.actions;
export default detailsPageSlice.reducer;

export const fetchStructureDetailsData = (
    { id }: { id: string },
): AppThunk => async (dispatch) => {
    try {
        dispatch(loadStructureStarted({}));

        const response = await fetch(`https://crystallography.io/api/v1/structure`, {
            method: 'POST',
            body: `ids=[${id}]&expand=true`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        const res = await response.json();
        const data = res.data;

        dispatch(loadStructureSuccess(data));
  } catch (err) {
    const errors = err?.response?.data?.errors;
    const message = (Array.isArray(errors) && errors.length > 0) ? errors[0].title: err.toString();
    dispatch(loadStructureFailed(message));
  }
};
