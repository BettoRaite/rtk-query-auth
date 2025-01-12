import z from "zod";
import type { UserLoginCredentials, UserSignupCredentials } from "./types/auth";
import type { ZodType } from "zod";

// Signup Schema
export const signupSchema: ZodType<UserSignupCredentials> = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

// Login Schema
export const loginSchema: ZodType<UserLoginCredentials> = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
