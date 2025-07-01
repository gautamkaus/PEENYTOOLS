const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Log env vars related to DB (just for debugging - remove in prod)
console.log("🔧 DB config:");
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://93.127.206.203',
    'https://www.pennytools.store',
    'http://www.pennytools.store'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Function to connect to DB and start server
async function startServer() {
  const maxRetries = 5;
  let retries = maxRetries;

  while (retries > 0) {
    try {
      console.log(`🔄 Attempting DB connection... (${maxRetries - retries + 1}/${maxRetries})`);
      await sequelize.authenticate();
      console.log('✅ Database connection established.');

      app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
      });

      break; // Exit loop if success
    } catch (err) {
      console.error(`❌ Database connection failed: ${err.message}`);
      if (--retries === 0) {
        console.error('💥 Exiting: Could not connect to DB after multiple attempts.');
        process.exit(1);
      }
      console.log('⏳ Retrying in 5 seconds...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

startServer();
