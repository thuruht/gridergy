import { IsoStreamer } from './durable_objects/IsoStreamer';

export { IsoStreamer }; // Export DO class for Cloudflare bindings

export interface Env {
  DB: D1Database;
  ISO_STREAMER: DurableObjectNamespace;
  LIGHTNING_WEBHOOK_SECRET: string; // HMAC secret
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. WebSocket Stream Route (Handled by Durable Object)
    if (url.pathname.startsWith('/stream/')) {
      const id = env.ISO_STREAMER.idFromName('GLOBAL_STREAMER');
      const obj = env.ISO_STREAMER.get(id);
      return obj.fetch(request);
    }

    // 2. Lightning Webhook Route (NWC / Strike / LNBits)
    if (url.pathname === '/api/webhooks/lightning' && request.method === 'POST') {
      const signature = request.headers.get('x-signature');
      const payload = await request.text();

      if (!signature || !(await verifyHmacSha256(payload, signature, env.LIGHTNING_WEBHOOK_SECRET))) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Process payment, update D1...
      // e.g., JSON.parse(payload)
      return new Response('OK', { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // 5-minute cron trigger (e.g. telling the FastApi ingestion service to scrape)
    console.log(`Cron triggered at ${event.cron}`);
    // fetch('https://ingestion-service.internal/scrape')
  }
};

/**
 * Verify HMAC-SHA256 signature for incoming webhooks
 */
async function verifyHmacSha256(payload: string, signature: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  // Assuming signature is hex encoded
  const sigBuf = new Uint8Array(signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

  return await crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(payload));
}
