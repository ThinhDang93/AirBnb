import type { UserInfo } from "../assets/Models/User";
import { httpClient } from "../Utils/interceptor";

export const deleteUserAPIbyID = async (id: any) => {
  return await httpClient.delete(`/api/users?id=${id}`, id);
};
export const UpdateUserAPI = async (data: UserInfo, id: any) => {
  return await httpClient.put(`/api/users/${id}`, data);
};
export const postDataRegisterAPI = async (data: UserInfo) => {
  return await httpClient.post("/api/auth/signup", data);
};
