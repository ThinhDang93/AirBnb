import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocationType } from "../../assets/Models/Location";
import type { DispatchType, RootState } from "../store";
import { httpClient } from "../../Utils/interceptor";
import type { PaginationType } from "../../assets/Models/Room";

export interface LocationStateType {
  arrAllLocation: LocationType[];
  arrFilteredLocation: LocationType[];
  arrAllLocationByPage: LocationType[];
  pagination: PaginationType;
}

const initialState: LocationStateType = {
  arrAllLocation: [],
  arrFilteredLocation: [],
  arrAllLocationByPage: [],
  pagination: { pageIndex: 1, pageSize: 7, totalRow: 0, totalPages: 1 },
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
    setArrAllLocaByPage: (
      state: LocationStateType,
      action: PayloadAction<LocationType[]>
    ) => {
      state.arrAllLocationByPage = action.payload;
    },
    setPagination: (
      state: LocationStateType,
      action: PayloadAction<PaginationType>
    ) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setArrAllLoca,
  setArrFilterLoca,
  setArrAllLocaByPage,
  setPagination,
} = LocationReducer.actions;

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
export const getArrLocaByPage = (pageIndexa: number) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(
      `/api/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndexa}&pageSize=10`
    );

    const { pageIndex: idx, pageSize, totalRow, data } = res.data.content;

    const totalPages = Math.ceil(totalRow / pageSize);

    dispatch(setArrAllLocaByPage(data));
    dispatch(
      setPagination({
        pageIndex: idx,
        pageSize,
        totalRow,
        totalPages,
      })
    );
  };
};
