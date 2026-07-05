<div align="center">

#  O N Y X — DevOS
### Engineering Workstation

**Retro look. Modern power. Zero noise.**

[

![License](https://img.shields.io/github/license/GSF-001/ONYX-DevOS?style=flat-square&color=0a0a0a&labelColor=000000)

](./LICENSE)
[

![Node](https://img.shields.io/badge/node-%E2%89%A520-000000?style=flat-square&logo=node.js&logoColor=339933)

](https://nodejs.org)
[

![TypeScript](https://img.shields.io/badge/TypeScript-strict-000000?style=flat-square&logo=typescript&logoColor=3178C6)

](https://www.typescriptlang.org/)
[

![Last Commit](https://img.shields.io/github/last-commit/GSF-001/ONYX-DevOS?style=flat-square&color=0a0a0a&labelColor=000000)

](../../commits/main)
[

![Stars](https://img.shields.io/github/stars/GSF-001/ONYX-DevOS?style=flat-square&color=0a0a0a&labelColor=000000)

](../../stargazers)
[

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-000000?style=flat-square)

](#09--contributing)
[

![Zero AI](https://img.shields.io/badge/AI%20required-0%25-000000?style=flat-square)

](#02--philosophy)

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

## `05` · Architecture

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

## `06` · Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite · React · TypeScript |
| Backend | Express · TypeScript |
| Database | PostgreSQL · [Drizzle ORM](https://orm.drizzle.team/) |
| Realtime | [Socket.IO](https://socket.io/) |
| Auth | GitHub OAuth 2.0 · JWT (access + refresh) · CSRF double-submit cookie |
| Deployment | Vercel (web) · Railway (server + db) |

<details>
<summary><strong>Project Structure</strong></summary>

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

web/src/
├── auth/            # OAuth callback, repository authorization, auth guard
├── boot/            # Boot sequence, shutdown/restart screen
├── landing/         # Public marketing page before login
├── window-manager/  # Window frame, drag/resize/snap, menu bar
├── websocket/       # Socket client, provider, event subscription hook
├── theme/           # Design tokens + 3 themes (CRT / Modern / Pixel)
├── shared/          # Components, hooks, API client, types, utils shared across apps
└── App.tsx / main.tsx / router.tsx / index.css
```
</details>

> The tree above only covers what's implemented so far. The full planned structure (including `applications/`, `taskbar/`, `terminal/`, `desktop/`, and more) lives in [`struktur.md`](./struktur%20awal.md).

> 📌 Full structure (including `applications/`, `taskbar/`, `terminal/`, etc.) is documented in [`struktur awal.md`](./struktur%20awal.md).

---

## `07` · Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL (local, Docker, or cloud such as [Neon](https://neon.tech))
- A [GitHub OAuth App](https://github.com/settings/developers)

### Clone & install

```bash
git clone https://github.com/GSF-001/ONYX-DevOS.git
cd ONYX-DevOS
npm install
```

### Environment variables

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

Database schema is created/synced automatically on server start — no manual migration command needed.

### Run

```bash
npm run dev
```

| Service | URL |
|---|---|
| Web | http://localhost:5173 |
| API | http://localhost:4000 |

---

## `08` · Roadmap

- [x] Auth — GitHub OAuth, JWT, session, CSRF
- [x] Database schema + auto-migration
- [x] Webhook pipeline (verify → parse → dispatch → handlers)
- [x] WebSocket real-time layer
- [ ] Scoring engine (Bus Factor, Review Health, Commit Decay, etc.)
- [ ] REST routes (dashboard, repository, PRs, reviews, insights, etc.)
- [ ] Landing page
- [ ] Boot sequence + Desktop + Window Manager
- [ ] Applications (Dashboard, Repository, PRs, Reviews, Issues, Insights, Team, Reports, Heatmap, Terminal)
- [ ] Command Palette (`Ctrl+K`)
- [ ] Settings (theme switcher: CRT / Modern / Pixel)

Detailed progress is tracked in [Issues](../../issues) and [Projects](../../projects).

---

## `09` · Contributing

Contributions are welcome — read [`CONTRIBUTING.md`](./CONTRIBUTING.md) *(coming soon)* before opening a PR.

```
1. Fork this repository
2. git checkout -b feature/your-feature-name
3. git commit -m "feat: add your-feature-name"
4. Push & open a Pull Request
```

---

## Links

| | |
|---|---|
| Documentation | [`/docs`](./docs) |
| Report a Bug | [Issues](../../issues) |
| Roadmap / Project Board | [Projects](../../projects) |
| Discussions | [Discussions](../../discussions) |
| License | [`LICENSE`](./LICENSE) |

---

## License

Released under the **MIT License** — use, fork, and modify freely. See [`LICENSE`](./LICENSE) for full details.

<div align="center">
<sub>Built with ☕ and a love for pixel fonts.</sub>
</div>
