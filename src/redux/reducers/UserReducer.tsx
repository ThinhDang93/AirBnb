import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo, UserLogin } from "../../assets/Models/User";
import type { DispatchType } from "../store";
import { ACCESS_TOKEKN, httpClient } from "../../Utils/interceptor";

export interface UserStateType {
  arrAllUser: UserInfo[];
  userInfoLogin: UserInfo | null;
}

const initialState: UserStateType = {
  arrAllUser: [],
  userInfoLogin: null,
};

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    setArrAllUser: (
      state: UserStateType,
      action: PayloadAction<UserInfo[]>
    ) => {
      state.arrAllUser = action.payload;
    },
    setUserInfoLogin: (
      state: UserStateType,
      action: PayloadAction<UserInfo>
    ) => {
      state.userInfoLogin = action.payload;
    },
    removeUserLogin: (state: UserStateType) => {
      state.userInfoLogin = null;
    },
  },
});

export const { setArrAllUser, setUserInfoLogin, removeUserLogin } =
  UserReducer.actions;

export default UserReducer.reducer;

export const getUserInfoLoginActionThunk = (values: UserLogin) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.post("/api/auth/signin", values);

    const action = setUserInfoLogin(res.data.content.user);
    dispatch(action);

    localStorage.setItem(ACCESS_TOKEKN, res.data.content.token);
  };
};
