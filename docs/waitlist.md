# Early-access waitlist

The trainer and typography reference share a localized waitlist button. The form
collects a Telegram username and operating system. A Cloudflare Worker sends
each accepted submission to the owner's private Telegram chat. The browser never
receives the bot token or recipient chat ID.

## Configuration

The public endpoint is configured in `components/waitlist-button.tsx`. Override
it with `NEXT_PUBLIC_WAITLIST_URL` before building a fork. An empty value
disables submissions. Add each frontend origin to `ALLOWED_ORIGINS` in
`workers/waitlist/wrangler.jsonc` before deployment.

Create a bot through Telegram's **@BotFather** and send it `/start` from the
recipient account. Store `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the
ignored `.env.waitlist` file. For this project's bot and owner, running
`node tools/waitlist-setup.mjs` discovers the recipient chat from bot updates.
Forks must adapt the expected bot and owner usernames in that script.

```sh
bunx wrangler@4.132.0 login
bunx wrangler@4.132.0 deploy --config workers/waitlist/wrangler.jsonc
bunx wrangler@4.132.0 secret put TELEGRAM_BOT_TOKEN --config workers/waitlist/wrangler.jsonc
bunx wrangler@4.132.0 secret put TELEGRAM_CHAT_ID --config workers/waitlist/wrangler.jsonc
```

Enter secrets at the CLI prompts; never commit them or place them in public
frontend environment variables. Worker deployment is separate from GitHub Pages.

## Delivery and limits

- Success is displayed only after Telegram confirms delivery.
- Requests require an allowed origin, JSON, a valid username and a supported OS.
- Bodies are limited to 2 KiB; a hidden honeypot rejects basic form spam.
- Rate limits allow ten requests per IP and one per username each minute.
  Cloudflare rate limits are local to its locations, not global deduplication.
- Origin checks do not authenticate clients. Add stronger abuse protection if
  targeted spam appears.
- Submissions are stored as Telegram messages, with no separate database. The
  privacy notice in the form explains this transfer before submission. Typing
  and search content are not sent with the request.
- Delivery errors can be retried. A network timeout after Telegram accepted a
  message can result in a duplicate; the system does not promise exactly-once
  delivery.

Run `node --test tests/waitlist.test.ts` to check validation, rate limiting,
delivery formatting and upstream failures without sending real messages.
