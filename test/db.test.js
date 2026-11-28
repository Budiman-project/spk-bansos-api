import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// src/config/env.js needs a DATABASE_URL at import time; the pool it creates never connects here
process.env.DATABASE_URL ??= 'postgresql://user:pass@localhost:5432/db';
const { pool, poolConfig } = await import('../src/lib/db.js');
await pool.end();

describe('poolConfig', () => {
  it('encrypts Supabase connections without verifying the certificate (sslmode=require)', () => {
    const { config } = poolConfig(
      'postgresql://postgres.abc:pw@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true',
    );
    assert.deepEqual(config.ssl, { rejectUnauthorized: false });
    assert.equal(new URL(config.connectionString).search, '');
  });

  it('uses SSL for a Supabase host even without sslmode', () => {
    const { config } = poolConfig('postgresql://postgres:pw@db.abc.supabase.co:5432/postgres');
    assert.deepEqual(config.ssl, { rejectUnauthorized: false });
  });

  it('uses no SSL for a local database and keeps the Prisma schema parameter out of the URL', () => {
    const { config, schema } = poolConfig('postgresql://spk:pw@localhost:5432/spk_bansos?schema=public');
    assert.equal(config.ssl, undefined);
    assert.equal(schema, 'public');
    assert.equal(new URL(config.connectionString).search, '');
  });

  it('honours sslmode=disable', () => {
    const { config } = poolConfig('postgresql://postgres:pw@db.abc.supabase.co:5432/postgres?sslmode=disable');
    assert.equal(config.ssl, undefined);
  });

  it('leaves verify-full to pg', () => {
    const { config } = poolConfig('postgresql://u:p@db.example.com:5432/d?sslmode=verify-full');
    assert.equal(config.ssl, undefined);
    assert.match(config.connectionString, /sslmode=verify-full/);
  });
});
