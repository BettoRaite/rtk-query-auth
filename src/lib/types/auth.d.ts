export type UserCredentials = {
  username: string;
  email: string;
  password: string;
};
export type UserSignupCredentials = {
  username: string;
  email: string;
  password: string;
};

export type User = {
  name: string;
  email: string;
  emailVerified: Date;
  createdAt: Date;
};

export type UserLoginCredentials = Omit<UserSignupCredentials, "username">;
