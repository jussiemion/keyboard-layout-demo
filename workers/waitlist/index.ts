import {
  normalizeTelegramUsername,
  WAITLIST_PLATFORMS,
} from '../../lib/waitlist.ts';

export type WaitlistEnv = {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  ALLOWED_ORIGINS: string;
  REQUEST_LIMIT: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
  USERNAME_LIMIT: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
};

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) {
    return null;
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    size += value.byteLength;
    if (size > 2048) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

export async function handleWaitlist(
  request: Request,
  env: WaitlistEnv,
  send = fetch,
) {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim());
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
  const reply = (status: number, ok = false) =>
    new Response(JSON.stringify({ ok }), { status, headers });
  if (!origin || !allowed.includes(origin)) {
    return reply(403);
  }
  headers['Access-Control-Allow-Origin'] = origin;
  if (new URL(request.url).pathname !== '/waitlist') {
    return reply(404);
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...headers,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '600',
      },
    });
  }
  if (request.method !== 'POST') {
    return reply(405);
  }
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) {
    return reply(415);
  }
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return reply(503);
  }
  try {
    const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
    if (!(await env.REQUEST_LIMIT.limit({ key: ip })).success) {
      headers['Retry-After'] = '60';
      return reply(429);
    }
    const body = await readBody(request);
    if (
      !body ||
      typeof body.username !== 'string' ||
      typeof body.platform !== 'string' ||
      body.website
    ) {
      return reply(400);
    }
    const username = normalizeTelegramUsername(body.username);
    const platform = body.platform;
    if (!username || !WAITLIST_PLATFORMS.some((value) => value === platform)) {
      return reply(400);
    }
    if (
      !(await env.USERNAME_LIMIT.limit({ key: username.toLowerCase() })).success
    ) {
      headers['Retry-After'] = '60';
      return reply(429);
    }
    const response = await send(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: [
            '🔔 Layout waitlist',
            `Telegram: @${username}`,
            `OS: ${platform}`,
          ].join('\n'),
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    const result: { ok?: boolean } = await response.json();
    return response.ok && result.ok === true ? reply(200, true) : reply(502);
  } catch {
    // Never log upstream errors: Telegram URLs contain the bot token.
    return reply(502);
  }
}

const worker = {
  fetch: (request: Request, env: WaitlistEnv) => handleWaitlist(request, env),
};

export default worker;
