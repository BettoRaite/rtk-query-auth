import { clearAuth, setAuth } from "@/features/auth/authSlice";
import config from "@/lib/config";
import type { UserCredentials, UserLoginCredentials } from "@/lib/types/auth";
import type {
  AuthErrorResponse,
  ResponseWithAccessToken,
} from "@/lib/types/response";
import { createFetchBase } from "@/lib/utils/createFetchBase";
import { createApi, retry } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createFetchBase(config.server.auth),
  endpoints: (builder) => ({
    signupUser: builder.mutation<unknown, UserCredentials>({
      query: (credentials) => {
        return {
          url: "/auth/signup",
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        };
      },
      transformErrorResponse: ({ data = {}, status }) => {
        const { data: resData } = data as AuthErrorResponse;
        console.log(status);
        if (status === 409) return "User already exists";
        if (resData?.errors) {
          return resData.errors.map((e) => e.message).join("\n");
        }
        return "Unknown network error occurred";
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            setAuth({
              authState: "unauthenticated",
            })
          );
        } catch (err) {}
      },
    }),
    loginUser: builder.mutation<unknown, UserLoginCredentials>({
      query: (credentials) => {
        return {
          url: "/auth/login",
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        };
      },
      transformErrorResponse: ({ data }) => {
        const { data: resData, message } = data as AuthErrorResponse;
        return (
          resData?.errors?.map((e) => e.message).join("\n") ||
          message ||
          "Unknown error, probably server is down"
        );
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled
          .then(({ data }) => {
            const {
              data: { accessToken },
            } = data as ResponseWithAccessToken;
            dispatch(
              setAuth({
                authState: "authenticated",
                accessToken,
              })
            );
          })
          .catch(() => {});
      },
    }),
    logoutUser: builder.mutation<unknown, void>({
      query: () => {
        return {
          url: "/auth/logout",
          method: "POST",
          credentials: "include",
        };
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data as AuthErrorResponse;
        return message || "Unknown error, probably server is down";
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled
          .then(() => {
            dispatch(clearAuth());
          })
          .catch(() => {});
      },
    }),
    refresh: builder.mutation<unknown, void>({
      query: () => {
        return {
          url: "/auth/refresh",
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          timeout: 10000,
        };
      },
      transformErrorResponse: ({ status }) => {
        if (status === 501) return "Server is down";
        return "";
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const {
            data: { accessToken },
          } = data as ResponseWithAccessToken;
          dispatch(
            setAuth({
              accessToken,
              authState: "authenticated",
            })
          );
        } catch (err) {}
      },
    }),
  }),
});
export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshMutation,
} = authApi;
