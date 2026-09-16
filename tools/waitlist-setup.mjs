import { readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { parseEnv } from 'node:util';

const file = '.env.waitlist';
const env = parseEnv(readFileSync(file, 'utf8'));
const token = env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('Add TELEGRAM_BOT_TOKEN to .env.waitlist first.');
}
async function telegram(method) {
  let response;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      'Telegram connection failed. Check your connection and try again.',
    );
  }
  const body = await response.json();
  if (!response.ok || !body.ok) {
    throw new Error(`Telegram rejected ${method}; verify the bot token.`);
  }
  return body.result;
}
const bot = await telegram('getMe');
if (bot.username !== 'YushkevichLayoutWaitlistBot') {
  throw new Error(
    'Token belongs to a different bot. Expected @YushkevichLayoutWaitlistBot.',
  );
}
if (!env.TELEGRAM_CHAT_ID) {
  const updates = await telegram('getUpdates');
  const message = updates
    .map((update) => update.message)
    .findLast(
      (entry) =>
        entry?.chat?.type === 'private' &&
        entry.from?.username?.toLowerCase() === 'jussiemion',
    );
  if (!message) {
    throw new Error(
      'Send /start to the bot from @jussiemion, then rerun this command.',
    );
  }
  env.TELEGRAM_CHAT_ID = String(message.chat.id);
  const existing = readFileSync(file, 'utf8').trimEnd();
  writeFileSync(
    file,
    existing + '\nTELEGRAM_CHAT_ID=' + env.TELEGRAM_CHAT_ID + '\n',
    { mode: 0o600 },
  );
}
chmodSync(file, 0o600);
console.log(
  'Verified @' +
    bot.username +
    '; recipient chat is configured. No message was sent.',
);
