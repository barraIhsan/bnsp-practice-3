import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import transactionRoutes from "./routes/transactions.js";
import { errorMiddleware } from "./middleware/error.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(errorMiddleware);

app.listen(3000, () => console.log("Server running on port 3000"));
