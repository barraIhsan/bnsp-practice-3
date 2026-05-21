import express from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.js";
import { authenticateToken } from "../middleware/auth.js";

const authRouter = express.Router();
authRouter.post("/register", authenticateToken, registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/refresh", refreshHandler);

export default authRouter;
