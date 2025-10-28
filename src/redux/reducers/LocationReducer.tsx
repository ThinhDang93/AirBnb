import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocationType } from "../../assets/Models/Location";
import type { DispatchType, RootState } from "../store";
import { httpClient } from "../../Utils/interceptor";

export interface LocationStateType {
  arrAllLocation: LocationType[];
  arrFilteredLocation: LocationType[];
}

const initialState: LocationStateType = {
  arrAllLocation: [],
  arrFilteredLocation: [],
};

const LocationReducer = createSlice({
  name: "LocationReducer",
  initialState,
  reducers: {
    setArrAllLoca: (
      state: LocationStateType,
      action: PayloadAction<LocationType[]>
    ) => {
      state.arrAllLocation = action.payload;
    },
    setArrFilterLoca: (
      state: LocationStateType,
      action: PayloadAction<LocationType[]>
    ) => {
      state.arrFilteredLocation = action.payload;
    },
  },
});

export const { setArrAllLoca, setArrFilterLoca } = LocationReducer.actions;

export default LocationReducer.reducer;

export const getAllLocaActionThunk = () => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get("/api/vi-tri");

    const action = setArrAllLoca(res.data.content);
    dispatch(action);
  };
};

export const getArrFilterLoca = (keyword: string) => {
  return (dispatch: DispatchType, getState: () => RootState) => {
    const { arrAllLocation } = getState().LocationReducer;

    const filtered = arrAllLocation.filter((loc: LocationType) =>
      loc.tinhThanh.toLowerCase().includes(keyword.toLowerCase())
    );

    dispatch(setArrFilterLoca(filtered)); // ⬅ lưu kết quả vào store
  };
};
