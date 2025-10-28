import type { BookingRoomType, RoomDetailType } from "../assets/Models/Room";
import { httpClient } from "../Utils/interceptor";

export const DeleteRoomAPIbyID = async (id: any) => {
  return await httpClient.delete(`/api/phong-thue/${id}`, id);
};

export const UpdateRoomAPIbyID = async (id: any, values: RoomDetailType) => {
  return await httpClient.put(`/api/phong-thue/${id}`, values);
};

export const AddRoomAPIbyID = async (values: RoomDetailType) => {
  return await httpClient.post("/api/phong-thue", values);
};

export const DeleteRoomBookingbyMaPhong = async (maPhong: any) => {
  return await httpClient.delete(`/api/dat-phong/${maPhong}`);
};

export const UpdateRoomBooking = async (data: BookingRoomType) => {
  return await httpClient.put(`/api/dat-phong/${data.id}`, data);
};
