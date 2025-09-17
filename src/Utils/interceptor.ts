import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { routeLink } from "../App";

export const USER_LOGIN: string = "userLogin";

export const ACCESS_TOKEKN: string = "accessToken";

export const TOKEN_CYBERSOFT: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAxNiIsIkhldEhhblN0cmluZyI6IjEzLzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODI2MjQwMDAwMCIsIm5iZiI6MTc0NTM0NDgwMCwiZXhwIjoxNzY4NDEzNjAwfQ.7HwjnwyCQy67B09sLtGp-d7oyhXyP3LUVtXaz60bQeo";

export const DOMAIN: string = "https://airbnbnew.cybersoft.edu.vn";

export const httpClient: AxiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 10000,
});

httpClient.interceptors.request.use(
  (req: InternalAxiosRequestConfig<any>) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEKN);
    if (accessToken) {
      req.headers.Authorization = `${accessToken}`;
    }
    req.headers.TokenCyberSoft = TOKEN_CYBERSOFT;
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    return res;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // xử lý lỗi unthorized
          console.error("Unthorized");
          routeLink.push("/login");
          break;
        case 403: // xử lý lỗi Forbidden
          console.error("Forbidden - Không có quyền truy cập ");
          routeLink.push("/login");
          break;
        case 404: // xử lý lỗi Not Found
          console.error("Not Found - Không tìm thấy tài nguyên ");
          break;
        case 500: // xử lý lỗi Internal server error
          console.error("Internal server error");
          break;
      }
    }
  }
);
