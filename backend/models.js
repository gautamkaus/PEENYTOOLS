const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 120000,
      ssl: false,
      charset: 'utf8mb4'
    },
    retry: {
      max: 5,
      timeout: 30000
    }
  }
);

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'users',
  timestamps: true,
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  original_price: { type: DataTypes.FLOAT },
  discounted_price: { type: DataTypes.FLOAT },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  discount: { type: DataTypes.FLOAT },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'products',
  timestamps: true,
});

const ProductRate = sequelize.define('ProductRate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  rate: { type: DataTypes.FLOAT, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false },
  updated_at: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'product_rate',
  timestamps: false,
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  upi_id: { type: DataTypes.STRING },
  transaction_id: { type: DataTypes.STRING },
  total: { type: DataTypes.FLOAT, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
  UserId: { type: DataTypes.INTEGER },
}, {
  tableName: 'orders',
  timestamps: true,
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  price_per_month: { type: DataTypes.FLOAT, allowNull: false },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
  OrderId: { type: DataTypes.INTEGER },
  ProductId: { type: DataTypes.INTEGER },
}, {
  tableName: 'orderitems',
  timestamps: true,
});

const Order_Items = sequelize.define('Order_Items', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  price_per_month: { type: DataTypes.FLOAT, allowNull: false },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, {
  tableName: 'order_items',
  timestamps: false,
});

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
  UserId: { type: DataTypes.INTEGER },
  ProductId: { type: DataTypes.INTEGER },
}, {
  tableName: 'cartitems',
  timestamps: true,
});

// Associations
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });
Order.hasMany(OrderItem, { foreignKey: 'OrderId' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });
Product.hasMany(OrderItem, { foreignKey: 'ProductId' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductId' });

// Product rate relationships
Product.hasMany(ProductRate, { foreignKey: 'product_id', as: 'rates' });
ProductRate.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(CartItem, { foreignKey: 'UserId' });
CartItem.belongsTo(User, { foreignKey: 'UserId' });
Product.hasMany(CartItem, { foreignKey: 'ProductId' });
CartItem.belongsTo(Product, { foreignKey: 'ProductId' });

// order_items table associations
Order.hasMany(Order_Items, { foreignKey: 'order_id' });
Order_Items.belongsTo(Order, { foreignKey: 'order_id' });
Product.hasMany(Order_Items, { foreignKey: 'product_id' });
Order_Items.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  User,
  Product,
  ProductRate,
  Order,
  OrderItem,
  Order_Items,
  CartItem,
}; 