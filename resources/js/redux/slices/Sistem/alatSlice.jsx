import { createSlice } from "@reduxjs/toolkit";

const alatSlice = createSlice({
    name: "alats",
    initialState: {
        alats: [],
    },
    reducers: {
        alatReducer: (state, action) => {
            state.alats = action.payload;
        },
        alatAdd: (state, action) => {
            // console.log(action.payload);
            state.alats.push(action.payload);
        },
        alatChange: (state, action) => {
            const { id, ip_device, title, ip_alat } = action.payload;

            const foundItem = state.alats.find((item) => item.id === id);
            if (foundItem) {
                // console.log(foundItem);
                foundItem.ip_device = ip_device;
                foundItem.title = title;
                foundItem.ip_alat = ip_alat;
            }
        },
        alatDelete: (state, action) => {
            // console.log(action.payload);
            const { id } = action.payload;
            state.alats = state.alats.filter((item) => item.id != id);
        },
    },
});

export const { alatReducer, alatAdd, alatChange, alatDelete } =
    alatSlice.actions;

export default alatSlice.reducer;
