import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql
  .createPool({
    host: process.env.MARIADB_HOST || "localhost",
    user: process.env.MARIADB_USER || "root",
    password: process.env.MARIADB_PASSWORD || "",
    database: process.env.MARIADB_DATABASE || "kasir_db",
  })
  .promise();
