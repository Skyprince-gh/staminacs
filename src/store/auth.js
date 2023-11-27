import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userAuthCred: "",
  isAuthenticated: false,
  userData: "",
  userImageURL: "",
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAuthCred(state, action) {
      state.userAuthCred = action.payload;
    },
    setUserAuthState(state, action) {
      state.isAuthenticated = action.payload;
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setUserImageURL(state,action) {
      state.userImageURL = action.payload
    }
  },
});

export const actions = userSlice.actions;

export default userSlice.reducer;
