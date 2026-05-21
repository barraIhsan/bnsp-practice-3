import { pool } from "../config/db.js";
import { ResponseError } from "../errors/res.js";
import { userSchema } from "../validation/users.js";
import validate from "../validation/validate.js";
import bcrypt from "bcrypt";

export const getUserByUsername = async (username) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username],
  );
  return rows[0] || null;
};

export const getAllUser = async (req) => {
  if (req.user.role !== "admin") {
    throw new ResponseError(403, "Unauthorized");
  }

  const [rows] = await pool.query(
    "SELECT id,username,created_at,role FROM users",
  );

  return rows;
};

export const getCurrentUser = async (req) => {
  const [rows] = await pool.query("SELECT id,username FROM users WHERE id=?", [
    req.user.id,
  ]);

  return rows[0];
};

export const getUserById = async (req) => {
  if (!(req.params.id === req.user.id || req.user.role === "admin")) {
    throw new ResponseError(403, "Unauthorized");
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [
    req.params.id,
  ]);

  if (rows.length === 0) {
    throw new ResponseError(404, "User not found");
  }

  const { password, role, ...user } = rows[0];
  if (req.user.role === "admin") user.role = role;

  return user;
};

export const createUser = async (req) => {
  const validated = validate(userSchema, req.body);
  const { username, password } = validated;

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("inserting:", { username, hashedPassword });
  const [rows] = await pool.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, hashedPassword],
  );

  return {
    id: rows.insertId,
  };
};

export const updateUserById = async (req) => {
  const validated = validate(userSchema, req.body);
  const { username, password } = validated;

  if (!(req.user.role === "admin" || req.params.id === req.user.id)) {
    throw new ResponseError(403, "Unauthorized");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [rows] = await pool.query(
    "UPDATE users SET username=?, password=? WHERE id=?",
    [username, hashedPassword, req.params.id],
  );

  if (rows.affectedRows === 0) {
    throw new ResponseError(404, "User not found");
  }
};

export const deleteUserById = async (req) => {
  if (!(req.user.role === "admin" || req.params.id === req.user.id)) {
    throw new ResponseError(403, "Unauthorized");
  }

  const [rows] = await pool.query("DELETE FROM users WHERE id=?", [
    req.params.id,
  ]);

  if (rows.affectedRows == 0) {
    throw new ResponseError(404, "User not found");
  }
};
