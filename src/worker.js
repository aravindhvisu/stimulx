// Cloudflare Worker Handler for Stimulx (stimulx.in)
// Serves the static app, the study hosting API (D1 binding "DB") and the Stimulx Copilot API.
// Set the Gemini key with: wrangler secret put GEMINI_API_KEY

import { handleCopilot } from './server/copilot.mjs';
import { handleStudies, d1Database } from './server/studies.mjs';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/copilot') {
      return handleCopilot(request, env);
    }
    if (pathname === '/api/studies' || pathname.startsWith('/api/studies/')) {
      return handleStudies(request, d1Database(env.DB));
    }
    try {
      return await env.ASSETS.fetch(request);
    } catch (err) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
