import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import type { RootState } from "@/store/store";
import config from "../config";
import type {
  QueryReturnValue,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

const fetchPromises = new Map<string, Promise<unknown>>();

type FetchPromise = Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
>;

export function createFetchBase(serverUrl: string) {
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
    FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const { url } = args;
    // Check if we have mutex on curr endpoint
    if (fetchPromises.has(url)) {
      return (await fetchPromises.get(url)) as FetchPromise;
    }
    const isRequestToResServer = config.server.resource === serverUrl;

    const runFetch = async () => {
      const result = await baseQuery(args, api, extraOptions);

      // Got unauthorized. Trying to refresh the token.
      if (result.error?.status === 401 && isRequestToResServer) {
        await baseQuery(
          { credentials: "include", url: "auth/refresh" },
          api,
          extraOptions
        );
        return await baseQuery(args, api, extraOptions);
      }
      return result;
    };

    const reqPromise = runFetch();
    fetchPromises.set(url, reqPromise);
    return await reqPromise;
  };

  return customFetchBase;
}
