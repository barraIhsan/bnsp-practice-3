import express from "express";
import {
  createUserHandler,
  deleteUserByIdHandler,
  getAllUserHandler,
  getCurrentUserHandler,
  getUserByIdHandler,
  updateUserByIdHandler,
} from "../controllers/users.js";
import { authenticateToken } from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.get("/", authenticateToken, getAllUserHandler);
userRouter.get("/me", authenticateToken, getCurrentUserHandler);
userRouter.get("/:id", authenticateToken, getUserByIdHandler);
userRouter.post("/", createUserHandler);
userRouter.put("/:id", authenticateToken, updateUserByIdHandler);
userRouter.delete("/:id", authenticateToken, deleteUserByIdHandler);

export default userRouter;
