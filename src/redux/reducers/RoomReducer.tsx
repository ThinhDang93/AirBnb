import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingRoomType,
  HomeRoomType,
  RoomDetailType,
} from "../../assets/Models/Room";
import type { DispatchType } from "../store";
import { httpClient } from "../../Utils/interceptor";

export interface RoomStateType {
  arrAllroom: HomeRoomType[];
  arrRoombyid: Record<number, HomeRoomType[]>;
  roomDetail: RoomDetailType | null;
  roomBookingbyUser: BookingRoomType | null;
  roomBookingDetail: BookingRoomType[];
}

const initialState: RoomStateType = {
  arrAllroom: [],
  arrRoombyid: {},
  roomDetail: null,
  roomBookingbyUser: null,
  roomBookingDetail: [],
};

const RoomReducer = createSlice({
  name: "RoomReducer",
  initialState,
  reducers: {
    setArrRoomById: (
      state: RoomStateType,
      action: PayloadAction<Record<number, HomeRoomType[]>>
    ) => {
      state.arrRoombyid = {
        ...state.arrRoombyid, // giữ lại dữ liệu cũ
        ...action.payload, // merge dữ liệu mới
      };
    },

    setArrAllRoom: (
      state: RoomStateType,
      action: PayloadAction<HomeRoomType[]>
    ) => {
      state.arrAllroom = action.payload;
    },

    setRoomDetail: (
      state: RoomStateType,
      action: PayloadAction<RoomDetailType>
    ) => {
      state.roomDetail = action.payload;
    },

    setRoomBookingbyUser: (
      state: RoomStateType,
      action: PayloadAction<BookingRoomType>
    ) => {
      state.roomBookingbyUser = action.payload;
    },

    setBookingRoomDetail: (
      state: RoomStateType,
      action: PayloadAction<BookingRoomType[]>
    ) => {
      state.roomBookingDetail = action.payload;
    },
  },
});

export const {
  setArrRoomById,
  setArrAllRoom,
  setRoomDetail,
  setRoomBookingbyUser,
  setBookingRoomDetail,
} = RoomReducer.actions;
export default RoomReducer.reducer;

// Thunk gọi API
export const getRoomByID = (id: number) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(
      `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`
    );
    // Tạo payload có regionId + data
    const action = setArrRoomById({
      [Number(id)]: res.data.content, // key là regionId, value là mảng room
    });

    dispatch(action);
  };
};

export const getAllRoom = () => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get("/api/phong-thue");

    const action = setArrAllRoom(res.data.content);
    dispatch(action);
  };
};

export const getRoomDetailActionThunk = (maPhong: string) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(`/api/phong-thue/${maPhong}`);

    const action = setRoomDetail(res.data.content);
    dispatch(action);
  };
};

export const postInfoBookingRoomActionThunk = (
  infoBooking: BookingRoomType
) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.post("/api/dat-phong", infoBooking);

    const action = setRoomBookingbyUser(res.data.content);
    dispatch(action);
  };
};

export const getBookingRoomDetailActionThunk = (id: any) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(
      `/api/dat-phong/lay-theo-nguoi-dung/${id}`,
      id
    );

    const action = setBookingRoomDetail(res.data.content);

    dispatch(action);
  };
};
