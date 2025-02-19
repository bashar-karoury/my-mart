import { z } from "zod";
import validator from "validator";
import { Role } from "@/utils/types";

export const userSignUpSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Name can only contain letters, numbers, and underscores",
    })
    .transform((val) => validator.escape(val)), // Sanitize for SQL,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .transform((val) => validator.escape(val)), // Sanitize for SQL,
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters long" })
    .transform((val) => validator.trim(validator.escape(val))), // Sanitize for SQL,
  role: z
    .enum([Role.Customer, Role.Seller])
    .transform((val) => validator.escape(val)), // Sanitize for SQL,
});
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const productSchema = z.object({
  name: z.string().transform((val) => validator.escape(val)), // Sanitize for SQL,
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .transform((val) => validator.escape(val)), // Sanitize for SQL,
  price: z.number().positive({ message: "Price must be a positive number" }),
  quantity: z
    .number()
    .int({ message: "Stock must be an integer" })
    .nonnegative({ message: "Stock cannot be negative" }),
  sellerId: z.number().int({ message: "Seller ID must be an integer" }),
  videoUrl: z
    .string()
    .url({ message: "Invalid URL format" })
    .transform((val) => validator.escape(val)), // Sanitize for SQL,
});
