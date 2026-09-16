import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleWaitlist, type WaitlistEnv } from '../workers/waitlist/index.ts';

const env: WaitlistEnv = {
  TELEGRAM_BOT_TOKEN: 'test-token',
  TELEGRAM_CHAT_ID: '123',
  ALLOWED_ORIGINS: 'https://example.com',
  REQUEST_LIMIT: { limit: async () => ({ success: true }) },
  USERNAME_LIMIT: { limit: async () => ({ success: true }) },
};

function request(body: unknown, origin = 'https://example.com') {
  return new Request('https://worker.example/waitlist', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

await test('waitlist sends a normalized contact and platform to the configured chat', async () => {
  let delivered = false;
  const response = await handleWaitlist(
    request({ username: '@example_user', platform: 'Linux' }),
    env,
    async (_url, options) => {
      assert.equal(typeof options?.body, 'string');
      const body = JSON.parse(options?.body as string);
      assert.equal(body.chat_id, '123');
      assert.match(body.text, /Telegram: @example_user\nOS: Linux$/);
      assert.equal(body.parse_mode, undefined);
      delivered = true;
      return Response.json({ ok: true });
    },
  );
  assert.equal(delivered, true);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

const invalidCases = [
  {
    name: 'unknown origin',
    body: {},
    origin: 'https://evil.example',
    status: 403,
  },
  {
    name: 'invalid username',
    body: { username: 'a\nb', platform: 'Linux' },
    status: 400,
  },
  {
    name: 'unknown OS',
    body: { username: 'example_user', platform: 'Other' },
    status: 400,
  },
  {
    name: 'honeypot',
    body: { username: 'example_user', platform: 'Linux', website: 'spam' },
    status: 400,
  },
  { name: 'oversized body', body: { username: 'a'.repeat(2100) }, status: 400 },
];

for (const scenario of invalidCases) {
  await test(`waitlist rejects ${scenario.name} without contacting Telegram`, async () => {
    const response = await handleWaitlist(
      request(scenario.body, scenario.origin),
      env,
      async () => {
        throw new Error('Telegram must not be called');
      },
    );
    assert.equal(response.status, scenario.status);
  });
}

await test('waitlist does not report success when Telegram rejects delivery', async () => {
  const response = await handleWaitlist(
    request({ username: 'example_user', platform: 'Windows' }),
    env,
    async () => Response.json({ ok: false }, { status: 403 }),
  );
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false });
});

await test('waitlist rate limit stops delivery', async () => {
  const response = await handleWaitlist(
    request({ username: 'example_user', platform: 'macOS' }),
    { ...env, REQUEST_LIMIT: { limit: async () => ({ success: false }) } },
    async () => {
      throw new Error('Telegram must not be called');
    },
  );
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
});
