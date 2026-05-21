import z from "zod";

export const userSchema = z
  .object({
    username: z
      .string("Username must be a string")
      .regex(/^\S+$/, "Username must not contain spaces")
      .min(3, "Username must contain more than 3 characters")
      .max(32, "Username must not contain more than 32 characters"),
    password: z
      .string("Password must be a string")
      .min(6, "Password must contain more than 6 characters")
      .max(64, "Password must not contain more than 64 characters"),
  })
  .strict();
