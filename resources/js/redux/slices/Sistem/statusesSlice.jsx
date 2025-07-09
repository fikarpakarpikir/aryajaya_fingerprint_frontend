import { createSlice } from "@reduxjs/toolkit";

const statusesSlice = createSlice({
    name: "statuses",
    initialState: {
        statuses: [],
    },
    reducers: {
        statusesReducer: (state, action) => {
            state.statuses = action.payload;
        },
        statusesAdd: (state, action) => {
            // console.log(action.payload);
            state.statuses.push(action.payload);
        },
        statusesChange: (state, action) => {
            const { id, ip_device, title, ip_statuses } = action.payload;

            const foundItem = state.statuses.find((item) => item.id === id);
            if (foundItem) {
                // console.log(foundItem);
                foundItem.ip_device = ip_device;
                foundItem.title = title;
                foundItem.ip_statuses = ip_statuses;
            }
        },
        statusesDelete: (state, action) => {
            // console.log(action.payload);
            const { id } = action.payload;
            state.statuses = state.statuses.filter((item) => item.id != id);
        },
    },
});

export const { statusesReducer, statusesAdd, statusesChange, statusesDelete } =
    statusesSlice.actions;

export default statusesSlice.reducer;
