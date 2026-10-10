import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";

function readUser() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // normalize: old code sometimes stored [user], new stores user object
    if (Array.isArray(parsed)) return parsed[0] || null;
    return parsed;
  } catch {
    return null;
  }
}

export const signupUser = createAsyncThunk(
  "user/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${API_BASE}/user/signup`, {
        name: email,
        password,
      });
      return resp.data; // { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to sign up"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${API_BASE}/user/login`, {
        name: email,
        password,
      });
      return resp.data; // { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

// Legacy: fetch by email without password (kept for old sessions, deprecated)
export const fetchUser = createAsyncThunk(
  "fetchUser",
  async ({ email }, { rejectWithValue }) => {
    try {
      const resp = await axios.get(`${API_BASE}/user/${email}`);
      const data = resp.data;
      const user = Array.isArray(data) ? data[0] : data;
      return { user, token: sessionStorage.getItem("token") };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const initialState = {
  isLoading: false,
  data: readUser(),
  token: sessionStorage.getItem("token") || null,
  isError: false,
  errorMessage: null,
  isLoggedIn: !!sessionStorage.getItem("token") && !!readUser(),
};

function setSession(token, user) {
  if (token) sessionStorage.setItem("token", token);
  if (user) sessionStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem("isLoggedIn", "true");
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    updateBookmarks: (state, action) => {
      if (state.data) {
        state.data.bookmarks = action.payload;
      }
    },
    logOut: (state) => {
      state.data = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isError = false;
      state.errorMessage = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("isLoggedIn");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        // signup does not auto-login; user must login
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.user;
        state.token = action.payload.token;
        state.isError = false;
        state.errorMessage = null;
        state.isLoggedIn = true;
        setSession(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.user;
        state.isError = false;
        state.errorMessage = null;
        if (action.payload.user) {
          state.isLoggedIn = !!state.token;
          sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Something went wrong";
      });
  },
});

export const { updateBookmarks, logOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
