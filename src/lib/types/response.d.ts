import type { User } from "./auth";
export type AuthErrorResponse = {
  message?: string;
  data?: { errors: { message: string }[] };
};

export type ResponseWithAccessToken = {
  data: {
    accessToken: string;
  };
};

export type ResponseWithUser = {
  data: {
    user: User;
  };
};
