// Server-only environment variable validation
// This module throws on missing critical variables at startup

const requiredEnvVars = [
  'JWT_SECRET',
] as const;

const optionalEnvVars = [
  'DATABASE_URL',
  'EMAIL_API_KEY',
  'EMAIL_FROM',
  'ADMIN_EMAIL',
] as const;

export function validateEnv(): void {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

export function getEnv<K extends keyof typeof envMap>(key: K): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

// Type-safe env access
const envMap = {
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./db/custom.db',
  JWT_SECRET: process.env.JWT_SECRET ?? 'default-secret-change-me',
  EMAIL_API_KEY: process.env.EMAIL_API_KEY ?? '',
  EMAIL_FROM: process.env.EMAIL_FROM ?? '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? '',
} as const;

export { envMap };

// Public client-safe variables
export const publicEnv = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  MONETAG_SRC: process.env.NEXT_PUBLIC_MONETAG_SRC ?? '',
  MONETAG_ZONE: process.env.NEXT_PUBLIC_MONETAG_ZONE ?? '',
} as const;
