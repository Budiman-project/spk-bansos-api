// Entry for the Vercel deployment: the Express app as a request handler (no app.listen; Vercel calls
// it per request). Bundled by scripts/build-vercel.mjs into dist/vercel.mjs, which api/index.js serves.
import { createApp } from './app.js';

export default createApp();
