import { createSlice } from "@reduxjs/toolkit";

const defaultJenis = ["fp", "face"];

const initialState = Object.fromEntries(
    defaultJenis.map((jenis) => [jenis, { status: "", message: "", waktu: "" }])
);

const syncSlice = createSlice({
    name: "sync",
    initialState,
    reducers: {
        setSync: (state, action) => {
            const { jenis, status, message, waktu } = action.payload || {};
            if (!state[jenis]) state[jenis] = createChildInit();
            if (status !== undefined) state[jenis].status = status;
            if (message !== undefined) state[jenis].message = message;
            if (waktu !== undefined) state[jenis].waktu = waktu;
        },
        resetSync: (state, action) => {
            const { jenis } = action.payload || {};
            if (jenis && state[jenis]) {
                state[jenis] = { status: "", message: "", waktu: "" };
            } else if (!jenis) {
                // Reset semua
                Object.keys(state).forEach((key) => {
                    state[key] = { status: "", message: "", waktu: "" };
                });
            }
        },
    },
});

export const { setSync, resetSync } = syncSlice.actions;
export default syncSlice.reducer;
