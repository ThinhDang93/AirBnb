import { configureStore } from "@reduxjs/toolkit";
import RoomReducer from "./reducers/RoomReducer";
import CommentReducer from "./reducers/CommentReducer";

export const store = configureStore({
  reducer: { RoomReducer, CommentReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type DispatchType = typeof store.dispatch;
