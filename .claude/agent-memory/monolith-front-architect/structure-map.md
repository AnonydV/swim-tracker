---
name: structure-map
description: Structural map of HIPLAN index.html — unified weeklyPlan data, render/state/CSS sections, naming. Line anchors approximate, verify before editing.
metadata:
  type: project
---

Single-file triathlon training tracker `index.html`, ~4650 lines. One `<style>` block, one `<script>` block. No build, no deps. Companion `sw.js` service worker: `const CACHE = 'hiplan-v11'` (2026-07-07) — MUST bump on every HTML ship or users keep stale cache. SW is cache-first + stale-while-revalidate for shell (new HTML shows only on 2nd load, silently — no update prompt). Google Fonts = network-first.

## CRITICAL FACTS re-verified 2026-07-07
- `TOTAL_WEEKS = 10` (line ~2437), NOT 14. Plan = 10 weeks. `WEEK_PHASES` (~2466): BASE AÉROBIE(1-2), CONSTRUCTION 70.3(3-4), AFFÛTAGE & RACE(5-7), RÉCUPÉRATION(8-10). Race is weekNum 7; weeks 8-10 are post-race recovery ALREADY in weeklyPlan.
- NO distinct `raceDate` concept. Single date = `programEnd` (STORE.programEnd). Countdown banner "J-XX / JOUR J" (buildCountdown ~2584-2603) counts to programEnd, NOT to actual race day. If user sets programEnd=2026-09-13 (recovery end), the J-XX banner is ~3 weeks off from the 2026-08-23 race. Architectural gap for any race-day feature.
- `save()` (~2419) has NO try/catch — QuotaExceededError or unavailable localStorage (private mode) throws uncaught on any state mutation (e.g. toggling a session complete). Snapshot writes ARE guarded; primary save() is not.
- `loadStoredState(key)` (~2403) is robust: try/catch, validates plain object, `removeItem` on corrupt + returns {}. BUT wiping a corrupt key = SILENT total data loss for that store with no user alert and no auto-restore (snapshot restore is 100% manual via panel).
- Snapshot ring (P3): `collectStateSnapshot` ~3426, `takeSnapshot` ~3450 (ring of 3, quota-guarded), `takeSnapshotIfNeeded` ~3465 (daily, called at boot ~4622), `restoreSnapshot` ~3593. `importData` ~3480 checks version===1 but has NO migrate().

**How to apply:** Line numbers drift with every edit — treat as hints, grep to confirm before editing.

## Verified anchors 2026-07-03 (re-read from source)
- `weeklyPlan` const ~1407 (was ~1285). Session shape: `{id,name,type,typeLabel,dist(=minutes),unit,sets:[{type,dist,desc,tip,nage?}],tip}`. Descriptions are RICH FREE PROSE with pace ranges embedded ("à 4:50–5:10/km", ">5:30/km") — NOT single values. Big-bang placeholder migration = high regression risk.
- `validatePlan()` ~2714 EXISTS (dup ids, unknown prefix, missing required fields — console.warn only). Backlog item 3 DONE.
- `STORE` ~2734, `DISCIPLINE_CONFIG` ~2781, `WEEK_PHASES` ~2795, `TOTAL_WEEKS=14` ~2779.
- Header HTML ~1319 (`.header-inner`, `.logo-block`, `.progress-global`). STALE labels: subtitle "3 SEMAINES" (line 1323) and statTotal "20" (1342) are wrong for a 14-week plan — fix opportunistically.
- Program-date getters: `getProgramEndDate()` ~2822, `getCalendarActiveWeekNum()` ~2871, `getWeekPhase()` ~3007, `addDays()` ~2802. Everything a J-XX countdown banner needs already exists.
- Render chain: `buildWeekView` ~3138 -> `buildSessionCard` ~3103 -> `buildSessionDetailHtml` ~3091 -> `buildSessionSetsHtml` ~3055 (the ONLY sets/blocks renderer — reuse for any "during session" fullscreen view). `formatSetDesc` ~3038.
- Perf entry sheet: `buildMetricsSection` ~3842 (per-discipline metric inputs), `submitPerfSheet` ~4000, `buildPerfResultsRowHtml` ~4074, `buildRpeGrid` ~3771.
- `exportData` ~3501 already builds full-state object `version:1` (completed/skipped/notes/results/perfResults/programEnd). Reuse as `buildStateSnapshot()` for P3 snapshots.
- View state: `let currentSport` / `let currentWeekView` ~2777-2778.

## P2 (planned/écart) — ALREADY PARTIALLY EXISTS for bike
- `buildMetricsSection` bike branch ~3940 extracts target watts by REGEX on `session.tip` (`/(\d{2,3})\s*W/`), stores on `wInput.dataset.target`, `updateBikeDiff` ~3828 shows diff badge. Fragile: works for watts (single token) but CANNOT handle run/swim pace RANGES. A structured `target` field per session is the clean generalization. Recommend one generic `buildTargetDiff(metric,actual,target)` replacing inline updateBikeDiff.

## Data plan (MAJOR REFACTOR done ~2026-07: 4 plans unified into one)
- `weeklyPlan` declared ~1285. Single array of 15 weeks: `[{ weekNum, sessions:[{ id, name, type, dist, unit, sets:[...], tip }] }]`.
- Replaced the old `swimPlan` / `bikePlan` / `strengthPlan` / `semiRunPlan` (all removed, zero residual refs confirmed 2026-07).
- Old dead `plan` / `runPlan` arrays also removed.

## Discipline id prefixes (encode discipline within weeklyPlan.sessions)
- swim `sw*`, bike `bw*`, run `rw*`, str `mw*`, brick `brw*` (brick added in same refactor).
- IMPORTANT disjointness: bike filter `startsWith('bw')` does NOT capture brick `brw*` (2nd char r vs w). Verified safe.
- `updateStats` (~3468) now DOES count brick: `brw*` adds to both minBike and minRun (verified 2026-07-02). Ordering matters — it checks `brw` before `bw`.

## Config / registries
- `DISCIPLINE_CONFIG` ~2661: swim/bike/run/str/brick -> {label,emoji,color,accent,defaultUnit,prefix}. `prefix` field now present (sw/bw/rw/mw/brw).
- `getDiscipline(sessionId)` ~2669 — SINGLE centralized classifier (sorts by prefix length so brw beats bw). Backlog item 1 (duplicated prefix logic) is DONE: `updateStats` (~3433) now calls getDiscipline, no more hardcoded startsWith chains.
- `WEEK_PHASES` (~2466 as of 2026-07-07): 4 phases over 10 weeks — see CRITICAL FACTS above. TOTAL_WEEKS drives plan length.

## perfResults schema (localStorage STORE.perfResults, keyed by session id)
- `rpe` present on ALL disciplines (saved ~3820 `data = { rpe }`). RPE_COLORS map + buildRpeGrid render it.
- Per-discipline numeric fields: swim distM/pctBrasse/paceS, bike watts/durationMin/distKm, run paceKmS/distKm, str chargesNote (free text ~3853).
- `session.dist` = DURATION IN MINUTES universally (summed as totalMin in buildLoadChart 2806 + updateStats). Key fact for any load/RPE-load feature.
- `getAllProgramSessions()` ~3268 flattens every session with {...session, weekNum, disciplineKey} — base for cross-week/discipline aggregation.
- `exportData` ~3317 has `version: 1`. Any perfResults schema change (e.g. structured muscu) must bump version + migrate.

## State / storage (STORE object, keys mixed namespace)
- `completed:'hi_swim_tracker_v3'`, `skipped:'hi_swim_skipped_v1'`, `perfResults:'hi_tri_perf_results_v1'` (~2671-2675). Also programEnd/legacyStart keys. Inconsistent `hi_swim_` vs `hi_tri_` namespace persists.

## Key functions (all single-declared, no dupes as of 2026-07)
- `getWeekSessions(weekNum)` ~2946 — maps week -> {swim,bike,run,str,brick} via prefix filters on weeklyPlan.
- `buildLoadChart` ~2868, `buildWeekView` ~3076, `buildSessionCard` ~3037, `updateStats` ~3487.
- `getAllProgramSessions` ~3340 — flattens all sessions.
- Active-week twins still present: `getCalendarActiveWeekNum` ~2821 (real), `getWeekActiveNum` ~3072, `getActiveWeekNum` ~3530 (thin wrappers). See [[refactoring-backlog]].

## Naming conventions
- JS camelCase; builders `build*`, getters `get*`, week-view actions `wv*`.
- CSS kebab-case; discipline color classes swim/bike/run/str/brick.
