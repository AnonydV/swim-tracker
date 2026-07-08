---
name: project-hiplan
description: Core facts about the HIPLAN triathlon fitness tracker PWA — architecture, scope, design system in use
metadata:
  type: project
---

HIPLAN is a single-file PWA (index.html) for tracking a 15-week Half Ironman triathlon training plan covering 4 disciplines: Swim, Bike, Run, Strength (Muscu).

**Why:** Personal tracker built by the user (solo developer) for their own Half Ironman race prep. No backend — all state stored in localStorage.

**How to apply:** All UX recommendations must work within a single HTML file constraint. No separate pages, no framework. JS renders views dynamically into `<div id="plan">`.

## Architecture
- Single HTML file, all CSS + JS inline
- Views rendered by `buildWeekView(weekNum)` into `#plan` div
- State: localStorage keys `hi_swim_tracker_v3`, `hi_swim_skipped_v1`, `hi_tri_session_notes_v1`, `hi_tri_session_results_v1`, `hi_tri_program_end`
- 15 total weeks, 4 phases: BASE AÉROBIE (S1–5), CONSTRUCTION (S6–10), SPÉCIFIQUE (S11–13), AFFÛTAGE (S14–15)
- No bottom tab bar — only week-to-week navigation via arrow buttons

## Design System (Actual vs Charter)
- Background: `#07090f` — correct
- Font body: **Outfit** — DEVIATION from charter (should be DM Sans)
- Font headings: Bebas Neue — correct
- Font mono/numbers: JetBrains Mono — correct
- Swim accent: `#38bdf8` (blue) — correct
- Bike accent: `#facc15` (yellow) — correct
- Run accent: `#a3e635` (lime-green, NOT `#4ade80`) — intentional choice, distinct from recovery green `#4ade80`
- Strength/Muscu: `#c084fc` (purple) — correct

## Architecture details (verified 2026-07-02)
- The ONLY rendered view is `buildWeekView()` — no sport tab view, no accordion plan view
- `.check-btn`, `.skip-btn` circular CSS classes appear to be dead code from older version; current week card uses `.wsc-btn` text buttons
- `.sport-tab { display: none }` and `.sport-btn` CSS exist but no sport tab bar is rendered in current HTML
- Container render order: stats-bar → program-date-panel → load-chart-panel → #plan (week grid)
- `scrollToActiveWeek()` / `addActiveWeekIndicator()` reference `#week-${n}` IDs that no longer exist in DOM — dead code
- State keys: `hi_tri_completed_v1`, `hi_tri_skipped_v1`, `hi_tri_session_notes_v1`, `hi_tri_session_results_v1`, `hi_tri_perf_results_v1`, `hi_tri_program_end`
- perf-sheet: bottom sheet injected via `insertAdjacentHTML('beforeend')` at init — persists across week changes
- Toast: `showToast(state)` with 2200ms auto-hide; `white-space: nowrap` — overflow risk on long messages

## Known UX Debt (audit 2026-07-02)
Priority | Issue
--- | ---
CRITIQUE | week-nav-btn: `padding: 8px 16px`, no min-height → ~32px effective height (below 48px minimum). Only nav between weeks.
CRITIQUE | Session content (week grid) buried ~460px below viewport top on mobile: render order forces scroll past stats + date panel + load chart before seeing any session.
HAUTE | Program date panel: 5+ utility buttons always visible (Valider, modifier date, Copier notes, Exporter, Importer). Buttons have `padding: 7px 11px` no min-height → ~28px.
HAUTE | No "return to current week" button when navigating to past/future weeks. User must tap arrow up to 14 times.
MINEURE | Toast state `perf-skipped` text too long (~46 chars) with `white-space: nowrap` → overflows 390px viewport.
MINEURE | Load chart SVG bars: ~20px wide, clickable but untappable (onclick navigates to week). Consider non-interactive or expand hitbox.
NOTE | check-btn/skip-btn CSS (28×28 + min-width:44) are dead code — not rendered in current build.

## Architecture update (verified 2026-07-03)
- #remaining-sessions-panel is NOW the first child of .container (before stats-bar) — U1 debt partially resolved
- Container render order (current): remaining-sessions-panel → stats-bar → program-date-panel → load-chart-panel → #plan
- Bike diff already implemented: updateBikeDiff() shows live delta vs target watts (regex extracted from session.tip). Uses green (#4ade80) for over-target, red (#f87171) for under-target — WRONG semantic, needs fix per P2.
- Weekly recap bottom sheet: implemented (N5), triggered auto at week change, flag localStorage per week, swipe-to-dismiss, buildWeeklyRecap()
- Export: exportData() produces JSON with version:1 + all state keys. importData() validates version field. Both in program-date-panel.
- Header sticky height: ~88px (padding: 32px 24px 24px + logo Bebas Neue 32px + progress bar). Hard constraint for any new above-fold additions.
- .logo-block p: currently shows static string "// TRANSITION TRIATHLON · 3 SEMAINES". Can be made dynamic (J-X countdown) at zero height cost.

## Scroll depth to #plan (verified 2026-07-07)
On mobile 390px: remaining-panel (~225px) + stats-bar (~240px) + program-date-panel (~135px) + load-chart (~205px) + progression-panel (~200px) = ~1005px before #plan. iPhone 14 viewport under header = 756px → ~250px scroll required to see nav bar.

## Perf-sheet submit button position (verified 2026-07-07)
`.perf-actions` is OUTSIDE `.perf-body` scroll container → submit button is always pinned at bottom, never hidden by scroll. No need to scroll to find submit. "Fermer" closes without unvalidating (completed[id] already saved before sheet opens).

## New UX tickets brainstormed (2026-07-07)
Ticket | Title | Priority | Effort
--- | --- | --- | ---
UX-B1 | Panel restantes: "→ Blocs" scroll+open + featured PROCHAIN row | Critique | Faible
UX-B2 | Race week checklist matérielle (weekNum 7 only, localStorage) | Importante | Moyen
UX-B3 | Mode outdoor: toggle SOL/NUI header, --muted → #8ab5cc (5.4:1) | Importante | Faible
UX-B4 | État "Adapté" pour sessions eau libre (3rd state, orange) | Mineure | Moyen
UX-B5 | Race week escalation: header orange quand diffDays <= 7 | Mineure | Très faible
UX-B6 | Rythme hebdo: "En avance/Dans les temps/En retard" dans summary bar | Mineure | Faible

Top 3 recommandés: B1 > B2 > B3

## Feature Verdicts (audit 2026-07-03)
Feature | Verdict | Key constraint
--- | --- | ---
P1 Zones d'allures | GO — gear icon in header → bottom sheet "Réglages" | Reuse .perf-pace-input pattern for MM:SS, auto-save debounced 400ms
P2 Badge écart | GO — fix bike color semantic first, then generalize | P1 is prerequisite for run/swim targets. Colors: green=in-zone, orange=above, blue=below. Never red. Always show numeric delta.
P3 Snapshots rotatifs | GO — 3-tap restore flow, blocking modal (not bottom sheet), red confirm button | Trigger: before importData() + before restore + daily at boot. Store in hi_tri_snapshots localStorage key. Integrate into P1 settings sheet.
P4 Countdown J-X | Simplify — no new block. Integrate into .logo-block p dynamic subtitle only | Never add a 4th block to container (vertical budget exhausted). Phase info → in week view title.
P5 Mode séance | GO — fullscreen fixed, wake lock + visibilitychange reacquire, tap zones (not swipe) for block nav | Min text: 18px body, 40px targets, 64px timer. Exit → calls existing openPerfSheet(). No new perf entry UI needed.
