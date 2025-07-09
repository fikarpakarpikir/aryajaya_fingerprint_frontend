import { createSlice } from "@reduxjs/toolkit";

const birokrasiSlice = createSlice({
    name: "birokrasis",
    initialState: {
        birokrasis: [],
    },
    reducers: {
        birokrasiReducer: (state, action) => {
            state.birokrasis = action.payload;
        },
        birokrasiAdd: (state, action) => {
            // console.log(action.payload);
            state.birokrasis.push(action.payload);
        },
        birokrasiChange: (state, action) => {
            const { id, is_active } = action.payload;

            const item = state.birokrasis.find(
                (item) => Number(item?.id) === Number(id)
            );
            if (item) {
                item.is_active = is_active;
            } else {
                state.birokrasis.push(action.payload);
            }
        },
        birokrasiDelete: (state, action) => {
            // console.log(action.payload);
            const { id } = action.payload;
            state.birokrasis = state.birokrasis.filter((item) => item.id != id);
        },
    },
});

export const {
    birokrasiReducer,
    birokrasiAdd,
    birokrasiChange,
    birokrasiDelete,
} = birokrasiSlice.actions;

export default birokrasiSlice.reducer;
