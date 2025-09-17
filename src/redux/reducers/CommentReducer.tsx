import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CommentType } from "../../assets/Models/Comment";
import type { DispatchType } from "../store";
import { httpClient } from "../../Utils/interceptor";

export interface CommentStateType {
  arrCommentByID: CommentType[];
}

const initialState: CommentStateType = {
  arrCommentByID: [],
};

const CommentReducer = createSlice({
  name: "CommentReducer",
  initialState,
  reducers: {
    setArrCommentById: (
      state: CommentStateType,
      action: PayloadAction<CommentType[]>
    ) => {
      state.arrCommentByID = action.payload;
    },
  },
});

export const { setArrCommentById } = CommentReducer.actions;

export default CommentReducer.reducer;

export const getCommentByIdActionThunk = (id: string) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(
      `/api/binh-luan/lay-binh-luan-theo-phong/${id}`
    );

    const action = setArrCommentById(res.data.content);
    dispatch(action);
  };
};
