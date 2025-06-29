const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();

// Configure CORS for cloud environment
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://www.peenytools.store' , 'http://localhost:8080'], // Add your cloud domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;

// Test database connection and start server
async function startServer() {
  let retries = 3;
  
  while (retries > 0) {
    try {
      console.log(`Testing database connection... (attempt ${4 - retries}/3)`);
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
      return; // Success, exit the retry loop
    } catch (error) {
      retries--;
      console.error(`❌ Database connection failed (${4 - retries}/3):`, error.message);
      
      if (retries > 0) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('❌ Failed to start server after 3 attempts:', error.message);
        process.exit(1);
      }
    }
  }
}

startServer(); 