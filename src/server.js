import app from './app.js';
import { env } from './config/env.js';
import { pool } from './lib/db.js';
import { prisma } from './lib/prisma.js';
import { sessionStore } from './lib/session.js';


const server = app.listen(env.port, () => {
  console.log(`spk-bansos-api listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close();
  await Promise.all([prisma.$disconnect(), sessionStore.close()]);
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
