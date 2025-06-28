-- Update products table to support duration-based pricing
-- Run this script in your MySQL database

-- Add new duration-based pricing columns
ALTER TABLE products 
ADD COLUMN price_1_month FLOAT NOT NULL DEFAULT 0.00,
ADD COLUMN price_3_months FLOAT NOT NULL DEFAULT 0.00,
ADD COLUMN price_6_months FLOAT NOT NULL DEFAULT 0.00,
ADD COLUMN price_12_months FLOAT NOT NULL DEFAULT 0.00;

-- Remove old pricing columns (optional - you can keep them for backup)
-- ALTER TABLE products DROP COLUMN original_price;
-- ALTER TABLE products DROP COLUMN discounted_price;
-- ALTER TABLE products DROP COLUMN discount;

-- Update existing products with sample duration-based pricing
-- You can modify these values as needed
UPDATE products SET 
  price_1_month = 49.99,
  price_3_months = 139.99,
  price_6_months = 259.99,
  price_12_months = 499.99
WHERE id > 0;

-- Verify the changes
SELECT id, name, price_1_month, price_3_months, price_6_months, price_12_months FROM products;

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL DEFAULT 1,
  duration INT NOT NULL,
  UserId INT NOT NULL,
  ProductId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (ProductId) REFERENCES Products(id) ON DELETE CASCADE
); 