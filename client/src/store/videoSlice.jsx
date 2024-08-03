import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVideos = createAsyncThunk("videos/fetchVideos", async () => {
  const response = await axios.get("/api/videos");
  return response.data;
});

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default videoSlice.reducer;
