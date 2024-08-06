import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
    "fetchUser",
    async ({ email }, { rejectWithValue }) => {
        try {
            const resp = await axios.get(`http://localhost:5000/user/${email}`);
            return resp.data;
        } catch (error) {
            return rejectWithValue(
                error.response.data.message || "Failed to fetch user"
            );
        }
    }
);

const initialState = {
    isLoading: false,
    data: JSON.parse(sessionStorage.getItem("user")) || null,
    isError: false,
    errorMessage: null,
    isLoggedIn: JSON.parse(sessionStorage.getItem("isLoggedIn")) || false,
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        updateBookmarks: (state, action) => {
            if (state.data) {
                state.data.bookmarks = action.payload;
                //sessionStorage.setItem("user", JSON.stringify(state.data));
            }
        },
        logOut: (state, action) => {
            state.data = null;
            state.isLoggedIn = false;
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("isLoggedIn");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.isError = false;
                state.errorMessage = null;
                state.isLoggedIn = true;
                sessionStorage.setItem("user", JSON.stringify(action.payload));
                sessionStorage.setItem("isLoggedIn", true);
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                sessionStorage.setItem("isLoggedIn", false);
                state.errorMessage = action.payload || "Something went wrong";
            });
    },
});

export const { updateBookmarks, logOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
