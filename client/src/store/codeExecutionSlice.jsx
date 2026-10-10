import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Keyless execution via Wandbox (https://wandbox.org).
// NOTE: Wandbox saves Java code as prog.java, so the Java starter must NOT
// declare a `public class` (it would fail with "should be declared in Main.java").
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wandbox runs on shared public containers. Under load it fails with
// infra errors like "OCI runtime error ... Resource temporarily unavailable"
// which succeed on retry. Only these are retried, up to 3 attempts.
function isInfraError(message) {
  const m = String(message || "").toLowerCase();
  return (
    m.includes("resource temporarily unavailable") ||
    m.includes("oci runtime") ||
    m.includes("network error") ||
    m.includes("timeout")
  );
}

export const JAVA_COMPILER = "openjdk-jdk-21+35";

export const COMPILERS = {
  java: "openjdk-jdk-21+35",
  python: "cpython-3.12.7",
  javascript: "nodejs-20.17.0",
  cpp: "gcc-13.2.0",
};

export const executeCode = createAsyncThunk(
  "codeExecution/executeCode",
  async ({ code, input, language }, { rejectWithValue }) => {
    let lastError = "Something went wrong";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resp = await axios.post(
          WANDBOX_URL,
          {
            compiler: COMPILERS[language] || JAVA_COMPILER,
            code,
            stdin: input || "",
          },
          { timeout: 60000 }
        );
        const d = resp.data;
        if (d.compiler_error && d.compiler_error.trim()) {
          return rejectWithValue(d.compiler_error);
        }
        if (
          d.program_error &&
          d.program_error.trim() &&
          isInfraError(d.program_error)
        ) {
          lastError = d.program_error;
          await sleep(attempt * 2000);
          continue;
        }
        const out = [d.program_output, d.program_error]
          .filter((s) => s && s.trim())
          .join("\n");
        return { output: out || "(no output)", status: d.status };
      } catch (error) {
        lastError =
          error.response?.data?.compiler_error ||
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        if (!isInfraError(lastError) || attempt === 3) {
          return rejectWithValue(lastError);
        }
        await sleep(attempt * 2000);
      }
    }
    return rejectWithValue(
      `Run servers are busy right now, please try again in a moment. (${lastError})`
    );
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
