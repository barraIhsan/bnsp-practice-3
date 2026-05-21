import { pool } from "../config/db.js";
import { ResponseError } from "../errors/res.js";
import { productsSchema } from "../validation/products.js";
import validate from "../validation/validate.js";

export const getProducts = async (req) => {
  if (!(req.user.role === "admin" || req.user.role === "kasir")) {
    throw new ResponseError(403, "Unauthorized");
  }
  const { search, category } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND name LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  query += " ORDER BY created_at DESC";

  const [rows] = await pool.query(query, params);
  return rows;
};

export const createProducts = async (req) => {
  if (req.user.role !== "admin") {
    throw new ResponseError(403, "Unauthorized");
  }

  const validated = validate(productsSchema, req.body);
  const { name, category, price, stock } = validated;

  const [rows] = await pool.query(
    `INSERT INTO products (name, category, price, stock) VALUES (?,?,?,?)`,
    [name, category, price, stock],
  );

  return {
    id: rows.insertId,
  };
};

export const updateProductsById = async (req) => {
  if (req.user.role !== "admin") {
    throw new ResponseError(403, "Unauthorized");
  }

  const validated = validate(productsSchema, req.body);
  const { name, category, price, stock } = validated;

  const [rows] = await pool.query(
    "UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?",
    [name, category, price, stock, req.params.id],
  );

  if (rows.affectedRows === 0) {
    throw new ResponseError(404, "Products not found");
  }
};

export const deleteProductsById = async (req) => {
  if (req.user.role !== "admin") {
    throw new ResponseError(403, "Unauthorized");
  }

  const [rows] = await pool.query("DELETE FROM products WHERE id=?", [
    req.params.id,
  ]);

  if (rows.affectedRows == 0) {
    throw new ResponseError(404, "Products not found");
  }
};
