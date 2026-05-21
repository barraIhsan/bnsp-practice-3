import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  createProductsHandler,
  deleteProductsByIdHandler,
  getProductsHandler,
  updateProductsByIdHandler,
} from "../controllers/products.js";

const productsRouter = express.Router();
productsRouter.get("/", getProductsHandler);
productsRouter.post("/", authenticateToken, createProductsHandler);
productsRouter.put("/:id", authenticateToken, updateProductsByIdHandler);
productsRouter.delete("/:id", authenticateToken, deleteProductsByIdHandler);

export default productsRouter;
