import { checkRateLimit } from './ratelimit';
import { fetchLiveStats, type Env } from './telemetry';
import { handleChat } from './chat';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // 1. Rate limiting check
    if (!checkRateLimit(clientIP, 30, 60000)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please cool down.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Telemetry endpoint
    if (url.pathname === '/api/telemetry') {
      const stats = await fetchLiveStats(env);
      return new Response(JSON.stringify(stats), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // 3. AI Chat endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },

  // Daily Scheduled Cron Trigger for telemetry KV caching
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(fetchLiveStats(env));
  },
};
