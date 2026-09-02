import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  currentUser: null,
  error: null,
  loading: null,
};

const normalizeUser = (user) => ({
  ...user,
  id: user.id || user._id,
});

const userSlice = createSlice({
  name: "User",
  initialState: INITIAL_STATE,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = normalizeUser(action.payload);
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = normalizeUser(action.payload);
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    deleteUserFailure: (state,action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutUserStart: (state)=>{
      state.loading=true;
      state.error=null;
    },
    logoutUserSuccess: (state)=>{
      state.loading=false;
      state.error=null;
      state.currentUser=null;
    },
    logoutUserFailure: (state,action)=>{
      state.loading=false;
      state.error=action.payload;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, updateUserStart,updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, logoutUserStart,logoutUserSuccess,logoutUserFailure } = userSlice.actions;

export const userReducer = userSlice.reducer;

export const userSelector = (state) => state.userReducer;
