import { z } from "zod";

export const productsSchema = z
  .object({
    name: z.string().max(150, "Name must not contain more than 150 characters"),
    category: z
      .string()
      .max(100, "Category must not contain more than 100 characters")
      .optional(),
    price: z
      .number()
      .nonnegative("Price must not be negative")
      .multipleOf(0.01, "Price must have at most 2 decimal places")
      .max(9999999999.99, "Price exceeds DECIMAL(12,2) limit"),
    stock: z
      .number()
      .int("Stock must be an integer")
      .nonnegative("Stock must not be negative")
      .default(0),
  })
  .strict();
