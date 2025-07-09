import { createSlice } from "@reduxjs/toolkit";

const FingerprintSlice = createSlice({
    name: "fingerprints",
    initialState: {
        fingerprints: [],
        listRegistereds: [],
    },
    reducers: {
        registeredReducer: (state, action) => {
            state.listRegistereds = action.payload;
        },
        registeredAdd: (state, action) => {
            state.listRegistereds.push(action.payload);
        },
        registeredDelete: (state, action) => {
            const updatedRegistered = state.listRegistereds.filter(
                (item) => item.id != action.payload
            );

            state.listRegistereds = updatedRegistered;
        },
    },
});

export const { registeredReducer, registeredAdd, registeredDelete } =
    FingerprintSlice.actions;

export default FingerprintSlice.reducer;
