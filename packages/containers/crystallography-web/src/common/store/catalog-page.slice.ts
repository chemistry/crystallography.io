import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { stringify } from "querystring";
import { AppThunk} from "./common";

const catalogPageSlice = createSlice({
  name: "catalogPage",
  initialState: {
    data: {
        structureById: {},
        structureIds: [],
    },
    error: null,
    isLoading: false,
  },
  reducers: {
    loadCatalogPageStarted(state, action) {
        state.isLoading = true;
        state.error = null;
        state.data = {
            structureById: {},
            structureIds: [],
        };
    },
    loadStructureIdsSuccess(state, action) {
        state.isLoading = true;
        state.error = null;
        state.data.structureIds = action.payload;
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
    loadCatalogPageFailed(state, action) {
        state.isLoading = false;
        state.error = action.payload;
        state.data = {
            structureById: {},
            structureIds: [],
        };
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
    const res = await axios.get(`https://api.crystallography.io/api/v1/catalog/?page=${Math.ceil(pageQ / 100)}`);
    const data = res.data?.data;

    let structuresToLoad = [];
    // Extract Structures To Load

    if (Array.isArray(data)) {
        const pageResponse: any = data.filter((el: { id: number; }) => el.id === pageQ);
        if (pageResponse) {
            structuresToLoad  = pageResponse[0]?.attributes?.structures;
        }
    }
    dispatch(loadStructureIdsSuccess(structuresToLoad));

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
    dispatch(loadCatalogPageFailed(err.toString()));
  }
};
