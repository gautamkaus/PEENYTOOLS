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
  }
);

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  original_price: { type: DataTypes.FLOAT, allowNull: true },
  discounted_price: { type: DataTypes.FLOAT, allowNull: true },
  discount: { type: DataTypes.FLOAT, allowNull: true },
});

const ProductRate = sequelize.define('ProductRate', {
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  rate: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'product_rate',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Order = sequelize.define('Order', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  upi_id: { type: DataTypes.STRING },
  transaction_id: { type: DataTypes.STRING },
  total: { type: DataTypes.FLOAT, allowNull: false },
});

const OrderItem = sequelize.define('OrderItem', {
  duration: { type: DataTypes.INTEGER, allowNull: false },
  price_per_month: { type: DataTypes.FLOAT, allowNull: false },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
});

const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  duration: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Product rate relationships
Product.hasMany(ProductRate, { foreignKey: 'product_id', as: 'rates' });
ProductRate.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(CartItem);
CartItem.belongsTo(User);
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

module.exports = {
  sequelize,
  User,
  Product,
  ProductRate,
  Order,
  OrderItem,
  CartItem,
}; 