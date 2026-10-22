# Akshat Mishra — Backend Engineer Portfolio

A premium dark-themed personal portfolio built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and React.

## Features

- Responsive landing page and navigation
- Interactive notification request-flow explorer
- Browser-only memoization/cache simulator
- Expandable fintech engineering case studies
- Accessible labels and reduced reliance on motion
- Optional visitor registration form backed by Supabase\n- Private password-protected lead dashboard at `/admin` with CSV export\n- Optional server-side WhatsApp visitor alerts via Twilio (requires credentials and WhatsApp setup)

## Requirements

- Node.js 20.9+ (Node.js 22 recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run typecheck
npm run build
```

The `lint` script is a placeholder for a lint configuration if you choose to add ESLint.


## Visitor registrations and private lead dashboard

This feature stores details only when a visitor voluntarily submits the form. It does not identify every anonymous page view.

1. Create a Supabase project at https://supabase.com/.
2. Open Supabase **SQL Editor** and run `supabase-schema.sql`.
3. In Supabase Project Settings -> API, copy the Project URL and **service_role** key. The service-role key is server-only; never prefix it with `NEXT_PUBLIC_`.
4. Copy `.env.example` to `.env.local` and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_DASHBOARD_PASSWORD` (use a unique password of at least 12 characters), and `ADMIN_SESSION_SECRET` (at least 32 random characters). Generate a secret with `openssl rand -base64 32`.
5. Install dependencies and start the app:
   ```bash
   npm install
   npm run dev
   ```
6. Submit a test registration on the home page, then open `http://localhost:3000/admin` and sign in with `ADMIN_DASHBOARD_PASSWORD`.

The admin session is stored in an HTTP-only, same-site cookie signed with `ADMIN_SESSION_SECRET` and expires after eight hours. The dashboard API checks this session on the server. Supabase row-level security is enabled with no public policies; server routes use the service-role key. Add a deployment-level rate limiter (for example, a managed rate-limiting service) before promoting this form to a high-traffic production site. Basic honeypot and same-origin checks are not a complete anti-abuse system.

Before deploying to Vercel, set the same environment variables under Project Settings -> Environment Variables, redeploy, and test `/admin` on the deployed domain. Do not commit `.env.local`.
## Visitor email alerts (optional)

The site can send an email through Resend when a new browser tab visits the portfolio and when a lead is successfully saved. Visit alerts include only the page path, timestamp, and referrer hostname; they do not identify the visitor. Visit alerts are deduplicated per tab session. The API has best-effort per-instance throttling, so use a shared rate limiter for a high-traffic production site.

1. Create a Resend API key and verify a sending domain/address in Resend.
2. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (an allowed sender), and `PORTFOLIO_ALERT_EMAIL` (the inbox that receives alerts) in `.env.local`. Never commit `.env.local`.
3. Set `SITE_URL` to the exact site origin, such as `http://192.168.1.3:3001` locally or the deployed HTTPS origin in production.
4. Restart `npm run dev` and open the site in a fresh tab. For deployment, set the same values in the hosting provider's environment settings and redeploy.

## Before publishing

1. Replace `YOUR_EMAIL_HERE` with your professional email.
2. Replace the GitHub and LinkedIn placeholder URLs with your real profiles.
3. Add a real resume PDF and link to it.
4. Verify every project description, responsibility, and result.
5. Add only metrics you can substantiate.
6. Review the site for employer-confidential information.
7. Update `metadataBase` in `src/app/layout.tsx` after the deployed URL is known.
8. Run the production build.

## Deploy to Vercel

1. Create a GitHub repository and push this project.
2. Import the repository into Vercel.
3. Keep the detected Next.js framework and default build settings.
4. Deploy and verify the live site on the assigned `*.vercel.app` URL.
5. Add a custom domain later if desired.

## Content integrity

The diagrams and simulators are illustrative. They are not production telemetry or proof of specific throughput. Confirm the context of any claimed business outcomes before publishing. Do not add proprietary code, secrets, or customer information.
