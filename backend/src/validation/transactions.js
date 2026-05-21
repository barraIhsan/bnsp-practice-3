import { z } from "zod";

export const transactionsSchema = z
  .object({
    paid: z.coerce.number().nonnegative().multipleOf(0.01).max(9999999999.99),
    items: z
      .array(
        z.object({
          product_id: z.coerce.number().int().positive(),
          qty: z.coerce.number().int().positive("Quantity must be at least 1"),
          price: z.coerce
            .number()
            .positive()
            .multipleOf(0.01)
            .max(9999999999.99),
        }),
      )
      .min(1, "Transaction must have at least one item"),
  })
  .strict();
