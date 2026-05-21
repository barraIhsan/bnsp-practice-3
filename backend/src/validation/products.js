import { z } from "zod";

export const productsSchema = z
  .object({
    name: z.string().max(150, "Name must not contain more than 150 characters"),
    category: z
      .string()
      .max(100, "Category must not contain more than 100 characters")
      .optional(),
    price: z.coerce.number().nonnegative().multipleOf(0.01).max(9999999999.99),
    stock: z
      .number()
      .int("Stock must be an integer")
      .nonnegative("Stock must not be negative")
      .default(0),
  })
  .strict();
