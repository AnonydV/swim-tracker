---
name: refactoring-backlog
description: Identified-but-not-yet-implemented cleanups for HIPLAN index.html (dead data, twin functions, storage key namespace, plan registry).
metadata:
  type: project
---

Refactoring opportunities. Re-verified against file 2026-07-02. See [[structure-map]] for anchors.

**Why:** File history has recurring bugs from duplicate declarations and duplicated data blocks. These items are the current concrete instances.
**How to apply:** Offer these within the single-file / no-build / no-dep constraint. Always propose a no-regression path.

DONE (verified gone 2026-07-02):
- Dead `plan` / `runPlan` arrays removed. Only `weeklyPlan` (~1285) remains.
- STORAGE: `STORE` object now exists (~2671). Keys still mix `hi_swim_`/`hi_tri_` namespace but are abstracted behind STORE — leave key STRINGS as-is (changing them = data loss for existing users). Namespace is now cosmetic-only.

DONE (verified 2026-07-02):
- DISCIPLINE CLASSIFICATION unified. `getDiscipline(sessionId)` (~2669) is the single classifier; DISCIPLINE_CONFIG carries `prefix`; `updateStats` (~3433) uses it. Old duplicated startsWith chains gone. Adding a discipline = one DISCIPLINE_CONFIG entry.

DONE (verified 2026-07-03):
- 3. PLAN VALIDATION — `validatePlan()` ~2714 now exists (dup ids / unknown prefix / missing required fields, console.warn). Any placeholder or `target` scheme should extend it.
- 4. EXPORT SCHEMA VERSION — `exportData` ~3501 now emits `version:1`. NOTE: `importData` has no `migrate()` yet. Any P1/P2 schema change should bump 1->2 AND add a shared `migrate(data)` used by BOTH importData and future P3 snapshot restore.

STILL OPEN:
2. TWIN FUNCTIONS — `getWeekActiveNum` and `getActiveWeekNum` both just `return getCalendarActiveWeekNum()`. Collapse.
5. RENDER COUPLING — ~35 inline `onclick/oninput` handlers (dette A5, per user context) + full `innerHTML` rebuilds. Perf fine at 14 weeks; maintainability watch-item. Event delegation would decouple markup from global fn names.
6. P2 REGEX DEBT — bike target-watts extracted by regex on `session.tip` (~3940). Fragile; retire once a structured `target` field exists (see [[structure-map]] P2 note).
7. STALE HEADER LABELS — subtitle "3 SEMAINES" (~1323) and statTotal hardcoded "20" (~1342) contradict 14-week plan / TOTAL_WEEKS. Fix when touching header.
