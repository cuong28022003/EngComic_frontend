import { createSlice } from "@reduxjs/toolkit";

export const adultModeSlice = createSlice({
    name: "adultMode",
    initialState: {
        isAdultModeEnabled: false,
    },
    reducers: {
        enableAdultMode: (state) => {
            state.isAdultModeEnabled = true;
        },
        disableAdultMode: (state) => {
            state.isAdultModeEnabled = false;
        },
        toggleAdultMode: (state) => {
            state.isAdultModeEnabled = !state.isAdultModeEnabled;
        }
    }
});

export const {
    enableAdultMode,
    disableAdultMode,
    toggleAdultMode
} = adultModeSlice.actions;

export default adultModeSlice.reducer;
