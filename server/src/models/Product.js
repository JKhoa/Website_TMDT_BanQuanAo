import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  price: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  sale_price: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  subcategory: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  brand: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  material: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  sizes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  colors: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_best_seller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_new_arrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_flash_sale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'products'
});

export default Product;
