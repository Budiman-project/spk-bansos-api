import pg from 'pg';
import { env } from '../config/env.js';

// One pg connection pool per process, shared by Prisma (src/lib/prisma.js) and the session store
// (src/lib/session.js), so a serverless instance on Vercel opens as few connections as possible.

// Query parameters that are meant for Prisma's CLI or libpq, not for node-postgres
const IGNORED_PARAMS = ['schema', 'pgbouncer', 'connection_limit', 'pool_timeout', 'uselibpqcompat'];
const SSL_PARAMS = ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'];

// Turns DATABASE_URL into a pg PoolConfig.
//
// Supabase connection strings use `sslmode=require`. pg 8.x treats that as verify-full, which fails
// against Supabase's certificate chain ("self-signed certificate in certificate chain"). Like libpq's
// `require`, we encrypt the connection without verifying the certificate. `sslmode=verify-full` /
// `verify-ca` are left to pg as they are; `sslmode=disable` (or a local database) means no SSL.
export function poolConfig(databaseUrl) {
  const url = new URL(databaseUrl);
  const sslmode = url.searchParams.get('sslmode');
  const schema = url.searchParams.get('schema') ?? undefined;
  const isSupabase = /\.supabase\.(co|com)$/.test(url.hostname);

  for (const param of IGNORED_PARAMS) url.searchParams.delete(param);

  let ssl;
  if (sslmode === 'verify-full' || sslmode === 'verify-ca') {
    // pg handles these itself, from the URL
  } else {
    for (const param of SSL_PARAMS) url.searchParams.delete(param);
    const wantsSsl = sslmode ? sslmode !== 'disable' : isSupabase;
    if (wantsSsl) ssl = { rejectUnauthorized: false };
  }

  return {
    schema,
    config: {
      connectionString: url.toString(),
      ssl,
      max: env.dbPoolMax,
      // On Vercel an instance may be frozen between requests; don't hold idle connections long
      idleTimeoutMillis: env.isVercel ? 5_000 : 10_000,
      connectionTimeoutMillis: 10_000,
    },
  };
}

const { config, schema } = poolConfig(env.databaseUrl);

export const dbSchema = schema;

export const pool = new pg.Pool(config);

// An idle connection dropped by the server (e.g. the Supabase pooler) must not crash the process
pool.on('error', (err) => {
  console.error('Postgres pool error:', err.message);
});
