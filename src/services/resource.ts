import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import config from "@/lib/config";
import type { UserCredentials } from "@/lib/types/auth";
import type { FetchArgs } from "@reduxjs/toolkit/query/react";
import { setAuth } from "@/features/auth/authSlice";
import type { User } from "@/lib/types/auth";
import type { UserLoginCredentials } from "@/lib/types/auth";
import { createFetchBase } from "@/lib/utils/createFetchBase";
import type { ResponseWithUser } from "@/lib/types/response";

export const resourceApi = createApi({
  reducerPath: "resourceApi",
  baseQuery: createFetchBase(config.server.resource),
  endpoints: (builder) => ({
    getUser: builder.mutation<unknown, void>({
      query: () => {
        // Do not need to set access token here because we already do it in custom fetch fn
        // See utils/createFetchBase
        return {
          url: "/user",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        };
      },
      transformErrorResponse: ({ data = {}, status }) => {
        const { message } = data as {
          message?: string;
        };
        // We can get such status in case user has not signed up or token has expired
        // Which is a valid reason, hence skip and not log error
        if (status === "PARSING_ERROR") return "";
        if (status === 503) return "Server is down";
        if (status === "TIMEOUT_ERROR") return "Failed to refresh tokens";
        return message ?? "Failed to load user";
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const {
            data: { user },
          } = data as ResponseWithUser;
          dispatch(
            setAuth({
              user,
            })
          );
        } catch (err) {}
      },
    }),
  }),
});
export const { useGetUserMutation } = resourceApi;
