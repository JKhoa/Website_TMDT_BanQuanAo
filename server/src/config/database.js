import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, isAbsolute, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const dialect = process.env.DB_DIALECT || 'sqlite';
const logging = process.env.NODE_ENV === 'development' ? console.log : false;
const baseConfig = {
  dialect,
  logging,
  define: {
    timestamps: true,
    underscored: true
  }
};

function resolveSqliteStorage(storageValue) {
  const fallbackStorage = join(__dirname, '..', '..', 'database.sqlite');
  if (!storageValue) {
    return fallbackStorage;
  }

  return isAbsolute(storageValue)
    ? storageValue
    : join(__dirname, '..', '..', storageValue);
}

let sequelize;

if (dialect === 'sqlite') {
  const storage = resolveSqliteStorage(process.env.DB_STORAGE);
  mkdirSync(dirname(storage), { recursive: true });

  sequelize = new Sequelize({
    ...baseConfig,
    storage
  });
} else if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL, {
    ...baseConfig,
    dialectOptions: process.env.DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : undefined
  });
} else {
  sequelize = new Sequelize({
    ...baseConfig,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialectOptions: process.env.DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : undefined
  });
}


export default sequelize;
