import { createApp } from '../backend/src/app';

// Ensure required environment variables have fallback defaults for cloud deployments
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://neondb_owner:npg_imcX4KCsu6xJ@ep-odd-brook-b4sk2o63-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'superconsciousness_development_jwt_secret_change_in_production';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'superconsciousness_development_refresh_secret_change_in_production';
}

const app = createApp();

export default app;

