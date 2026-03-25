# Trie Username Demo

A focused full-stack demo that shows how an in-memory Trie can improve username availability checks and suggestion quality while still using PostgreSQL as the source of truth.

## What This Project Aims To Show

This project demonstrates a practical pattern:

1. Keep **persistent data** in PostgreSQL.
2. Use an **in-memory Trie** for fast membership checks and smarter suggestion generation.
3. Expose both through a clean API and a lightweight UI.

The goal is not to build a production-ready identity platform, but to show the core idea clearly:

- Why Trie lookups are useful for username-like strings.
- How to integrate a Trie with backend service/repository layers.
- How to keep frontend UX responsive with debounced availability checks.

## Core Demo Features

- Create usernames and store them in PostgreSQL.
- List all stored usernames.
- Check username availability.
- Return alternative suggestions when a username is already taken.
- Hydrate the Trie from DB on startup so suggestions/checks are immediately useful.
- Client UI integrated with API and debounced availability calls.

## Tech Stack

- Backend: Fastify + TypeScript
- Database: PostgreSQL (`pg`)
- In-memory index: Custom Trie implementation
- Frontend: Vanilla JS modules + Tailwind (CDN)

## Project Structure

```text
src/
  app.ts                     # server bootstrap, route/plugin registration
  configs/env.ts             # env configuration
  db/
    pool.ts                  # PostgreSQL pool
    init.ts                  # DB table init
  handlers/                  # HTTP handlers
  interface/                 # route and model typings
  plugins/
    client.plugin.ts         # serves client assets
  repository/
    username.repository.ts   # DB access layer
  routes/
    username.routes.ts       # API route definitions
  services/
    username.service.ts      # business logic + Trie orchestration
  trie/
    trie.ts                  # Trie + suggestion logic
client/
  index.html
  scripts/
    main.js
    controller.js
    api.js
    ui.js
    validation.js
    config.js
```

## API Endpoints

Base prefix: `/api/v1`

- `POST /usernames`
  - Body: `{ "username": "alice" }`
  - Creates username if available.
- `GET /usernames`
  - Returns all usernames.
- `GET /usernames/availability?username=alice`
  - Returns availability and suggestions.

Health endpoint:

- `GET /health`

## Why Trie Here?

A Trie is effective when you need repeated operations on many strings sharing prefixes.

For username use cases:

- `search(word)` gives fast existence checks.
- Prefix-based methods can support autocompletion and smart alternatives.
- It can reduce repeated DB calls for high-frequency checks.

In this demo, DB remains authoritative, and Trie is a high-speed helper.

## How Suggestion Logic Works

The current suggestion strategy:

- Normalizes and sanitizes input username.
- Builds readable candidate patterns (suffix/prefix variants, compact variants).
- Validates candidates against allowed username pattern.
- Checks candidate availability before returning suggestions.

This balances readability and practical utility over random-number-only suggestions.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Set these in `.env`:

```env
HOST=127.0.0.1
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trie
```

### 3. Run in development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

Open the app at:

- `http://127.0.0.1:3000/`

## What This Demo Does Not Cover Yet

- Trie persistence (the Trie is rebuilt from DB at startup).
- Auth, ownership, and rate limiting.
- Multi-instance consistency (shared cache or distributed index).
- Test suite and performance benchmarks.
- Advanced linguistic suggestion ranking.

## Going Beyond Demo Scope

If you want to use Tries in real products, here are practical next steps.

### 1. Add production-grade validation and guardrails

- Enforce server-side schema validation for request body/query.
- Add reserved-word blocklists (`admin`, `support`, `api`, etc.).
- Add profanity and brand-protection filters.

### 2. Improve consistency in distributed systems

When you run multiple app instances:

- Keep DB as source of truth.
- Broadcast username insert events via queue/pub-sub.
- Update per-instance Trie incrementally from those events.
- Add periodic reconciliation from DB snapshots.

### 3. Make suggestions smarter

- Score candidates by readability, brevity, and uniqueness.
- Prefer word-aware transformations over brute suffixing.
- Use user context (locale, domain, personal name tokens).
- Add ranking feedback loops from accepted/rejected suggestions.

### 4. Introduce persistence or external indexing

Options:

- Serialize Trie snapshots to Redis or object storage.
- Build Trie at startup from precomputed compressed index.
- Keep a fallback path to DB for correctness.

### 5. Add observability and reliability

- Track latency for availability checks and suggestion generation.
- Add structured logs and tracing around route/service boundaries.
- Add load tests for high-concurrency availability calls.

### 6. Add tests

- Unit tests for Trie operations and suggestion generation.
- Service tests for availability and DB fallback behavior.
- Integration tests for route contracts.

## Real-World Problems Tries Can Help Solve

Beyond usernames, Tries are useful for:

- Search auto-complete (products, tags, commands).
- Prefix routing and path matching.
- Spell-check and typo assistance.
- Keyword filtering/moderation pipelines.
- IP routing tables (bitwise trie variants).
- Dictionary lookups and tokenization.

## Summary

This project is a compact example of combining:

- Persistent storage (PostgreSQL)
- Fast in-memory indexing (Trie)
- Clean API boundaries
- Usable client experience

It gives you a practical base to evolve into a production-grade username service or adapt Trie patterns for other string-heavy real-world problems.
