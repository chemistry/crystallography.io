import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk} from "./common";

const catalogPageSlice = createSlice({
  name: "catalogPage",
  initialState: {
    meta: {
        pages: 0
    },
    data: {
        structureById: {},
        structureIdsLoaded: [],
        structureIds: [],
    },
    error: null,
    isLoading: false,
  },
  reducers: {
    loadCatalogPageStarted(state, action) {
        state.isLoading = true;
        state.error = null;
    },
    loadStructureIdsSuccess(state, action) {
        const { data, meta } = action.payload;
        state.isLoading = true;
        state.error = null;
        state.data.structureIdsLoaded = data;
        state.meta = meta;
    },
    loadStructureListSuccess(state, { payload }) {
        state.isLoading = false;
        state.error = null;
        const structures: any = { };
        payload.forEach((element: any) => {
            structures[element.id] = element.attributes;
        });
        state.data.structureById = structures;
        state.data.structureIds = state.data.structureIdsLoaded;
        state.data.structureIdsLoaded = [];
    },
    loadCatalogPageFailed(state, action) {
        state.isLoading = false;
        state.error = action.payload;
    },
  },
});

export const {
    loadCatalogPageFailed, loadCatalogPageStarted, loadStructureIdsSuccess, loadStructureListSuccess,
} = catalogPageSlice.actions;
export default catalogPageSlice.reducer;

export const fetchCatalogData = (
    { page }: { page: string },
): AppThunk => async (dispatch) => {
  try {
    const pageParsed = parseInt(page, 10);
    const pageQ = isFinite(pageParsed) ? pageParsed : 1;

    dispatch(loadCatalogPageStarted({}));

    // Load corresponding catalog page
    const res = await axios.get(`https://crystallography.io/api/v1/catalog/?page=${Math.ceil(pageQ / 100)}`);
    const { data, meta } = res.data;

    let structuresToLoad = [];
    // Extract Structures To Load

    if (Array.isArray(data)) {
        const pageResponse: any = data.filter((el: { id: number; }) => el.id === pageQ);
        if (pageResponse) {
            structuresToLoad  = pageResponse[0]?.attributes?.structures;
        }
    }
    dispatch(loadStructureIdsSuccess({ data: structuresToLoad, meta }));

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
    dispatch(loadCatalogPageFailed(err.toString()));
  }
};
