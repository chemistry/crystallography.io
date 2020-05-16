import { createSlice } from "@reduxjs/toolkit";

const structuresSlice = createSlice({
  name: "structures",
  initialState: [{ id: "Data" }],
  reducers: {
    addStructures(state, action) {
      const { id } = action.payload;
      state.push({ id });
    },
  },
});

export const { addStructures } = structuresSlice.actions;

export default structuresSlice.reducer;
