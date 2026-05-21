import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  createTransactionsHandler,
  deleteTransactionsByIdHandler,
  getTransactionsByIdHandler,
  getTransactionsHandler,
  getTransactionsSummaryHandler,
} from "../controllers/transactions.js";

const transactionsRouter = express.Router();
transactionsRouter.get("/", authenticateToken, getTransactionsHandler);
transactionsRouter.get("/:id", authenticateToken, getTransactionsByIdHandler);
transactionsRouter.post("/", authenticateToken, createTransactionsHandler);
transactionsRouter.delete(
  "/:id",
  authenticateToken,
  deleteTransactionsByIdHandler,
);

transactionsRouter.get(
  "/stats/summary",
  authenticateToken,
  getTransactionsSummaryHandler,
);

export default transactionsRouter;
