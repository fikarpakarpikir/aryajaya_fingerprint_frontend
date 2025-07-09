import { createSlice } from "@reduxjs/toolkit";

const KaryawanSlice = createSlice({
    name: "karyawans",
    initialState: {
        karyawan: [],
    },
    reducers: {
        karyawansReducer: (state, action) => {
            state.karyawan = action.payload;
        },
        karyawanAdd: (state, action) => {
            state.karyawan.push(action.payload);
        },
        karyawanChange: (state, action) => {
            const { key, data, id } = action.payload;
            const item = state.karyawan?.find((item) => item.id === Number(id));
            if (item) {
                item[key] = data;
            }
        },
    },
});

export const { karyawansReducer, karyawanAdd, karyawanChange } =
    KaryawanSlice.actions;

export default KaryawanSlice.reducer;
