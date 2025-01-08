import type { UserCredentials } from "@/lib/types/auth";
import { createAppAsyncThunk } from "@/store/typed";
import { asyncThunkCreator, createAsyncThunk } from "@reduxjs/toolkit";
import config from "@/lib/config";
import { Controller } from "react-hook-form";
import { data } from "react-router";
import { clearState } from "./authSlice";

export const signupUser = createAppAsyncThunk(
  "auth/signupUser",
  async (credentials: UserCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${config.VITE_AUTH_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // sending credentials to auth server
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessages =
          resData.errors
            ?.map((e: { message: string }) => e.message)
            .join("\n") || "Unknown error occurred";
        return rejectWithValue(errorMessages);
      }
      // access token, typically would not be stored in local storage since it's a bad practice
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign up";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAppAsyncThunk(
  "auth/login",
  async (credentials: UserCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${config.VITE_AUTH_SERVER_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      const resData = await response.json();
      console.log(resData);
      if (!response.ok) {
        // server returns body with errors.
        return rejectWithValue(
          resData.errors.map((e: { message: string }) => e.message).join("\n")
        );
      }
      // Auth server returns payload with access token
      return { accessToken: resData.accessToken };
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        rejectWithValue(err.message);
      }
      rejectWithValue("Unknown error");
    }
  }
);

export const logoutUser = createAppAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      const response = await fetch(
        `${config.VITE_AUTH_SERVER_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      dispatch(clearState());
    } catch (err) {
      console.error("Error logging out user", err);
      dispatch(clearState());
    }
  }
);

export const fetchUserBytoken = createAppAsyncThunk(
  "auth/fetchUserByToken",
  async (_, { getState }) => {
    try {
      const {
        auth: { accessToken },
      } = getState();
      const response = await fetch(`${config.VITE_RESOURCE_SERVER_URL}/user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const {
          data: { user },
        } = await response.json();
        return { user };
      }
      throw new Error("Unknown server response");
    } catch (e) {
      console.error("Error", e.response.data);
      throw e;
    }
  }
);

export const refreshToken = createAppAsyncThunk(
  "auth/refreshToken",
  async (signal: AbortSignal, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${config.VITE_AUTH_SERVER_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          signal,
        }
      );
      if (response.ok) {
        // res body should contain access token
        return await response.json();
      }
      // Do nothing. There no access token for us anyway.(
    } catch (err) {
      // Please bro fix this error handling.
      // rejectWithValue must be returned.
      if (signal.aborted) {
        return;
      }
      if (err instanceof TypeError) {
        return rejectWithValue("Server is down");
      }
      return rejectWithValue("Unexpected error has occured");
    }
  }
);
