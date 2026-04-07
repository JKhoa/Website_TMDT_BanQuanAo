import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from './src/models/index.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';
import logger from './src/utils/logger.js';

import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import orderRoutes from './src/routes/orders.js';
import adminRoutes from './src/routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded assets
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Rate limiting
app.use('/api/', apiLimiter);

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint không tồn tại' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Lỗi server' : err.message
  });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connected');

    await sequelize.sync();
    logger.info('✅ Database synced');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
      logger.info(`📡 API: http://localhost:${PORT}/api`);
      console.log(`\n🚀 FashionShop API running at http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    logger.error('❌ Server startup error:', error);
    process.exit(1);
  }
}

start();
