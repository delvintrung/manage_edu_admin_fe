import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

const initialState = {
  role: { list: [], loading: false },
  actionView: { list: [], loading: false },
  allPermission: { list: [], loading: false },
};

export const fetchPermission = createAsyncThunk(
  "role/fetchPermission",
  async () => {
    const response = await axios.get(
      "http://localhost:3006/api/v2/permissions"
    );
    return response.data;
  }
);

export const fetchPermissionView = createAsyncThunk(
  "role/fetchPermissionView",
  async () => {
    const response = await axios.get(
      "http://localhost:3006/api/v2/action-view"
    );
    return response.data;
  }
);

export const fetchAllPermission = createAsyncThunk(
  "role/fetchAllPermission",
  async () => {
    const response = await axios.get(
      "http://localhost:3006/api/v2/all-permissions"
    );
    return response.data;
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionView.pending, (state) => {
        state.actionView.loading = true;
      })
      .addCase(fetchPermissionView.fulfilled, (state, action) => {
        state.actionView.list = action.payload;
        state.actionView.loading = false;
      })
      .addCase(fetchPermissionView.rejected, (state, action) => {
        state.actionView.loading = true;
      })
      .addCase(fetchAllPermission.pending, (state) => {
        state.allPermission.loading = true;
      })
      .addCase(fetchAllPermission.fulfilled, (state, action) => {
        state.allPermission.list = action.payload;
        state.allPermission.loading = false;
      })
      .addCase(fetchAllPermission.rejected, (state, action) => {
        state.allPermission.loading = false;
      })
      .addCase(fetchPermission.pending, (state) => {
        state.role.loading = true;
      })
      .addCase(fetchPermission.fulfilled, (state, action) => {
        state.role.list = action.payload;
        state.role.loading = false;
      })
      .addCase(fetchPermission.rejected, (state, action) => {
        state.role.loading = false;
      });
  },
});

export default roleSlice.reducer;
