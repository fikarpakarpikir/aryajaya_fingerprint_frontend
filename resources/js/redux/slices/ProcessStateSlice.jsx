import { createSlice } from "@reduxjs/toolkit";

const ProcessStateSlice = createSlice({
    name: "processState",
    initialState: {
        processState: null,
        processMessageFailed: "",
        toastState: false,
        message: "",
    },
    reducers: {
        processCloseAllReducer: (state, action) => {
            state.processState = false;
            state.toastState = false;
        },
        processStateReducer: (state, action) => {
            state.processState = action.payload;
        },
        setProcess: (state, action) => {
            state.processState = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        toastStateReducer: (state, action) => {
            state.toastState = action.payload;
        },
        toastCloseReducer: (state, action) => {
            state.toastState = false;
        },
        processMessageFailedReducer: (state, action) => {
            state.processMessageFailed = action.payload;
        },
    },
});

export const {
    setProcess,
    setMessage,
    processCloseAllReducer,
    processStateReducer,
    processMessageFailedReducer,
    toastStateReducer,
    toastCloseReducer,
} = ProcessStateSlice.actions;

export default ProcessStateSlice.reducer;
