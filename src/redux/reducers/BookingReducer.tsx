import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookingRoomType } from "../../assets/Models/Room";
import type { DispatchType } from "../store";
import { httpClient } from "../../Utils/interceptor";

export interface BookingStateType {
  arrAllBookingRoom: BookingRoomType[];
}
const initialState: BookingStateType = {
  arrAllBookingRoom: [],
};

const BookingReducer = createSlice({
  name: "BookingReducer",
  initialState,
  reducers: {
    setArrAllBookingRoom: (
      state: BookingStateType,
      action: PayloadAction<BookingRoomType[]>
    ) => {
      state.arrAllBookingRoom = action.payload;
    },
  },
});

export const { setArrAllBookingRoom } = BookingReducer.actions;

export default BookingReducer.reducer;

export const getArrAllBookingRoomActionThunk = () => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get("/api/dat-phong");
    const action = setArrAllBookingRoom(res.data.content);

    dispatch(action);
  };
};
