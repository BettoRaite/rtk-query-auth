import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "@/store/store";
import { createAppAsyncThunk } from "@/store/typed";
import type { UserCredentials } from "@/lib/types/auth";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
if (!AUTH_API_URL) {
  throw TypeError("missing AUTH_API_URL");
}
export const signupUser = createAppAsyncThunk(
  "users/signupUser",
  // async thunk accepts user credentials
  async ({ name, email, password }: UserCredentials, thunkAPI) => {
    try {
      console.log("user sign up");
      const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // sending credentials to auth server
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log("data", data);
      // access token, typically would not be stored in local storage since it's a bad practice
      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        return { ...data, username: name, email: email };
      }
      thunkAPI.rejectWithValue(data);
    } catch (e) {
      console.log("Error", e.response.data);
      thunkAPI.rejectWithValue({
        message: e.response.message,
      });
    }
  },
);

export const loginUser = createAsyncThunk(
  "users/login",
  async ({ email, password }: UserCredentials, thunkAPI) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log("response", data);
      if (response.status === 200) {
        // access token
        localStorage.setItem("token", data.token);
        return data;
      }
      thunkAPI.rejectWithValue(data);
    } catch (e) {
      console.log("Error", e.response.data);
      thunkAPI.rejectWithValue(e.response.data);
    }
  },
);

export const fetchUserBytoken = createAsyncThunk(
  "users/fetchUserByToken",
  async ({ token }, thunkAPI) => {
    try {
      const response = await fetch(
        "https://mock-user-auth-server.herokuapp.com/api/v1/users",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            // idk why put token inside of http req headers
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      console.log("data", data, response.status);

      if (response.status === 200) {
        return { ...data };
      }
      thunkAPI.rejectWithValue(data);
    } catch (e) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  },
);
type User = {
  username: string;
  email: string;
};
type InitialUserSliceState = {
  user: User;
  authState: "not_logged_in" | "loading" | "logged_in" | "error";
  error: null | string;
};
const initialState: InitialUserSliceState = {
  user: {
    username: "",
    email: "",
  },
  authState: "not_logged_in",
  error: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearState: (state) => {
      state.authState = "not_logged_in";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        signupUser.fulfilled,
        (state, { payload }: PayloadAction<User>) => {
          console.log("payload", payload);
          state.authState = "logged_in";
          state.user.email = payload.email;
          state.user.username = payload.username;
        },
      )
      .addCase(signupUser.pending, (state) => {
        state.authState = "loading";
      })
      .addCase(
        signupUser.rejected,
        (
          state,
          {
            payload,
          }: PayloadAction<{
            message: string;
          }>,
        ) => {
          state.authState = "error";
          state.error = payload.message;
        },
      )
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.email = payload.email;
        state.username = payload.name;
        state.isFetching = false;
        state.isSuccess = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        console.log("payload", payload);
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = payload.message;
      })
      .addCase(fetchUserBytoken.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchUserBytoken.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.email = payload.email;
        state.username = payload.name;
      })
      .addCase(fetchUserBytoken.rejected, (state) => {
        console.log("fetchUserBytoken");
        state.isFetching = false;
        state.isError = true;
      });
  },
});

export const { clearState } = userSlice.actions;

export const userSelector = (state: RootState) => state.user;
