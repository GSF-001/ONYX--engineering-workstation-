# Integrasi Module ONYX ke dalam `trace/` (ONYX Engineering Workstation / Review Radar)

Mengikuti pattern yang sudah ada di `apps/web/src/applications/*` dan `apps/server/src/*`, **dan** wajib ikut aturan UI konsistensi di bawah biar module baru ga kelihatan "beda app".

## 🎨 Aturan Konsistensi UI (WAJIB, berlaku untuk SEMUA module baru)

Diambil langsung dari screenshot Core yang sudah jalan (Review Radar v1.0.0):

1. **Title bar format**: `{APPNAME} v1.0.0 - CONNECTED TO: {REPO/CONTEXT}`
   Contoh existing: `REVIEW RADAR v1.0.0 - CONNECTED TO: GSF-SIM-UNIVERSE`
   Module baru: `MARKETPLACE v1.0.0 - CONNECTED TO: GSF-SIM-UNIVERSE`, `GROUPS v1.0.0 - CONNECTED TO: ONYX://CORE`, dst.
   → Implementasi: satu shared component `shared/components/AppTitleBar.tsx` yang terima prop `appName` + `context`, dipakai oleh SEMUA `*Window.tsx`. Jangan bikin title bar custom per-module.

2. **Icon desktop**: pixel-art retro, label teks di bawah icon, grid rapi (5 kolom seperti existing: Dashboard, Insights, PR, Reviews, Issues / Team, Reports, Repository, Heatmap, Terminal / Settings). Icon module baru (Bounties, Community, Groups, Marketplace, Plugins, Explorer, Profile) HARUS dibuat dengan gaya pixel yang sama — bukan flat/modern icon. Taruh asset di `desktop/icons/` biar satu sumber.

3. **Taskbar** format: `Start | {app aktif...} | ... | 🔊 LIVE SYNC {n} | jam`.
   Module baru yang dibuka otomatis nambah tombol di taskbar (lihat `taskbar/RunningApps.tsx` existing) — tidak perlu file baru, cukup pastikan module baru register ke `WindowManager` yang sama.

4. **Status bar bawah** (khusus Dashboard/Core): `READY | SYNCED | LATENCY {n}ms | WATCHING | GITHUB CONNECTED | {n} EVENTS | CPU [bar] | MEM [bar] | ● LIVE`.
   Module baru punya STATUS BAR SENDIRI per window (bukan pakai status bar Core), tapi format kata harus konsisten, misal:
   - Marketplace → `READY | {n} PLUGINS | REGISTRY CONNECTED | ● LIVE`
   - Groups → `READY | {n} ONLINE | SYNCED | ● LIVE`
   - Bounties → `READY | LAST SYNC {n} AGO | {n} SOURCES CONNECTED | ● LIVE`

5. **Terminal command list**: format existing di `terminal/TerminalCommands.ts` adalah `{command}` → `Open {x} window`. Module baru WAJIB nambah entry dengan format sama:
   ```
   bounty     Open bounties window
   community  Open community window
   group      Open groups window
   market     Open marketplace window
   plugin     Open plugins window
   explorer   Open explorer window
   profile    Open profile window
   ```
   Semua tetap ikut pola `<command> --help` dan `clear` yang sudah ada.

6. **Start Menu**: setiap module baru otomatis harus terdaftar di Start Menu (`taskbar/StartMenu.tsx`) dengan icon + label yang sama seperti di desktop grid — satu sumber data (`desktop/icons/registry.ts`), jangan duplikat listing.

7. **Theme system** (`Settings.tsx` existing: Retro Default / Dark / CRT Green / Modern Light + Accent Color): SEMUA module baru wajib konsumsi `theme/tokens.ts` yang sama via `useTheme()` hook. Tidak ada module yang boleh hardcode warna sendiri atau punya theme switcher lokal. Kalau ganti ke "CRT Green", Bounties/Community/dll ikut berubah otomatis.

---

## 📁 Struktur Folder

```
trace/
└── apps/
    ├── server/
    │   └── src/
    │       ├── auth/
    │       │   ├── githubOAuth.ts
    │       │   ├── session.ts
    │       │   ├── ...(existing)
    │       │   ├── identity.ts              ⭐ BARU (generate ONYX://NAME anonim, cooldown 30 hari)
    │       │   └── index.ts
    │       │
    │       ├── bounties/                    ⭐ BARU (ONYX = jembatan/aggregator + platform native)
    │       │   ├── external/
    │       │   │   ├── githubConnector.ts   (search issues label "bounty"/"$" via GitHub Search API)
    │       │   │   ├── gitlabConnector.ts
    │       │   │   ├── codebergConnector.ts
    │       │   │   ├── forgejoConnector.ts
    │       │   │   ├── normalizer.ts        (samain format tiap sumber -> BountyTypes schema)
    │       │   │   ├── parser.ts            (extract reward $ dari judul/label/body issue)
    │       │   │   ├── dedupe.ts            (issue yang sama muncul di >1 sumber)
    │       │   │   ├── sync.ts              (cron job, refresh berkala biar ga stale)
    │       │   │   ├── cache.ts             (biar ga spam-hit rate limit API tiap sumber)
    │       │   │   ├── redirect.ts          (generate link balik ke issue asli)
    │       │   │   └── index.ts
    │       │   ├── native/                  (ONYX sebagai platform bounty sendiri)
    │       │   │   ├── companies.ts         (akun company yang publish bounty)
    │       │   │   ├── individuals.ts
    │       │   │   ├── publish.ts           (create bounty asli di ONYX)
    │       │   │   ├── manage.ts            (edit/close/cancel)
    │       │   │   ├── rewards.ts           (payout logic — kalau nanti ada escrow/payment)
    │       │   │   └── index.ts
    │       │   ├── list.ts                  (gabung External + Native — Discover/Trending/Categories/Saved/History)
    │       │   ├── search.ts
    │       │   ├── difficulty.ts
    │       │   └── index.ts
    │       │
    │       ├── community/                  ⭐ BARU
    │       │   ├── feed.ts
    │       │   ├── trending.ts
    │       │   ├── projects.ts
    │       │   ├── developers.ts
    │       │   ├── discussions.ts
    │       │   ├── events.ts
    │       │   ├── showcase.ts
    │       │   ├── leaderboard.ts
    │       │   └── index.ts
    │       │
    │       ├── groups/                     ⭐ BARU
    │       │   ├── publicGroups.ts
    │       │   ├── privateGroups.ts
    │       │   ├── anonymousGroups.ts       (ONYX://CORE, ONYX://BUILDERS, dst)
    │       │   ├── membership.ts
    │       │   ├── invite.ts
    │       │   ├── chat.ts                  (pasangan websocket/rooms.ts)
    │       │   ├── files.ts
    │       │   ├── activity.ts
    │       │   ├── announcements.ts
    │       │   └── index.ts
    │       │
    │       ├── marketplace/                ⭐ BARU
    │       │   ├── list.ts                  (Featured/Trending/New/Categories)
    │       │   ├── install.ts
    │       │   ├── installQueue.ts
    │       │   ├── search.ts
    │       │   ├── manifestValidator.ts     (baca manifest.json plugin)
    │       │   └── index.ts
    │       │
    │       ├── plugin-system/               ⭐ BARU (core plugin engine, dipakai marketplace + plugins app)
    │       │   ├── PluginManager.ts
    │       │   ├── PluginRegistry.ts
    │       │   ├── PluginLoader.ts
    │       │   ├── PluginInstaller.ts
    │       │   ├── PluginUpdater.ts
    │       │   ├── PluginUninstaller.ts
    │       │   ├── PluginValidator.ts
    │       │   ├── PluginPermissions.ts
    │       │   ├── PluginSandbox.ts
    │       │   └── index.ts
    │       │
    │       ├── reputation/                 ⭐ BARU
    │       │   ├── contributionScore.ts
    │       │   ├── reviewScore.ts
    │       │   ├── pluginScore.ts
    │       │   ├── bountyScore.ts
    │       │   ├── trustScore.ts
    │       │   ├── totalReputation.ts
    │       │   └── index.ts
    │       │
    │       ├── webhook/ ...(existing, tidak berubah)
    │       ├── websocket/
    │       │   ├── ...(existing)
    │       │   ├── communityFeed.ts        ⭐ BARU
    │       │   ├── groupChat.ts            ⭐ BARU
    │       │   └── bountyUpdates.ts        ⭐ BARU
    │       │
    │       ├── db/
    │       │   ├── schema.ts               (tambah tabel: bounties_external_cache (index doang),
    │       │   │                            bounties_native (data asli, punya ONYX), groups,
    │       │   │                            group_members, community_posts, plugins,
    │       │   │                            plugin_installs, identities, reputation_scores)
    │       │   └── ...(existing)
    │       │
    │       ├── scoring/ ...(existing, tidak berubah)
    │       ├── services/ ...(existing, tidak berubah)
    │       │
    │       ├── routes/
    │       │   ├── ...(existing)
    │       │   ├── bounties.ts             ⭐ BARU
    │       │   ├── community.ts            ⭐ BARU
    │       │   ├── groups.ts               ⭐ BARU
    │       │   ├── marketplace.ts          ⭐ BARU
    │       │   ├── plugins.ts              ⭐ BARU
    │       │   ├── identity.ts             ⭐ BARU
    │       │   └── index.ts
    │       │
    │       └── index.ts
    │
    └── web/
        └── src/
            ├── ...(App.tsx, main.tsx, router.tsx, index.css — tidak berubah)
            │
            ├── shared/components/
            │   ├── ...(existing)
            │   ├── AppTitleBar.tsx          ⭐ BARU (title bar standar semua window, WAJIB dipakai)
            │   ├── AppStatusBar.tsx         ⭐ BARU (status bar per-window, format konsisten)
            │   ├── ReputationBadge.tsx      ⭐ BARU
            │   ├── IdentityAvatar.tsx       ⭐ BARU (dipakai Community, Groups, Profile, Terminal)
            │   └── PluginCard.tsx           ⭐ BARU (dipakai Marketplace + Plugins)
            │
            ├── desktop/icons/
            │   ├── registry.ts              ⭐ BARU (satu sumber data icon: Start Menu + Desktop Grid)
            │   └── ...(icon assets pixel style, existing style dipertahankan)
            │
            ├── identity/                    ⭐ BARU (screen "Choose Your ONYX Identity")
            │   ├── IdentityPicker.tsx       (list ONYX://PIXEL, ONYX://NOVA, dst)
            │   ├── IdentityPreview.tsx      (avatar + Developer ID)
            │   ├── GenerateIdentityButton.tsx
            │   ├── ConfirmIdentity.tsx
            │   ├── IdentityCooldown.ts      (1x ganti / 30 hari)
            │   ├── IdentityStore.ts
            │   ├── IdentityAPI.ts
            │   └── index.ts
            │
            ├── window-manager/ ...(existing, tidak berubah — semua app baru pakai WindowFrame yang sama)
            │
            ├── terminal/
            │   ├── ...(existing)
            │   └── TerminalCommands.ts      (tambah: bounty, community, group, market, plugin,
            │                                 explorer, profile — format sama seperti dashboard/repo/pr)
            │
            └── applications/
                ├── ...(Dashboard, Repository, PullRequests, Reviews, Issues,
                │       Insights, Team, Reports, Heatmap, Activity, Terminal,
                │       Settings — existing, tidak berubah)
                │
                ├── Bounties/                ⭐ BARU (External aggregator + Native platform)
                │   ├── BountiesApp.tsx
                │   ├── BountiesWindow.tsx   (pakai AppTitleBar: "BOUNTIES v1.0.0 - CONNECTED TO: ...")
                │   ├── Home.tsx
                │   ├── Discover.tsx
                │   ├── Trending.tsx
                │   ├── Categories.tsx
                │   ├── Search.tsx
                │   ├── Filters.tsx
                │   ├── Saved.tsx
                │   ├── History.tsx
                │   ├── External/
                │   │   ├── GitHub.tsx
                │   │   ├── GitLab.tsx
                │   │   ├── Codeberg.tsx
                │   │   ├── Forgejo.tsx
                │   │   └── SourceList.tsx
                │   ├── Native/
                │   │   ├── Companies.tsx
                │   │   ├── Individuals.tsx
                │   │   ├── Rewards.tsx
                │   │   ├── Publish.tsx
                │   │   └── Manage.tsx
                │   ├── Widgets/
                │   │   ├── RewardCard.tsx
                │   │   ├── DifficultyBadge.tsx
                │   │   ├── DeadlineBadge.tsx
                │   │   └── SourceBadge.tsx
                │   ├── BountiesAPI.ts
                │   ├── BountiesStore.ts
                │   ├── BountiesHooks.ts
                │   ├── BountiesTypes.ts
                │   ├── BountiesStyles.css
                │   └── index.ts
                │
                ├── Community/               ⭐ BARU
                │   ├── CommunityApp.tsx
                │   ├── CommunityWindow.tsx
                │   ├── Feed.tsx
                │   ├── Explore.tsx
                │   ├── Trending.tsx
                │   ├── Projects.tsx
                │   ├── Developers.tsx
                │   ├── Discussions.tsx
                │   ├── Showcase.tsx
                │   ├── Events.tsx
                │   ├── Leaderboard.tsx
                │   ├── Widgets/
                │   │   ├── ProjectCard.tsx
                │   │   ├── DeveloperCard.tsx
                │   │   ├── EventCard.tsx
                │   │   └── DiscussionCard.tsx
                │   ├── CommunityAPI.ts
                │   ├── CommunityStore.ts
                │   ├── CommunityHooks.ts
                │   ├── CommunityTypes.ts
                │   ├── CommunityStyles.css
                │   └── index.ts
                │
                ├── Groups/                  ⭐ BARU
                │   ├── GroupsApp.tsx
                │   ├── GroupsWindow.tsx
                │   ├── PublicGroups.tsx
                │   ├── PrivateGroups.tsx
                │   ├── AnonymousGroups.tsx
                │   ├── CreateGroup.tsx
                │   ├── InviteMembers.tsx
                │   ├── Dashboard.tsx
                │   ├── Chat.tsx
                │   ├── Files.tsx
                │   ├── Activity.tsx
                │   ├── Announcements.tsx
                │   ├── Widgets/
                │   │   ├── MemberCard.tsx
                │   │   ├── GroupCard.tsx
                │   │   ├── OnlineUsers.tsx
                │   │   └── ActivityItem.tsx
                │   ├── GroupsAPI.ts
                │   ├── GroupsStore.ts
                │   ├── GroupsHooks.ts
                │   ├── GroupsTypes.ts
                │   ├── GroupsStyles.css
                │   └── index.ts
                │
                ├── Marketplace/             ⭐ BARU
                │   ├── MarketplaceApp.tsx
                │   ├── MarketplaceWindow.tsx
                │   ├── Home.tsx
                │   ├── Featured.tsx
                │   ├── Trending.tsx
                │   ├── Categories.tsx
                │   ├── Search.tsx
                │   ├── Installed.tsx
                │   ├── Updates.tsx
                │   ├── InstallQueue.tsx
                │   ├── Widgets/
                │   │   ├── PluginCard.tsx
                │   │   ├── Rating.tsx
                │   │   ├── InstallButton.tsx
                │   │   └── UpdateBadge.tsx
                │   ├── MarketplaceAPI.ts
                │   ├── MarketplaceStore.ts
                │   ├── MarketplaceHooks.ts
                │   ├── MarketplaceTypes.ts
                │   ├── MarketplaceStyles.css
                │   └── index.ts
                │
                ├── Plugins/                 ⭐ BARU (manager plugin yang sudah terinstall)
                │   ├── PluginsApp.tsx
                │   ├── PluginsWindow.tsx
                │   ├── Installed.tsx
                │   ├── Updates.tsx
                │   ├── Permissions.tsx
                │   ├── PluginDetails.tsx
                │   ├── Enable.tsx
                │   ├── Disable.tsx
                │   ├── Uninstall.tsx
                │   ├── Logs.tsx
                │   ├── DeveloperMode.tsx
                │   ├── Widgets/
                │   │   ├── PluginCard.tsx
                │   │   ├── PermissionList.tsx
                │   │   ├── LogViewer.tsx
                │   │   └── UpdateCard.tsx
                │   ├── PluginsAPI.ts
                │   ├── PluginsStore.ts
                │   ├── PluginsHooks.ts
                │   ├── PluginsTypes.ts
                │   ├── PluginsStyles.css
                │   └── index.ts
                │
                ├── Explorer/                ⭐ BARU (file/workspace browser, mirip Windows Explorer)
                │   ├── ExplorerApp.tsx
                │   ├── ExplorerWindow.tsx
                │   ├── Files.tsx
                │   ├── Recent.tsx
                │   ├── Favorites.tsx
                │   ├── Downloads.tsx
                │   ├── RepositoryFolder.tsx
                │   ├── WorkspaceFolder.tsx
                │   ├── PluginFolder.tsx
                │   ├── Search.tsx
                │   ├── Widgets/
                │   │   ├── FileItem.tsx
                │   │   ├── FolderItem.tsx
                │   │   ├── Sidebar.tsx
                │   │   └── Breadcrumb.tsx
                │   ├── ExplorerAPI.ts
                │   ├── ExplorerStore.ts
                │   ├── ExplorerHooks.ts
                │   ├── ExplorerTypes.ts
                │   ├── ExplorerStyles.css
                │   └── index.ts
                │
                └── Profile/                 ⭐ BARU
                    ├── ProfileApp.tsx
                    ├── ProfileWindow.tsx
                    ├── Overview.tsx         (identity avatar, Developer ID, Member since)
                    ├── Activity.tsx
                    ├── Contributions.tsx
                    ├── Reputation.tsx       (Contribution/Review/Plugin/Bounty/Trust/Total Score)
                    ├── Achievements.tsx
                    ├── Badges.tsx
                    ├── Followers.tsx
                    ├── Following.tsx
                    ├── Settings.tsx
                    ├── Widgets/
                    │   ├── BadgeCard.tsx
                    │   ├── AchievementCard.tsx
                    │   ├── StatsCard.tsx
                    │   └── ActivityCard.tsx
                    ├── ProfileAPI.ts
                    ├── ProfileStore.ts
                    ├── ProfileHooks.ts
                    ├── ProfileTypes.ts
                    ├── ProfileStyles.css
                    └── index.ts
```

---

## 🔌 Plugin System (Core Engine)

```
plugins/
├── core/            (PluginManager, Registry, Loader, Installer, Updater, Uninstaller, Validator, Permissions, Sandbox)
├── sdk/             (registerApp, window, storage, notification, websocket, theme, user, workspace, menu, taskbar)
├── loader/          (BootLoader, ManifestReader, DependencyResolver, VersionChecker)
├── marketplace/      (Repository, Downloader, Installer, Verifier)
└── installed/        (plugin yang sudah diinstall user)
```

**Contoh struktur 1 plugin pihak ke-3** (`onyx-weather-plugin/`): `manifest.json`, `package.json`, `icon.svg`, `src/WeatherApp.tsx` + `WeatherWindow.tsx` + `WeatherWidget.tsx` + `WeatherAPI.ts` + `WeatherStore.ts`, `assets/`, `styles/weather.css`. Plugin pihak ke-3 WAJIB pakai `AppTitleBar` dan `useTheme()` dari SDK — supaya walau dibuat developer luar, tetap kelihatan seperti bagian dari ONYX, bukan app asing.

---

## Catatan integrasi

0. **Konsep Bounties = bridge + native platform.** `External/` = aggregator dari GitHub/GitLab/Codeberg/Forgejo (cache/index doang, redirect keluar). `Native/` = ONYX beneran jadi tempat company/individual publish bounty sendiri (Publish, Manage, Rewards). Dua-duanya jalan bareng dalam satu app Bounties.
1. **Title bar, status bar, icon, taskbar, terminal command, dan theme WAJIB konsisten** — lihat section "Aturan Konsistensi UI" di atas. Ini yang bikin 7 module baru ini kerasa seperti bagian asli dari ONYX, bukan app tempelan.
2. **Shared components**: `AppTitleBar.tsx`, `AppStatusBar.tsx`, `ReputationBadge.tsx`, `IdentityAvatar.tsx`, `PluginCard.tsx` — dibuat sekali di `shared/components/`, dipakai lintas module.
3. **Icon registry**: satu file `desktop/icons/registry.ts` jadi source of truth buat Desktop Grid + Start Menu, biar ga ada listing ganda yang bisa out-of-sync.
4. **Terminal**: tambah command `bounty`, `community`, `group`, `market`, `plugin`, `explorer`, `profile` di `TerminalCommands.ts`, ikut format existing (`<command> --help` juga harus jalan).
5. **Auth flow**: `identity/` jalan setelah OAuth GitHub sukses, sebelum masuk `desktop/` — mirip flow "Choose Your ONYX Identity".
6. **Urutan pengerjaan** (roadmap): Community → Groups → Bounties → Plugin System (SDK) → Marketplace → Explorer → Profile. Semua opsional, tidak mengubah struktur Core (Auth, Boot, Desktop, Window Manager, Dashboard, Repository, Reviews, Insights, Reports, Activity, Settings) yang sudah jalan sebagai "Review Radar".
