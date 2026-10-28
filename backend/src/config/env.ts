import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_imcX4KCsu6xJ@ep-odd-brook-b4sk2o63-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
  jwt: {
    secret: process.env.JWT_SECRET || 'superconsciousness_development_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'superconsciousness_development_refresh_secret_change_in_production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  },
} as const;

export type Config = typeof config;
