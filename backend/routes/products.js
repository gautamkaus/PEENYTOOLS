const express = require('express');
const { Product, ProductRate } = require('../models');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Get all products with their rates
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: ProductRate,
        as: 'rates',
        attributes: ['duration', 'rate']
      }]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product with its rates
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: ProductRate,
        as: 'rates',
        attributes: ['duration', 'rate']
      }]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add a product (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { rates, ...productData } = req.body;
    const product = await Product.create(productData);
    
    // Add product rates if provided
    if (rates && Array.isArray(rates)) {
      const rateData = rates.map(rate => ({
        product_id: product.id,
        duration: rate.duration,
        rate: rate.rate
      }));
      await ProductRate.bulkCreate(rateData);
    }
    
    // Return product with rates
    const productWithRates = await Product.findByPk(product.id, {
      include: [{
        model: ProductRate,
        as: 'rates',
        attributes: ['duration', 'rate']
      }]
    });
    
    res.json(productWithRates);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(400).json({ error: 'Failed to add product', details: err.message });
  }
});

// Update a product (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { rates, ...productData } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.update(productData);
    
    // Update product rates if provided
    if (rates && Array.isArray(rates)) {
      // Delete existing rates
      await ProductRate.destroy({ where: { product_id: product.id } });
      
      // Add new rates
      const rateData = rates.map(rate => ({
        product_id: product.id,
        duration: rate.duration,
        rate: rate.rate
      }));
      await ProductRate.bulkCreate(rateData);
    }
    
    // Return product with rates
    const productWithRates = await Product.findByPk(product.id, {
      include: [{
        model: ProductRate,
        as: 'rates',
        attributes: ['duration', 'rate']
      }]
    });
    
    res.json(productWithRates);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Delete a product (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Delete associated rates first
    await ProductRate.destroy({ where: { product_id: product.id } });
    
    // Delete the product
    await product.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

module.exports = router; 