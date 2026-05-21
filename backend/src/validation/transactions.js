import { z } from "zod";

export const transactionsSchema = z
  .object({
    cashier_id: z
      .number()
      .int("Cashier ID must be an integer")
      .positive("Cashier ID must be positive"),
    paid: z
      .number()
      .nonnegative("Paid amount must not be negative")
      .multipleOf(0.01, "Paid amount must have at most 2 decimal places")
      .max(9999999999.99, "Paid amount exceeds DECIMAL(12,2) limit"),
    items: z
      .array(
        z.object({
          product_id: z.number().int().positive("Product ID must be positive"),
          qty: z.number().int().positive("Quantity must be at least 1"),
          price: z
            .number()
            .positive("Price must be positive")
            .multipleOf(0.01)
            .max(9999999999.99),
        }),
      )
      .min(1, "Transaction must have at least one item"),
  })
  .strict();
