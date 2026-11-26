import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { dbSchema, pool } from './db.js';

// One client per process, on the shared pool (src/lib/db.js). Import this, never `new PrismaClient()`
// elsewhere.
const adapter = new PrismaPg(pool, dbSchema ? { schema: dbSchema } : undefined);

export const prisma = new PrismaClient({ adapter });
