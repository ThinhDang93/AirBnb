import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { routeLink } from "../App";

export const ACCESS_TOKEN: string = "accessToken";

export const TOKEN_CYBERSOFT: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJEZXZPcHMgMDIiLCJIZXRIYW5TdHJpbmciOiIyOC8wOS8yMDI2IiwiSGV0SGFuVGltZSI6IjE3OTA1NTM2MDAwMDAiLCJuYmYiOjE3NjkwMTQ4MDAsImV4cCI6MTc5MDcwMTIwMH0.zSBJtqDLuPvKwr_on1Oi5AZu5DlaEWUjNmyd-Rbmy7Q";

export const DOMAIN: string = "https://airbnbnew.cybersoft.edu.vn";

export const httpClient: AxiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 10000,
});

httpClient.interceptors.request.use(
  (req: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      req.headers.token = `${token}`;
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

// 📁 src/utils/getRandomAvatar.ts

// tạo cache riêng để lưu avatar đã random
const avatarCache: Record<string | number, string> = {};

/**
 * Trả về URL avatar ngẫu nhiên theo userId.
 * Giữ nguyên avatar cũ nếu đã random trước đó.
 *
 * @param id - ID duy nhất của user
 * @param size - Kích thước avatar (mặc định 150)
 * @returns string - URL ảnh avatar
 */
export function getRandomAvatar(
  id: string | number,
  size: number = 150
): string {
  if (!avatarCache[id]) {
    const randomId = Math.floor(Math.random() * 70) + 1;
    avatarCache[id] = `https://i.pravatar.cc/${size}?img=${randomId}`;
  }
  return avatarCache[id];
}

export const formatDate = (date: string) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth()+1).padStart(2, "0")}/${d.getFullYear()}`;
};
