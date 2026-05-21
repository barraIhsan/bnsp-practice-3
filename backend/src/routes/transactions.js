import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  createTransactionsHandler,
  deleteTransactionsByIdHandler,
  getTransactionsByIdHandler,
  getTransactionsHandler,
} from "../controllers/transactions.js";

const transactionsRouter = express.Router();
transactionsRouter.get("/", getTransactionsHandler);
transactionsRouter.get("/:id", getTransactionsByIdHandler);
transactionsRouter.post("/", authenticateToken, createTransactionsHandler);
transactionsRouter.delete(
  "/:id",
  authenticateToken,
  deleteTransactionsByIdHandler,
);

export default transactionsRouter;
