-- Example: How to populate the product_rate table
-- Replace the product_id values with actual product IDs from your products table

-- Sample data for product_rate table
INSERT INTO product_rate (product_id, duration, rate, created_at, updated_at) VALUES
(1, 1, 49.99, NOW(), NOW()),
(1, 3, 139.99, NOW(), NOW()),
(1, 6, 259.99, NOW(), NOW()),
(1, 12, 499.99, NOW(), NOW()),

(2, 1, 29.99, NOW(), NOW()),
(2, 3, 79.99, NOW(), NOW()),
(2, 6, 149.99, NOW(), NOW()),

(3, 1, 39.99, NOW(), NOW()),
(3, 6, 199.99, NOW(), NOW()),
(3, 12, 399.99, NOW(), NOW());

-- Query to see all product rates
SELECT 
    p.name as product_name,
    pr.duration,
    pr.rate
FROM product_rate pr
JOIN products p ON pr.product_id = p.id
ORDER BY p.name, pr.duration; 