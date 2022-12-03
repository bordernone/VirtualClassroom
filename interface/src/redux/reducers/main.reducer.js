import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
};

const mainSlice = createSlice({
    name: "main",
    initialState: initialState,
    reducers: {},
});

export const {} = mainSlice.actions;
export default mainSlice.reducer;
