import type { UserInfo } from "../assets/Models/User";
import { httpClient } from "../Utils/interceptor";

export const postDataRegisterAPI = async (data: UserInfo) => {
  return await httpClient.post("/api/auth/signup", data);
};
