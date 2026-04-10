# Mekhail's CV Portfolio

React + Vite portfolio site with an AI chatbot powered by Cloudflare Workers AI (`@cf/google/gemma-7b-it`). No API keys needed.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) with a verified email

## Setup

```bash
npm install
```

## Local Development

Frontend only (no AI chatbot):
```bash
npm run dev
```

Frontend + AI chatbot (requires Cloudflare auth):
```bash
npx wrangler login   # one-time
npm run build
npm run pages:dev
```

## Deploy to Cloudflare Pages

```bash
npx wrangler login   # one-time
npm run deploy
```

On first deploy, it will prompt you to create a new project. After that, subsequent deploys go straight through.

Your site will be available at the URL printed in the output (e.g. `https://<hash>.cv-portfolio-e0l.pages.dev`).

To set a custom domain, go to **Cloudflare Dashboard → Pages → cv-portfolio → Custom domains**.

## Project Structure

```
src/              → React frontend (Vite)
functions/        → Cloudflare Pages Functions (serverless)
  api/chat.js     → AI chatbot endpoint (Workers AI)
  context.json    → Pre-extracted PDF project documentation
Resources/        → Source PDF documents
public/           → Static assets
wrangler.toml     → Cloudflare Pages config
```

## AI Chatbot

The chatbot uses Cloudflare Workers AI with the `@cf/google/gemma-7b-it` model. Project documentation from the PDFs in `Resources/` is pre-extracted into `functions/context.json` and included as context in every request.

Free tier: 10,000 neurons/day.
