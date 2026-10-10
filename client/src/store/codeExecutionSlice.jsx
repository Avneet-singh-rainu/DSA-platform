import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Keyless execution via Wandbox (https://wandbox.org).
// NOTE: Wandbox saves code as prog.java, so the starter must NOT declare
// a `public class` (it would fail with "should be declared in Main.java").
const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const JAVA_COMPILER = "openjdk-jdk-21+35";

export const executeCode = createAsyncThunk(
  "codeExecution/executeCode",
  async ({ code, input }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        WANDBOX_URL,
        {
          compiler: JAVA_COMPILER,
          code,
          stdin: input || "",
        },
        { timeout: 60000 }
      );
      const d = resp.data;
      if (d.compiler_error && d.compiler_error.trim()) {
        return rejectWithValue(d.compiler_error);
      }
      const out = [d.program_output, d.program_error]
        .filter((s) => s && s.trim())
        .join("\n");
      return { output: out || "(no output)", status: d.status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.compiler_error ||
          error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
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
