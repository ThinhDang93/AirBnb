import type { CommentTypeByUser } from "../assets/Models/Comment";
import { httpClient } from "../Utils/interceptor";

export const postCommentByUser = async (data: CommentTypeByUser) => {
  return await httpClient.post("/api/binh-luan", data);
};
