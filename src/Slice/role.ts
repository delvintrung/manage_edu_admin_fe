import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

const initialState = { roleAction: [], error: "", loading: false };

// Thunk để fetch role từ API
export const fetchUserRole = createAsyncThunk(
  "user/fetchUserRole",
  async () => {
    const response = await axios.get("http://localhost:3006/api/v2/role-by-id");
    console.log(response.data);
    return response.data;
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.roleAction = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user role";
      });
  },
});

export default roleSlice.reducer;
