import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertState = {
  type: "success" | "info" | "warning" | "error" | null;
  message: string;
  description?: string;
  visible: boolean;
};

const initialState: AlertState = {
  type: null,
  message: "",
  description: "",
  visible: false,
};

const AlertReducer = createSlice({
  name: "AlertReducer",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{
        type: "success" | "info" | "warning" | "error";
        message: string;
        description?: string;
      }>
    ) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.description = action.payload.description;
      state.visible = true;
    },
    hideAlert: (state) => {
      state.visible = false;
      state.message = "";
      state.description = "";
      state.type = null;
    },
  },
});

export const { showAlert, hideAlert } = AlertReducer.actions;
export default AlertReducer.reducer;
