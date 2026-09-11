# GNX Sales private operations console

This is a separate Next.js deployment from the customer frontend. Configure
the Vercel project root as `frontend/admin-console` and attach a randomized
neutral hostname. The app proxies `/api/*` to the shared backend, but the
backend only serves `/ops-auth`, `/ops`, and `/ops-support` when the configured
admin host, Cloudflare Access assertion, and edge shared secret all match.

The console does not use customer auth cookies or subscription state. An admin
must be manually provisioned with:

```sh
cd backend
npm run admin:provision -- --email you@example.com --role owner
```

The first login enrolls an authenticator-app TOTP. Keep the real hostname,
Cloudflare values, and encryption key in deployment secrets only.
