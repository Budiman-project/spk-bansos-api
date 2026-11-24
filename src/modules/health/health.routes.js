import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

export const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      db: 'up',
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(503).json({
      status: 'degraded',
      db: 'down',
      time: new Date().toISOString()
    });
  }
});