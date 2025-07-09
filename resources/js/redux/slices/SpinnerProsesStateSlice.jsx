import { createSlice } from "@reduxjs/toolkit";

const SpinnerProsesStateSlice = createSlice({
    name: "spinnerProsesState",
    initialState: {
        spinnerProsesState: false,
        messageFailed: "",
    },
    reducers: {
        spinnerLoadingReducer: (state, action) => {
            state.spinnerProsesState = "loading";
        },
        spinnerSuccessReducer: (state, action) => {
            state.spinnerProsesState = "success";
        },
        spinnerFailedReducer: (state, action) => {
            state.spinnerProsesState = "failed";
        },
        spinnerCloseAllReducer: (state, action) => {
            state.spinnerProsesState = false;
        },
        spinnerProsesStateReducer: (state, action) => {
            state.spinnerProsesState = action.payload;
        },
        messageFailedReducer: (state, action) => {
            state.messageFailed = action.payload;
        },
    },
});

export const {
    spinnerLoadingReducer,
    spinnerSuccessReducer,
    spinnerFailedReducer,
    spinnerCloseAllReducer,
    spinnerProsesStateReducer,
    messageFailedReducer,
} = SpinnerProsesStateSlice.actions;

export default SpinnerProsesStateSlice.reducer;
