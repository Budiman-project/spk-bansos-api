// The only Vercel Function: every request is rewritten here (vercel.json) and handled by Express,
// which sees the original URL (/api/...). dist/vercel.mjs is produced by `npm run vercel-build`.
export { default } from '../dist/vercel.mjs';
