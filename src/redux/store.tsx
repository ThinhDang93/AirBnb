import { configureStore } from "@reduxjs/toolkit";
import RoomReducer from "./reducers/RoomReducer";
import CommentReducer from "./reducers/CommentReducer";
import UserReducer from "./reducers/UserReducer";
import LocationReducer from "./reducers/LocationReducer";

export const store = configureStore({
  reducer: { RoomReducer, CommentReducer, UserReducer, LocationReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type DispatchType = typeof store.dispatch;
