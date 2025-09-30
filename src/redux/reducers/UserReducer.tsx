import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo, UserLogin } from "../../assets/Models/User";
import type { DispatchType } from "../store";
import { ACCESS_TOKEN, httpClient } from "../../Utils/interceptor";

export interface UserStateType {
  arrAllUser: UserInfo[];
  userInfoLogin: UserInfo | null;
  userDetailbyID: UserInfo | null;
  userUpdate: UserInfo | null;
}

const initialState: UserStateType = {
  arrAllUser: [],
  userInfoLogin: null,
  userDetailbyID: null,
  userUpdate: null,
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
    setUserDetailbyID: (
      state: UserStateType,
      action: PayloadAction<UserInfo>
    ) => {
      state.userDetailbyID = action.payload;
    },
    setUserUpdate: (state: UserStateType, action: PayloadAction<UserInfo>) => {
      state.userUpdate = action.payload;
    },
  },
});

export const {
  setArrAllUser,
  setUserInfoLogin,
  removeUserLogin,
  setUserDetailbyID,
  setUserUpdate,
} = UserReducer.actions;

export default UserReducer.reducer;

export const getUserInfoLoginActionThunk = (values: UserLogin) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.post("/api/auth/signin", values);

    const action = setUserInfoLogin(res.data.content.user);
    dispatch(action);

    localStorage.setItem(ACCESS_TOKEN, res.data.content.token);
    localStorage.setItem("user", JSON.stringify(res.data.content.user));
  };
};

export const getArrAllUserActionThunk = () => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get("/api/users");

    const action = setArrAllUser(res.data.content);

    dispatch(action);
  };
};

export const getUserDetailbyIDActionThunk = (id: any) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(`/api/users/${id}`, id);

    const action = setUserDetailbyID(res.data.content);

    dispatch(action);
  };
};

export const getUserInfoActionThunk = (id: any) => {
  return async (dispatch: DispatchType) => {
    const res = await httpClient.get(`/api/users/${id}`, id);

    const action = setUserUpdate(res.data.content);

    dispatch(action);
  };
};
