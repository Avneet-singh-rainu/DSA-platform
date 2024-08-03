import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const executeCode = createAsyncThunk(
  "codeExecution/executeCode",
  async ({ code, input }, { rejectWithValue }) => {
    try {
      const resp = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: "java",
        version: "15.0.2",
        files: [
          {
            content: code,
          },
        ],
        stdin: input, 
      });
      return resp.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const codeExecutionSlice = createSlice({
  name: "codeExecution",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(executeCode.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(executeCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(executeCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
      });
  },
});

export const codeExecutionReducer = codeExecutionSlice.reducer; // Export the reducer
