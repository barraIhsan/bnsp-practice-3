CREATE DATABASE kasir_db;
USE kasir_db;

CREATE TABLE users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'kasir') DEFAULT 'kasir',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(12,2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_no VARCHAR(50) UNIQUE NOT NULL,
  cashier_id INT NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  paid DECIMAL(12,2) NOT NULL,
  change_amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cashier_id) REFERENCES users(id)
);

CREATE TABLE transaction_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed data
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$Y37epuFh1Xs/QCCWhXdinOKybRbWDt2AvJXj1X7BFdjBgNlrHid9.', 'admin');

INSERT INTO products (name, category, price, stock) VALUES
('Nasi Goreng', 'Makanan', 15000, 100),
('Mie Ayam', 'Makanan', 12000, 100),
('Es Teh', 'Minuman', 5000, 200),
('Kopi', 'Minuman', 8000, 150),
('Air Mineral', 'Minuman', 3000, 300);
