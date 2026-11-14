// Cloudflare Worker Handler for Stimulx (stimulx.in)
// Serves the static app and the Stimulx Copilot API.
// Set the key with: wrangler secret put GEMINI_API_KEY

import { handleCopilot } from './server/copilot.mjs';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/copilot') {
      return handleCopilot(request, env);
    }
    try {
      return await env.ASSETS.fetch(request);
    } catch (err) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
