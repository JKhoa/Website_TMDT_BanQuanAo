import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  shipping_fee: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.STRING,
    defaultValue: 'cod'
  },
  shipping_method: {
    type: DataTypes.STRING,
    defaultValue: 'standard'
  },
  shipping_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_city: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  shipping_district: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  shipping_ward: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'orders'
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_image: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  price: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  tableName: 'order_items'
});

export { Order, OrderItem };
