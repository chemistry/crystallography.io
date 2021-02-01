import { createSlice } from "@reduxjs/toolkit";
import { getStructures, getCatalogContent } from "../../models";
import { AppThunk } from "./common";

const catalogPageSlice = createSlice({
    name: "catalogPage",
    initialState: {
        meta: {
            pages: 0,
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
            const structures: any = {};
            payload.data.forEach((element: any) => {
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
    loadCatalogPageFailed,
    loadCatalogPageStarted,
    loadStructureIdsSuccess,
    loadStructureListSuccess,
} = catalogPageSlice.actions;
export default catalogPageSlice.reducer;

export const fetchCatalogData = ({
    page,
}: {
    page: string;
}): AppThunk => async (dispatch) => {
    try {
        const pageParsed = parseInt(page, 10);
        const pageQ = isFinite(pageParsed) ? pageParsed : 1;

        dispatch(loadCatalogPageStarted({}));

        const { meta, structures } = await getCatalogContent(pageQ);

        dispatch(loadStructureIdsSuccess({ data: structures, meta }));

        const structuresData = await getStructures(structures);

        dispatch(loadStructureListSuccess(structuresData));

    } catch (err) {
        const errors = err?.response?.data?.errors;
        const message =
            Array.isArray(errors) && errors.length > 0
                ? errors[0].title
                : err.toString();
        dispatch(loadCatalogPageFailed(message));
    }
};
