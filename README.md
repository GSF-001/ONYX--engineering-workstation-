<div align="center">

# ⬛ O N Y X — DevOS
### Engineering Workstation

**Retro look. Modern power. Zero noise.**

[![License: MIT](https://img.shields.io/badge/license-MIT-black.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-in%20development-yellow)](#05--project-status)
[![Zero AI](https://img.shields.io/badge/AI%20required-0%25-black)](#02--philosophy)

`01` [Overview](#01--overview) · `02` [Philosophy](#02--philosophy) · `03` [Features](#03--features) · `04` [Preview](#04--preview) · `05` [Project Status](#05--project-status) · `06` [Vision](#06--vision--beyond-v10) · `07` [Architecture](#07--architecture) · `08` [Tech Stack](#08--tech-stack) · `10` [Getting Started](#10--getting-started)

</div>

---

## `01` · Overview

**ONYX** is not just another GitHub dashboard. ONYX is an **operating system built for engineering teams** — complete with a boot screen, desktop, window manager, terminal, and modular applications (*Repository, Pull Requests, Reviews, Insights, Team, Reports, Heatmap*) that all run **in real time** through GitHub webhooks.

<div align="center">

![ONYX Preview](https://raw.githubusercontent.com/GSF-001/ONYX-DevOS/main/file_00000000f1a47207bac6f5d32a9630bd.png)

</div>

---

## `02` · Philosophy

> **Zero AI. Zero heavy compute. Just facts from your git data.**

No AI API key to buy, no subscription to an LLM. Every insight (*Bus Factor, Review Health, Commit Decay,* and more) is computed **statistically** from your own git data — not "analyzed" by a language model. Clone it, run it, free forever.

---

## `03` · Features

| Module | Description |
|---|---|
| `DESKTOP` | Not a page — a window. Open multiple applications at once, drag, resize, snap into layout |
| `LIVE SYNC` | Every piece of data stays connected in real time via GitHub webhooks + WebSocket, no manual refresh |
| `INSIGHTS` | Bus Factor, Review Health, Commit Decay, Stale Radar, Reciprocity Gap, Weekend Heatmap |
| `COMMAND PALETTE` | `Ctrl+K` for power users — open apps, jump to a PR, copy a link, export, all without touching the mouse |
| `THEME ENGINE` | Three visual themes: CRT (retro), Modern, Pixel |
| `AUTH` | Native GitHub OAuth — log in and authorize repositories directly, no separate account |

---

## `04` · Preview

<details open>
<summary><strong>Full Feature Preview</strong></summary>
<br>

![ONYX Full Feature Preview](https://raw.githubusercontent.com/GSF-001/ONYX-DevOS/main/file_000000009bf071fa85f152f58c698511.png)

</details>

<details>
<summary><strong>Desktop — Connected Repository View</strong></summary>
<br>

![ONYX Desktop View](https://raw.githubusercontent.com/GSF-001/ONYX-DevOS/main/file_0000000015d87207a831da887cf158d3.png)

</details>

---

## `05` · Project Status

ONYX is under active development. Here's the honest state of things — **the backend foundation is solid, but the desktop UI doesn't exist yet.** This is real progress, not marketing copy:

```text
SYSTEM STATUS ─────────────────────────────────────────
  AUTH  (OAuth · JWT · CSRF · Session)     [██████████] 100%
  DATABASE  (Schema · Auto-migration)      [██████████] 100%
  WEBHOOK  (Verify → Dispatch → Handlers)  [██████████] 100%
  WEBSOCKET  (Rooms · Broadcast · Live)    [██████████] 100%
  SCORING ENGINE  (Bus Factor, etc.)       [░░░░░░░░░░]   0%
  REST ROUTES  (dashboard, repo, PR, etc.) [░░░░░░░░░░]   0%
  DESKTOP + WINDOW MANAGER                 [░░░░░░░░░░]   0%
  APPLICATIONS  (12 app modules)           [░░░░░░░░░░]   0%
────────────────────────────────────────────────────────
  OVERALL                                  [█████░░░░░]  ~50%
```

What already works today: **GitHub login, incoming webhooks, data persisted to the database, real-time broadcast.** What's still missing: **the actual interface.** This repo is being built module by module, in the open — follow progress in [Issues](../../issues).

---

## `06` · Vision — Beyond v1.0

The `v1.0` roadmap is focused on finishing the desktop OS itself. But the long-term direction for ONYX is bigger than "a dashboard for one team" — two features define that north star:

### `06.1` — ONYX Community *(public, anonymous)*

A public space inside ONYX where engineers can join using an **anonymous handle** — no real name, no company name, no exposed private repos. Inside it, anyone can **opt in to share a snapshot of their dashboard** (Health Score, Bus Factor, review streaks, and more) to casually benchmark against the community, learn how other teams work, or just show off a 92 score without saying whose it is.

> Privacy by design: only the stats a user chooses to share are visible — never raw repository data.

### `06.2` — ONYX Bounty Hub

Two directions at once:

- **Aggregating bounties from the outside** — ONYX pulls bounty-labeled issues from GitHub (and related bounty platforms) into a single place, so people don't have to hunt through repositories one by one. Filterable by language, payout, and tags.
- **Posting bounties from the inside** — individuals or companies can post a bounty directly in ONYX, attached to a specific issue or repository, without building their own system for it.

The end goal: ONYX becomes not just a place to *watch* your team's work, but also a place to *find* new work — for anyone.

> 🔭 Both features above are still at the concept stage and don't exist in the codebase yet. They're documented here to make the project's direction clear from day one — design discussion and contributions are very welcome in [Discussions](../../discussions).

---

## `07` · Architecture

```mermaid
flowchart LR
    subgraph Client["apps/web"]
        L[Landing] --> A[Auth / OAuth]
        A --> B[Boot Sequence]
        B --> D[Desktop]
        D --> WM[Window Manager]
        WM --> APP[Applications]
    end

    subgraph Server["apps/server"]
        AUTH[auth/] --> DB[(PostgreSQL)]
        WH[webhook/] --> DB
        WH --> WS[websocket/]
        SC[scoring/] --> DB
        RT[routes/] --> SVC[services/]
        SVC --> DB
    end

    GH[GitHub API / Webhook] --> WH
    WS -.live updates.-> WM
    APP --> RT
```

**Product flow:** `landing → auth → boot → desktop → window-manager → taskbar → applications`

Every GitHub event (push, PR, review, issue, check run) arrives through `webhook/`, has its signature verified, gets persisted to `db/`, has its score recalculated in `scoring/`, and is broadcast in real time to every client currently viewing that repository through `websocket/` — no polling, no manual refresh.

---

## `08` · Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite · React · TypeScript |
| Backend | Express · TypeScript |
| Database | PostgreSQL · [Drizzle ORM](https://orm.drizzle.team/) |
| Realtime | [Socket.IO](https://socket.io/) |
| Auth | GitHub OAuth 2.0 · JWT (access + refresh) · CSRF double-submit cookie |
| Deployment | Vercel (web) · Railway (server + db) — see [`docs/deploy.md`](./docs/deploy.md) |

---

## `09` · Project Structure

<details>
<summary><strong>apps/server/src</strong> — API, webhooks, scoring engine, database</summary>

```
server/src/
├── auth/            # GitHub OAuth, JWT, session, CSRF, permission/role
├── db/              # Drizzle schema, migrations, queries, seed
├── routes/          # REST endpoints per domain (dashboard, repository, PRs, reviews, etc.)
├── scoring/         # Statistical engine: busFactor, reviewHealth, commitDecay, etc.
├── services/        # GitHub API client, cache, analytics, storage, logger
├── webhook/         # Verify signature → parse → dispatch → onPush/onPullRequest/etc.
├── websocket/       # Socket.IO server: rooms, broadcast, heartbeat, notifications
└── index.ts         # Entrypoint: auto-migrate → listen
```
</details>

<details>
<summary><strong>apps/web/src</strong> — Landing page, boot screen, desktop OS, applications</summary>

```
web/src/
├── auth/            # OAuth callback, repository authorization, auth guard
├── boot/            # Boot sequence, shutdown/restart screen
├── landing/         # Public marketing page before login
├── window-manager/  # Window frame, drag/resize/snap, menu bar
├── websocket/       # Socket client, provider, event subscription hook
├── theme/           # Design tokens + 3 themes (CRT / Modern / Pixel)
├── shared/          # Components, hooks, API client, types, utils shared across apps
├── App.tsx / main.tsx / router.tsx / index.css
```
</details>

---

## `10` · Getting Started

### `10.1` Prerequisites

- Node.js ≥ 20
- PostgreSQL (local, Docker, or cloud such as [Neon](https://neon.tech))
- A [GitHub OAuth App](https://github.com/settings/developers)

### `10.2` Clone & install

```bash
git clone https://github.com/GSF-001/ONYX-DevOS.git
cd ONYX-DevOS
npm install
```

### `10.3` Environment variables

```bash
cp apps/server/.env.example apps/server/.env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | From the OAuth App you created |
| `GITHUB_CALLBACK_URL` | `http://localhost:4000/auth/github/callback` for local dev |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Any long random string |
| `APP_URL` | Frontend URL, `http://localhost:5173` for local dev |

### `10.4` Database

No manual migration command needed — the schema is created/synced automatically on every server start (see `db/migrations.ts`).

### `10.5` Run

```bash
npm run dev
```

| Service | URL |
|---|---|
| Web | http://localhost:5173 |
| API | http://localhost:4000 |

Deploying to production without ever touching a terminal? Follow [`docs/deploy.md`](./docs/deploy.md) (Vercel + Railway + Neon, all through the web dashboard).

---

## `11` · Contributing

Contributions are welcome — read [`CONTRIBUTING.md`](./CONTRIBUTING.md) *(coming soon)* before opening a PR.

```
1. Fork this repository
2. git checkout -b feature/your-feature-name
3. git commit -m "feat: add your-feature-name"
4. Push & open a Pull Request
```

---

## `12` · Links

| | |
|---|---|
| Documentation | [`/docs`](./docs) |
| Report a Bug | [Issues](../../issues) |
| Discussions | [Discussions](../../discussions) |
| Changelog | [`CHANGELOG.md`](./CHANGELOG.md) |
| License | [`LICENSE`](./LICENSE) |

---

## `13` · License

Released under the **MIT License** — use, fork, and modify freely. See [`LICENSE`](./LICENSE) for full details.

<div align="center">
<sub>Built with ☕ and a love for pixel fonts.</sub>
</div>
