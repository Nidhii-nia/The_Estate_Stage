import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
currentUser: null,
error:null,
loading:null,
};

const userSlice = createSlice({
    name: "User",
    initialState: INITIAL_STATE,
    reducers:{
        signInStart: (state)=>{
            state.loading = true;
        },
        signInSuccess: (state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state,action) => {
            state.loading = false;
            state.error = action.payload
        }
    }
});

export const {signInStart,signInSuccess,signInFailure} = userSlice.actions;

export const userReducer = userSlice.reducer;

export const userSelector = (state) => state.user;