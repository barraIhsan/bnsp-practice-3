import jwt from "jsonwebtoken";
import { ResponseError } from "../errors/res.js";

export const authenticateToken = (req, _res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new ResponseError(401, "Missing Authorization header");
  }

  const [scheme, token] = authHeader && authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new ResponseError(401, "Invalid Authorization header");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new ResponseError(401, "Invalid or expired token");
    }
    req.user = decoded;
    next();
  });
};
