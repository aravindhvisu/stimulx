export default {
  async fetch(request, env) {
    try {
      return await env.ASSETS.fetch(request);
    } catch (err) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
