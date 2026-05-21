import { ResponseError } from "../errors/res.js";
import { userSchema } from "../validation/users.js";
import validate from "../validation/validate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "./users.js";

export const register = async (req) => {
  await createUser(req);
};

export const login = async (req, res) => {
  const { username, password } = validate(userSchema, req.body);

  const user = await getUserByUsername(username);
  const targetHash = user ? user.password : process.env.DUMMY_HASH;
  const passwordMatch = await bcrypt.compare(password, targetHash);

  if (!user || !passwordMatch) {
    throw new ResponseError(401, "Username or password is incorrect");
  }

  // generate token
  const payload = { id: user.id, username: user.username, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // set cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    username: user.username,
    accessToken,
  };
};

export const logout = async (res) => {
  // clear cookie
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ResponseError(401, "Refresh token is missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (err) {
    throw new ResponseError(403, "Invalid or expired refresh token");
  }

  // generate new token
  const payload = {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
  };

  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  // set cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken: newAccessToken,
  };
};
