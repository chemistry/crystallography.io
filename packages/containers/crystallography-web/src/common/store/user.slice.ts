import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import firebase from "firebase/app";
import { AppThunk } from "./common";

const userSlice = createSlice({
  name: "user",
  initialState: {
      auth: false,
      isLoading: false,
      error: {
         code: "",
         message: "",
      },
      data: {
        email: "",
        displayName: "",
      },
  },
  reducers: {
    userLoginStart(state, action) {
        state.error = { code: "", message: ""};
        state.isLoading = true;
        state.auth = false;
    },
    userLoginSucess(state, action) {
        state.error = { code: "", message: ""};
        state.isLoading = false;
        state.auth = true;
    },
    userLoginFailed(state, action) {
        const { code, message } = action.payload;
        state.error.code = code;
        state.error.message = message;
        state.auth = false;
    },
  },
});

export const { userLoginSucess, userLoginFailed } = userSlice.actions;
export default userSlice.reducer;

let auth: any = null;
const getAuth = () => {
  return auth = auth ? auth : firebase.auth();
};
export const loginUser = (
    { email, password }: { email: string; password: string; },
): AppThunk => async (dispatch) => {

  try {
    const res = await getAuth().signInWithEmailAndPassword(
      email,
      password,
    );
    dispatch(userLoginSucess(res));
  } catch (err) {
    const { code, message } = err;
    dispatch(userLoginFailed({ code, message }));
  }
};
