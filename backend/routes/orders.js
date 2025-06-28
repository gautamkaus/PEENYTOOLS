const express = require('express');
const { Order, OrderItem, Product, User, sequelize } = require('../models');
const isAdmin = require('../middleware/isAdmin');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

// Place an order (now requires authentication and sets UserId)
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.id;
    const { name, email, phone, upi_id, transaction_id, items } = req.body;
    if (!name || !email || !phone || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    let total = 0;
    items.forEach(item => {
      total += item.total_price;
    });
    const order = await Order.create({ name, email, phone, upi_id, transaction_id, total, UserId: userId });
    for (const item of items) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.product_id,
        duration: item.duration,
        price_per_month: item.price_per_month,
        total_price: item.total_price,
      });
    }
    res.json({ success: true, orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: 'Order failed' });
  }
});

// List all orders (admin only) - Now with nested product details
router.get('/', isAdmin, async (req, res) => {
  const orders = await Order.findAll({ 
    include: [
      { model: OrderItem, include: [Product] },
      User
    ],
    order: [['createdAt', 'DESC']]
  });
  res.json(orders);
});

// Get dashboard analytics (admin only)
router.get('/analytics', isAdmin, async (req, res) => {
    try {
        const totalRevenue = await Order.sum('total');
        const totalSales = await Order.count();
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

        const productPerformance = await OrderItem.findAll({
            attributes: [
                'ProductId',
                [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue'],
                [sequelize.fn('COUNT', sequelize.col('OrderItem.id')), 'salesCount'],
            ],
            include: [{ model: Product, attributes: ['name', 'image'] }],
            group: ['ProductId', 'Product.id'],
            order: [[sequelize.literal('revenue'), 'DESC']],
        });

        const monthlySales = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('total')), 'revenue'],
                [sequelize.fn('COUNT', sequelize.col('Order.id')), 'sales'],
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
        });

        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{model: User, attributes: ['name']}]
        });

        res.json({
            totalRevenue: totalRevenue || 0,
            totalSales: totalSales || 0,
            averageOrderValue: averageOrderValue || 0,
            productPerformance,
            monthlySales,
            recentOrders,
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});

// Get order history for the logged-in user
router.get('/my', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.id;
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

module.exports = router; 