import { createSlice } from "@reduxjs/toolkit";

const defaultJenis = ["fp", "face"];

const createChildInit = () => ({
    status: "",
    message: "",
    waktu: "",
    step: 1,
});

const initialState = Object.fromEntries(
    defaultJenis.map((jenis) => [jenis, createChildInit()])
);

const syncSlice = createSlice({
    name: "sync",
    initialState,
    reducers: {
        setSync: (state, action) => {
            const { jenis, status, message, waktu,step } = action.payload || {};
            if (!state[jenis]) state[jenis] = createChildInit();
            if (status !== undefined) state[jenis].status = status;
            if (message !== undefined) state[jenis].message = message;
            if (waktu !== undefined) state[jenis].waktu = waktu;
            if (step !== undefined) state[jenis].step = step;
        },
        resetSync: (state, action) => {
            const { jenis } = action.payload || {};
            if (jenis && state[jenis]) {
                state[jenis] = { status: "", message: "", waktu: "", step:1 };
            } else if (!jenis) {
                // Reset semua
                Object.keys(state).forEach((key) => {
                    state[key] = { status: "", message: "", waktu: "", step: 1 };
                });
            }
        },
    },
});

export const { setSync, resetSync } = syncSlice.actions;
export default syncSlice.reducer;
