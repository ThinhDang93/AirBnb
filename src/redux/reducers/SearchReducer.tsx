import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearch: false,
};

const SearchReducer = createSlice({
  name: "SearchReducer",
  initialState,
  reducers: {
    setTrue: (state) => {
      state.isSearch = true;
    },
    setFalse: (state) => {
      state.isSearch = false;
    },
  },
});

export const { setTrue, setFalse } = SearchReducer.actions;

export default SearchReducer.reducer;
