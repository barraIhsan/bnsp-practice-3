import { pool } from "../config/db.js";
import { ResponseError } from "../errors/res.js";
import { transactionsSchema } from "../validation/transactions.js";
import validate from "../validation/validate.js";

export const getTransactions = async (req) => {
  if (!(req.user.role === "admin" || req.user.role === "kasir")) {
    throw new ResponseError(403, "Unauthorized");
  }
  const [rows] = await pool.query(`
    SELECT t.*, u.username as cashier_name 
    FROM transactions t 
    JOIN users u ON t.cashier_id = u.id 
    ORDER BY t.created_at DESC 
    LIMIT 50
  `);
  return rows;
};

export const getTransactionsById = async (req) => {
  if (!(req.user.role === "admin" || req.user.role === "kasir")) {
    throw new ResponseError(403, "Unauthorized");
  }
  const [rows] = await pool.query(
    "SELECT t.*, u.username as cashier_name FROM transactions t JOIN users u ON t.cashier_id=u.id WHERE t.id=?",
    [req.params.id],
  );

  if (!rows[0]) {
    throw new ResponseError(404, "Transactions not found");
  }

  const [items] = await pool.query(
    "SELECT ti.*, p.name as product_name FROM transaction_items ti JOIN products p ON ti.product_id=p.id WHERE ti.transaction_id=?",
    [req.params.id],
  );

  return {
    ...rows[0],
    items,
  };
};

export const createTransactions = async (req) => {
  if (!(req.user.role === "admin" || req.user.role === "kasir")) {
    throw new ResponseError(403, "Unauthorized");
  }

  const validated = validate(transactionsSchema, req.body);
  const { items, paid } = validated;
  const cashier_id = req.user.id;

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const change_amount = paid - total;

  if (change_amount < 0) {
    throw new ResponseError(400, "Paid amount is less than total");
  }

  const invoice_no = `INV-${Date.now()}`;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO transactions (invoice_no, cashier_id, total, paid, change_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [invoice_no, cashier_id, total, paid, change_amount],
    );

    const transaction_id = result.insertId;

    for (const item of items) {
      const subtotal = item.price * item.qty;

      const [stock] = await conn.query(
        "SELECT stock FROM products WHERE id = ?",
        [item.product_id],
      );

      if (!stock[0])
        throw new ResponseError(404, `Product ID ${item.product_id} not found`);
      if (stock[0].stock < item.qty)
        throw new ResponseError(
          400,
          `Insufficient stock for product ID ${item.product_id}`,
        );

      await conn.query(
        `INSERT INTO transaction_items (transaction_id, product_id, qty, price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [transaction_id, item.product_id, item.qty, item.price, subtotal],
      );

      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.qty,
        item.product_id,
      ]);
    }

    await conn.commit();
    return { id: transaction_id, invoice_no, total, change: change_amount };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const deleteTransactionsById = async (req) => {
  if (req.user.role !== "admin") {
    throw new ResponseError(403, "Unauthorized");
  }

  const [existing] = await pool.query(
    "SELECT * FROM transactions WHERE id = ?",
    [req.params.id],
  );

  if (!existing[0]) {
    throw new ResponseError(404, "Transaction not found");
  }

  const [items] = await pool.query(
    "SELECT * FROM transaction_items WHERE transaction_id = ?",
    [req.params.id],
  );

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const item of items) {
      await conn.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
        item.qty,
        item.product_id,
      ]);
    }

    await conn.query("DELETE FROM transaction_items WHERE transaction_id = ?", [
      id,
    ]);
    await conn.query("DELETE FROM transactions WHERE id = ?", [req.params.id]);

    await conn.commit();
    return { message: `Transaction ${existing[0].invoice_no} deleted` };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getTransactionsSummary = async (req) => {
  if (!(req.user.role === "admin" || req.user.role === "kasir")) {
    throw new ResponseError(403, "Unauthorized");
  }
  const [today] = await pool.query(
    "SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM transactions WHERE DATE(created_at) = CURDATE()",
  );
  const [total] = await pool.query(
    "SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM transactions",
  );
  const [products] = await pool.query("SELECT COUNT(*) as count FROM products");

  return {
    today_transactions: today[0].count,
    today_revenue: today[0].revenue,
    total_transactions: total[0].count,
    total_revenue: total[0].revenue,
    total_products: products[0].count,
  };
};
