import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import type { RootState } from "@/store/store";

export function createFetchBase(serverUrl: string) {
  // Create a new mutex
  const mutex = new Mutex();

  const baseQuery = fetchBaseQuery({
    baseUrl: serverUrl,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;
      // Passing access token if we have it.
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    },
  });

  const customFetchBase: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const result = await mutex.runExclusive(async () => {
      return await baseQuery(args, api, extraOptions);
    });
    return result;
  };

  return customFetchBase;
}
