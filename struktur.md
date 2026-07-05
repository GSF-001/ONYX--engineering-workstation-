# ONYX Engineering Workstation — Full Project Structure

Urutan folder di bawah = urutan flow user:
`landing → auth → boot → desktop → window-manager → taskbar → applications`

```
trace/
└── apps/
    ├── server/
    │   └── src/
    │       ├── auth/
    │       │   ├── githubOAuth.ts
    │       │   ├── session.ts
    │       │   ├── permissions.ts
    │       │   ├── middleware.ts
    │       │   ├── csrf.ts
    │       │   ├── jwt.ts
    │       │   ├── cookies.ts
    │       │   └── index.ts
    │       │
    │       ├── webhook/
    │       │   ├── verify.ts
    │       │   ├── handler.ts
    │       │   ├── parser.ts
    │       │   ├── dispatcher.ts
    │       │   ├── signature.ts
    │       │   ├── queue.ts
    │       │   ├── retry.ts
    │       │   ├── logger.ts
    │       │   ├── onPush.ts
    │       │   ├── onPullRequest.ts
    │       │   ├── onReview.ts
    │       │   ├── onIssue.ts
    │       │   ├── onCheckRun.ts
    │       │   └── index.ts
    │       │
    │       ├── websocket/
    │       │   ├── activity.ts
    │       │   ├── dashboard.ts
    │       │   ├── notifications.ts
    │       │   ├── repository.ts
    │       │   ├── heartbeat.ts
    │       │   ├── broadcast.ts
    │       │   ├── rooms.ts
    │       │   └── index.ts
    │       │
    │       ├── db/
    │       │   ├── client.ts
    │       │   ├── schema.ts
    │       │   ├── migrations.ts
    │       │   ├── seed.ts
    │       │   ├── queries.ts
    │       │   ├── transaction.ts
    │       │   └── index.ts
    │       │
    │       ├── scoring/
    │       │   ├── reviewHealth.ts
    │       │   ├── reviewerLoad.ts
    │       │   ├── mergeWithoutReview.ts
    │       │   ├── staleRadar.ts
    │       │   ├── reviewTimeline.ts
    │       │   ├── reciprocityGap.ts
    │       │   ├── issueGraveyard.ts
    │       │   ├── commitDecay.ts
    │       │   ├── weekendHeatmap.ts
    │       │   ├── busFactor.ts
    │       │   ├── activityScore.ts
    │       │   └── index.ts
    │       │
    │       ├── services/
    │       │   ├── github.ts
    │       │   ├── repository.ts
    │       │   ├── cache.ts
    │       │   ├── exports.ts
    │       │   ├── analytics.ts
    │       │   ├── storage.ts
    │       │   ├── logger.ts
    │       │   └── index.ts
    │       │
    │       ├── routes/
    │       │   ├── dashboard.ts
    │       │   ├── repository.ts
    │       │   ├── pullRequests.ts
    │       │   ├── reviews.ts
    │       │   ├── insights.ts
    │       │   ├── reports.ts
    │       │   ├── team.ts
    │       │   ├── activity.ts
    │       │   ├── settings.ts
    │       │   └── index.ts
    │       │
    │       └── index.ts
    │
    └── web/
        └── src/
            ├── App.tsx                          ⭐ BARU (root component)
            ├── main.tsx                         ⭐ BARU (entry point, ReactDOM.render)
            ├── router.tsx                       ⭐ BARU (atur flow: landing → auth → boot → desktop)
            ├── index.css                        ⭐ BARU (global reset + import theme)
            │
            ├── shared/                          ⭐ BARU (dipakai lintas app, hindari duplikat)
            │   ├── components/
            │   │   ├── Timeline.tsx            (dipakai PullRequests, Activity, Issues)
            │   │   ├── ReviewerLoadWidget.tsx  (dipakai Reviews, Team)
            │   │   ├── WeekendHeatmapWidget.tsx (dipakai Insights, Heatmap)
            │   │   ├── EmptyState.tsx
            │   │   ├── LoadingSpinner.tsx
            │   │   ├── ErrorBoundary.tsx
            │   │   ├── Badge.tsx
            │   │   ├── ScoreBar.tsx
            │   │   └── index.ts
            │   ├── hooks/
            │   │   ├── useWebSocket.ts
            │   │   ├── useDebounce.ts
            │   │   ├── usePagination.ts
            │   │   └── index.ts
            │   ├── api/
            │   │   ├── client.ts               (base fetch/axios instance, auth header)
            │   │   ├── endpoints.ts
            │   │   ├── errorHandler.ts
            │   │   └── index.ts
            │   ├── types/
            │   │   ├── User.ts
            │   │   ├── Repository.ts
            │   │   ├── PullRequest.ts
            │   │   ├── Review.ts
            │   │   ├── Issue.ts
            │   │   ├── TeamMember.ts
            │   │   └── index.ts
            │   ├── utils/
            │   │   ├── formatDate.ts
            │   │   ├── formatNumber.ts
            │   │   ├── classNames.ts
            │   │   └── index.ts
            │   └── index.ts
            │
            ├── websocket/                       ⭐ BARU (frontend client, pasangan server/websocket)
            │   ├── SocketProvider.tsx
            │   ├── SocketContext.tsx
            │   ├── useSocketEvent.ts
            │   ├── reconnect.ts
            │   └── index.ts
            │
            ├── theme/                          ⭐ BARU
            │   ├── tokens.ts                   (warna, font, spacing dari design spec)
            │   ├── palette.ts                  (#000080, #0D7D7D2, #FF8C00, dst)
            │   ├── typography.ts                (MS Sans Serif / Tahoma, Terminal / Fixedsys)
            │   ├── themes/
            │   │   ├── crt.ts
            │   │   ├── modern.ts
            │   │   └── pixel.ts
            │   └── index.ts
            │
            ├── landing/                        ⭐ BARU
            │   ├── LandingPage.tsx             (route publik, sebelum login)
            │   ├── HeroSection.tsx             ("Observe. Review. Ship Faster.")
            │   ├── ValuePropBar.tsx            (3 tagline atas: Operating System / Real-Time Sync / Desktop Experience)
            │   ├── ConnectGitHubButton.tsx     (trigger OAuth redirect)
            │   ├── FeatureGrid.tsx             (grid 12-section, layout dari preview)
            │   ├── FeatureCard.tsx             (1 card reusable = 1 app: judul + screenshot + bullet)
            │   ├── FeatureCardData.ts          (data 12 section: Boot, Desktop, Dashboard, ... Settings)
            │   ├── ScreenshotFrame.tsx         (bingkai window, dipakai FeatureCard)
            │   ├── PricingSection.tsx
            │   ├── DocumentationLink.tsx
            │   ├── Footer.tsx
            │   └── index.ts
            │
            ├── auth/                           ⭐ BARU (frontend, beda dari server/auth)
            │   ├── OAuthCallback.tsx           (handle redirect balik dari GitHub)
            │   ├── AuthorizeRepository.tsx     ("Authorize Repository" screen)
            │   ├── RepositoryPicker.tsx        (pilih repo yang mau dikoneksikan)
            │   ├── AuthGuard.tsx               (protect route /desktop)
            │   ├── AuthState.ts
            │   └── index.ts
            │
            ├── boot/
            │   ├── BootScreen.tsx
            │   ├── BootLoader.tsx
            │   ├── BootLogo.tsx
            │   ├── BootProgress.tsx           (Loading Core.../Loading UI.../Connecting GitHub...)
            │   ├── BootSequence.ts
            │   ├── BootSound.ts
            │   ├── BootState.ts
            │   ├── BootAnimation.ts
            │   ├── ShutdownScreen.tsx         ⭐ BARU (dipanggil dari terminal `shutdown`)
            │   ├── RestartScreen.tsx          ⭐ BARU (dipanggil dari terminal `restart`)
            │   └── index.ts
            │
            ├── desktop/
            │   ├── Desktop.tsx
            │   ├── DesktopGrid.tsx
            │   ├── DesktopIcon.tsx
            │   ├── DesktopLayout.tsx
            │   ├── DesktopBackground.tsx
            │   ├── ContextMenu.tsx
            │   ├── DesktopState.ts
            │   ├── Workspace.tsx
            │   ├── WorkspaceManager.ts
            │   ├── SaveWorkspace.ts
            │   ├── LoadWorkspace.ts
            │   ├── WorkspaceLoadedToast.tsx   ⭐ BARU ("Workspace Loaded: Monday Workspace")
            │   ├── DesktopSettings.tsx
            │   └── index.ts
            │
            ├── window-manager/
            │   ├── WindowManager.tsx
            │   ├── WindowContext.tsx
            │   ├── WindowRegistry.ts
            │   ├── WindowFrame.tsx
            │   ├── WindowHeader.tsx
            │   ├── MenuBar.tsx                ⭐ BARU (File/View/Repository/Tools/Window/Help)
            │   ├── MenuBarItem.tsx            ⭐ BARU
            │   ├── WindowBody.tsx
            │   ├── WindowToolbar.tsx
            │   ├── WindowButtons.tsx
            │   ├── WindowAnimation.ts
            │   ├── WindowEffects.ts
            │   ├── WindowHistory.ts
            │   ├── WindowPersistence.ts
            │   ├── WindowShortcuts.ts
            │   ├── SnapLayout.ts
            │   ├── Focus.ts
            │   ├── Minimize.ts
            │   ├── Maximize.ts
            │   ├── Restore.ts
            │   ├── Open.ts
            │   ├── Close.ts
            │   ├── Draggable.tsx
            │   ├── Resizable.tsx
            │   ├── ZIndex.ts
            │   ├── useWindow.ts
            │   └── index.ts
            │
            ├── command-palette/                ⭐ BARU (Ctrl+K)
            │   ├── CommandPalette.tsx
            │   ├── CommandList.ts              (Open Detail, View in GitHub, Copy Link, Export, dst)
            │   ├── CommandSearch.tsx
            │   ├── useCommandPalette.ts
            │   └── index.ts
            │
            ├── taskbar/
            │   ├── Taskbar.tsx
            │   ├── StartButton.tsx
            │   ├── StartMenu.tsx
            │   ├── RunningApps.tsx
            │   ├── QuickLaunch.tsx
            │   ├── Tray.tsx
            │   ├── Clock.tsx
            │   ├── Calendar.tsx
            │   ├── LiveIndicator.tsx
            │   ├── RepositoryStatus.tsx
            │   ├── CpuUsage.tsx
            │   ├── MemoryUsage.tsx
            │   ├── NetworkStatus.tsx
            │   ├── NotificationCounter.tsx
            │   ├── StatusBar.tsx
            │   ├── SystemStatus.tsx
            │   └── index.ts
            │
            ├── terminal/
            │   ├── Terminal.tsx
            │   ├── Console.tsx
            │   ├── CommandParser.ts
            │   ├── CommandRegistry.ts
            │   ├── TerminalCommands.ts        (help, status, open <app>, shutdown, restart)
            │   ├── TerminalHistory.ts
            │   ├── AutoComplete.ts
            │   ├── Prompt.tsx
            │   └── index.ts
            │
            ├── audio/
            │   ├── Boot.ts
            │   ├── Shutdown.ts
            │   ├── Click.ts
            │   ├── Hover.ts
            │   ├── Drag.ts
            │   ├── Drop.ts
            │   ├── WindowOpen.ts
            │   ├── WindowClose.ts
            │   ├── WindowFocus.ts
            │   ├── WindowMinimize.ts
            │   ├── WindowMaximize.ts
            │   ├── Notification.ts
            │   ├── Error.ts
            │   ├── Warning.ts
            │   ├── Success.ts
            │   ├── LiveSync.ts
            │   ├── RepositoryConnected.ts
            │   ├── RepositoryDisconnected.ts
            │   ├── SoundManager.ts
            │   ├── Volume.ts
            │   └── index.ts
            │
            ├── cursor/
            │   ├── CursorManager.ts
            │   ├── CursorTheme.ts
            │   ├── CursorEffects.ts
            │   ├── Arrow.ts
            │   ├── Hand.ts
            │   ├── Text.ts
            │   ├── Move.ts
            │   ├── Resize.ts
            │   ├── Busy.ts
            │   ├── Loading.ts
            │   ├── Forbidden.ts
            │   ├── Crosshair.ts
            │   └── index.ts
            │
            ├── notifications/
            │   ├── NotificationManager.tsx
            │   ├── Popup.tsx
            │   ├── Toast.tsx
            │   ├── Alert.tsx
            │   ├── Confirm.tsx
            │   ├── Success.tsx
            │   ├── Warning.tsx
            │   ├── Error.tsx
            │   ├── ReviewNotification.tsx
            │   ├── PullRequestNotification.tsx
            │   ├── MergeNotification.tsx
            │   ├── IssueNotification.tsx
            │   ├── LiveNotification.tsx
            │   └── index.ts
            │
            ├── mascot/
            │   ├── PixComputer.tsx
            │   ├── Happy.tsx
            │   ├── Warning.tsx
            │   ├── Error.tsx
            │   ├── Idle.tsx
            │   ├── Sleeping.tsx
            │   ├── Talking.tsx
            │   ├── Expressions.ts
            │   ├── Reactions.ts
            │   └── index.ts
            │
            └── applications/
                ├── Dashboard/
                │   ├── DashboardApp.tsx
                │   ├── DashboardWindow.tsx
                │   ├── DashboardHeader.tsx
                │   ├── DashboardSidebar.tsx
                │   ├── DashboardToolbar.tsx
                │   ├── DashboardStatus.tsx
                │   ├── DashboardOverview.tsx
                │   ├── DashboardQuickLaunch.tsx
                │   ├── DashboardStore.ts
                │   ├── DashboardAPI.ts
                │   ├── DashboardTypes.ts
                │   ├── DashboardHooks.ts
                │   ├── DashboardStyles.css
                │   └── index.ts
                │
                ├── Repository/
                │   ├── RepositoryApp.tsx
                │   ├── RepositoryWindow.tsx
                │   ├── RepositoryHeader.tsx
                │   ├── Branches.tsx
                │   ├── Commits.tsx
                │   ├── Contributors.tsx
                │   ├── Releases.tsx
                │   ├── Tags.tsx
                │   ├── Statistics.tsx
                │   ├── RepositoryAPI.ts
                │   ├── RepositoryStore.ts
                │   ├── RepositoryTypes.ts
                │   ├── RepositoryHooks.ts
                │   ├── RepositoryStyles.css
                │   └── index.ts
                │
                ├── PullRequests/
                │   ├── PullRequestApp.tsx
                │   ├── PullRequestWindow.tsx
                │   ├── OpenPR.tsx
                │   ├── DraftPR.tsx
                │   ├── MergedPR.tsx
                │   ├── ClosedPR.tsx
                │   ├── WaitingReview.tsx
                │   ├── RiskAnalysis.tsx
                │   ├── Timeline.tsx
                │   ├── PullRequestAPI.ts
                │   ├── PullRequestStore.ts
                │   ├── PullRequestTypes.ts
                │   ├── PullRequestHooks.ts
                │   ├── PullRequestStyles.css
                │   └── index.ts
                │
                ├── Reviews/
                │   ├── ReviewsApp.tsx
                │   ├── ReviewsWindow.tsx
                │   ├── PendingReviews.tsx
                │   ├── ApprovedReviews.tsx
                │   ├── ChangesRequested.tsx
                │   ├── ReviewQueue.tsx
                │   ├── ReviewerLoad.tsx
                │   ├── ReviewTimeline.tsx
                │   ├── ReviewsAPI.ts
                │   ├── ReviewsStore.ts
                │   ├── ReviewsTypes.ts
                │   ├── ReviewsHooks.ts
                │   ├── ReviewsStyles.css
                │   └── index.ts
                │
                ├── Issues/
                │   ├── IssuesApp.tsx
                │   ├── IssuesWindow.tsx
                │   ├── OpenIssues.tsx
                │   ├── ClosedIssues.tsx
                │   ├── Labels.tsx
                │   ├── Milestones.tsx
                │   ├── Assignees.tsx
                │   ├── IssueTimeline.tsx
                │   ├── IssuesAPI.ts
                │   ├── IssuesStore.ts
                │   ├── IssuesTypes.ts
                │   ├── IssuesHooks.ts
                │   ├── IssuesStyles.css
                │   └── index.ts
                │
                ├── Insights/
                │   ├── InsightsApp.tsx
                │   ├── InsightsWindow.tsx
                │   ├── MergeWithoutReview.tsx
                │   ├── BusFactor.tsx
                │   ├── CommitDecay.tsx
                │   ├── ReviewHealth.tsx
                │   ├── ReviewerGap.tsx
                │   ├── IssueGraveyard.tsx
                │   ├── WeekendHeatmap.tsx
                │   ├── InsightsAPI.ts
                │   ├── InsightsStore.ts
                │   ├── InsightsTypes.ts
                │   ├── InsightsHooks.ts
                │   ├── InsightsStyles.css
                │   └── index.ts
                │
                ├── Team/
                │   ├── TeamApp.tsx
                │   ├── TeamWindow.tsx
                │   ├── Members.tsx
                │   ├── Leaderboard.tsx
                │   ├── ReviewerLoad.tsx
                │   ├── BusFactor.tsx
                │   ├── Contribution.tsx
                │   ├── TeamStats.tsx
                │   ├── TeamAPI.ts
                │   ├── TeamStore.ts
                │   ├── TeamTypes.ts
                │   ├── TeamHooks.ts
                │   ├── TeamStyles.css
                │   └── index.ts
                │
                ├── Reports/
                │   ├── ReportsApp.tsx
                │   ├── ReportsWindow.tsx
                │   ├── Weekly.tsx
                │   ├── Monthly.tsx
                │   ├── Quarterly.tsx
                │   ├── ExportPDF.tsx
                │   ├── ExportCSV.tsx
                │   ├── Snapshot.tsx
                │   ├── ReportsAPI.ts
                │   ├── ReportsStore.ts
                │   ├── ReportsTypes.ts
                │   ├── ReportsHooks.ts
                │   ├── ReportsStyles.css
                │   └── index.ts
                │
                ├── Heatmap/
                │   ├── HeatmapApp.tsx
                │   ├── HeatmapWindow.tsx
                │   ├── CommitHeatmap.tsx
                │   ├── ReviewHeatmap.tsx
                │   ├── ActivityHeatmap.tsx
                │   ├── WeekendHeatmap.tsx
                │   ├── HeatmapAPI.ts
                │   ├── HeatmapStore.ts
                │   ├── HeatmapTypes.ts
                │   ├── HeatmapHooks.ts
                │   ├── HeatmapStyles.css
                │   └── index.ts
                │
                ├── Activity/
                │   ├── ActivityApp.tsx
                │   ├── ActivityWindow.tsx
                │   ├── LiveFeed.tsx
                │   ├── Timeline.tsx
                │   ├── Events.tsx
                │   ├── Filters.tsx
                │   ├── ActivityAPI.ts
                │   ├── ActivityStore.ts
                │   ├── ActivityTypes.ts
                │   ├── ActivityHooks.ts
                │   ├── ActivityStyles.css
                │   └── index.ts
                │
                ├── Terminal/
                │   ├── TerminalApp.tsx
                │   ├── TerminalWindow.tsx
                │   ├── Console.tsx
                │   ├── Prompt.tsx
                │   ├── Commands.ts
                │   ├── History.ts
                │   ├── AutoComplete.ts
                │   ├── TerminalAPI.ts
                │   ├── TerminalStore.ts
                │   ├── TerminalTypes.ts
                │   ├── TerminalHooks.ts
                │   ├── TerminalStyles.css
                │   └── index.ts
                │
                └── Settings/
                    ├── SettingsApp.tsx
                    ├── SettingsWindow.tsx
                    ├── Appearance.tsx
                    ├── Sounds.tsx
                    ├── Themes.tsx
                    ├── Workspace.tsx
                    ├── Keyboard.tsx
                    ├── About.tsx
                    ├── SettingsStore.ts
                    ├── SettingsTypes.ts
                    ├── SettingsHooks.ts
                    ├── SettingsStyles.css
                    └── index.ts
```

## Mapping Flow ke Folder

```
Open Website        → landing/LandingPage.tsx
Landing Page         → landing/*
Login GitHub         → landing/ConnectGitHubButton.tsx → server/auth/githubOAuth.ts
Authorize Repository → auth/AuthorizeRepository.tsx + auth/RepositoryPicker.tsx
Boot Screen          → boot/BootScreen.tsx (+ BootProgress.tsx utk step "Connecting GitHub...")
Desktop              → desktop/*
Open Applications    → applications/* (masing-masing App + Window)
Work (window mgmt)   → window-manager/* + command-palette/* + taskbar/*
Shutdown/Restart     → terminal/TerminalCommands.ts → boot/ShutdownScreen.tsx / RestartScreen.tsx
Workspace tersimpan   → desktop/WorkspaceManager.ts + WorkspaceLoadedToast.tsx
```

## Catatan
- **Widget** (Review Health, Activity Feed, dst) bukan folder terpisah — mereka adalah komponen kecil di dalam masing-masing `applications/<Nama>/*.tsx`, bukan sesuatu yang bisa dibuka dari Desktop. Ini sudah otomatis benar karena struktur `applications/` isolated per-app.
- File yang tadinya duplikat antar-app (`ReviewerLoad.tsx` di Reviews & Team, `Timeline.tsx` di PullRequests & Activity, `WeekendHeatmap.tsx` di Insights & Heatmap) **sudah ditarik ke `shared/components/`**. File `*Widget.tsx` versi lokal di tiap app (kalau masih ada) sekarang tinggal wrapper tipis yang import dari shared, bukan implementasi ulang — jaga UI tetap isolated per app, tapi logic satu sumber.
- `shared/api/client.ts` adalah satu-satunya tempat konfigurasi base URL & auth header. Semua `*API.ts` di tiap app (`DashboardAPI.ts`, `RepositoryAPI.ts`, dst) import dari sini, bukan bikin instance fetch/axios sendiri.
- `websocket/SocketProvider.tsx` di frontend adalah client tunggal yang connect ke `server/websocket/*`. Semua app yang butuh live update (Dashboard, Activity, notifications) subscribe event lewat `useSocketEvent.ts`, bukan bikin koneksi socket masing-masing.
- `router.tsx` menahan urutan wajib: **landing → auth → boot → desktop**. `AuthGuard.tsx` di `auth/` mencegah orang lompat langsung ke `/desktop` tanpa OAuth.
