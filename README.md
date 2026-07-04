# ONYX — Engineering Workstation

> Retro look. Modern power. Zero noise.

ONYX bukan dashboard GitHub biasa. ONYX adalah **operating system** khusus buat engineering team — boot screen, desktop, window manager, terminal, dan aplikasi modular (Repository, Pull Requests, Reviews, Insights, Team, Reports, Heatmap) yang semuanya jalan real-time lewat GitHub webhook.

**Zero AI. Zero heavy compute. Just facts from your git data.**

Gak ada API key AI yang harus lo beli. Semua insight (Bus Factor, Review Health, Commit Decay, dst) dihitung dari data git lo sendiri secara statistik — bukan minta LLM buat "menganalisa". Clone, jalanin, gratis.

## Stack

- **Frontend:** Vite + React + TypeScript
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL + Prisma
- **Realtime:** WebSocket (native `ws`)
- **Auth:** GitHub OAuth

## Struktur

```
apps/
├── server/    → API, webhook GitHub, scoring engine, database
└── web/       → Landing page, boot screen, desktop OS, aplikasi
```

## Getting Started

### 1. Prasyarat
- Node.js ≥ 20
- PostgreSQL (lokal atau lewat Docker)
- GitHub OAuth App ([buat di sini](https://github.com/settings/developers))

### 2. Install

```bash
git clone https://github.com/<username>/onyx.git
cd onyx
npm install
```

### 3. Setup environment

```bash
cp .env.example .env
```

Isi `.env` dengan:
- `DATABASE_URL` — koneksi Postgres lo
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — dari OAuth App yang lo buat
- `GITHUB_WEBHOOK_SECRET` — secret buat verifikasi webhook

### 4. Setup database

```bash
npm run db:generate
npm run db:migrate
```

### 5. Jalankan

```bash
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:4000

## Roadmap

- [ ] Landing page
- [ ] GitHub OAuth + Authorize Repository
- [ ] Boot sequence
- [ ] Desktop + Window Manager
- [ ] Dashboard app
- [ ] Repository, Pull Requests, Reviews, Issues app
- [ ] Insights (Bus Factor, Review Health, Commit Decay, dst)
- [ ] Team, Reports, Heatmap app
- [ ] Terminal (power user mode)
- [ ] Command Palette (`Ctrl+K`)
- [ ] Settings (theme: CRT / Modern / Pixel)

## License

MIT — pakai, fork, modifikasi bebas.
