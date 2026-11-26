// Prisma 7 does not load .env by itself; dotenv is a no-op inside Docker,
// where DATABASE_URL comes from docker-compose.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  // Used by the CLI only (migrate, studio); the app connects through src/lib/db.js.
  // DIRECT_URL first: on Supabase, DATABASE_URL is the transaction pooler (port 6543), which
  // migrations can't use; DIRECT_URL is the direct/session connection (port 5432).
  // process.env (not prisma's env() helper) so `prisma generate` works during
  // `docker build` / `npm install` on Vercel, where the URLs may not be set yet.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
