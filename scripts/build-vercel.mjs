// Vercel build (`npm run vercel-build`, run by Vercel before it packages api/index.js):
//
// 1. Bundles src/vercel.js + all of src/ into dist/vercel.mjs with esbuild. The Prisma client is
//    generated as TypeScript (src/generated/prisma/*.ts); bundling turns it into plain JavaScript, so
//    the function does not depend on how Vercel treats .ts files. npm packages stay external (Vercel
//    traces and includes them from node_modules).
// 2. Applies pending migrations to the database when DIRECT_URL is set (Supabase: the direct/session
//    connection on port 5432; migrations do not work through the transaction pooler on 6543).
//
// `npm install` has already run `prisma generate` (postinstall).
import { execSync } from 'node:child_process';
import { build } from 'esbuild';

await build({
  entryPoints: ['src/vercel.js'],
  outfile: 'dist/vercel.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  packages: 'external',
  sourcemap: 'linked',
  logLevel: 'info',
});

if (process.env.DIRECT_URL) {
  console.log('DIRECT_URL is set: applying migrations (prisma migrate deploy)');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} else {
  console.log('DIRECT_URL is not set: skipping migrations (run `npx prisma migrate deploy` yourself)');
}
