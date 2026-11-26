import os from 'node:os';
import path from 'node:path';

// Single place that reads process.env. Locally it is filled by `node --env-file=.env`,
// in Docker by docker-compose, on Vercel by the project's Environment Variables.
const isProduction = process.env.NODE_ENV === 'production';
// Set by Vercel in every deployment (serverless functions: read-only disk except /tmp)
const isVercel = Boolean(process.env.VERCEL);

const required = ['DATABASE_URL', ...(isProduction ? ['SESSION_SECRET'] : [])];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key} (see .env.example)`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction,
  isVercel,
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  // Connections per process. Serverless instances each get their own pool, so keep it small there.
  dbPoolMax: Number(process.env.DB_POOL_MAX ?? (isVercel ? 3 : 10)),
  // On Vercel only /tmp is writable, and it is not kept between instances: photos uploaded there are
  // for demonstration only (they disappear when the instance is recycled).
  uploadDir: process.env.UPLOAD_DIR ?? (isVercel ? path.join(os.tmpdir(), 'spk-uploads') : 'uploads'),
  // Signs the session cookie. Dev fallback only; production refuses to start without one.
  sessionSecret: process.env.SESSION_SECRET ?? 'dev-only-insecure-session-secret',
  sessionMaxAgeHours: Number(process.env.SESSION_MAX_AGE_HOURS ?? 8),
};
