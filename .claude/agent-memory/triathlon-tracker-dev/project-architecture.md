---
name: project-architecture
description: Architecture du tracker triathlon — plan unifié weeklyPlan, STORE, localStorage, fonctions clés, zones sensibles (mis à jour juillet 2026)
metadata:
  type: project
---

Le projet est un fichier unique `C:\Users\vicba\OneDrive\Documents\HIPLAN\index.html` (~3980 lignes, mis à jour 2026-07-02).
Repo GitHub : `https://github.com/AnonydV/swim-tracker.git` — déployé via GitHub Pages depuis la branche `main` (aucun build step, push = déploiement).

## Tableau de données principal (unique)
- `const weeklyPlan = [...]` — tableau unifié **14 semaines** (S1–S14), chaque semaine a `{ weekNum, phase, sessions[] }`
- Le champ `phase` de chaque semaine est une string simplifiée : `'base'` (S1-2), `'construction'` (S3-5), `'specifique'` (S6-8), `'affutage'` (S9-14) — non utilisé par le rendu (purement documentaire)
- Total : **85 sessions** (S3 récupération supprimée juillet 2026)
- Chaque session : `{ id, name, type, typeLabel, dist, unit, sets[], tip }` — `dist` et `unit` peuvent manquer sur les séances muscu
- Convention IDs : `rw<N><lettre>` (run), `sw<N><lettre>` (swim), `bw<N><lettre>` (bike), `mw<N><lettre>` (muscu), `brw<N><lettre>` (brick)
- La fonction `validatePlan()` vérifie les IDs dupliqués et champs manquants au boot (console.warn uniquement)

## DISCIPLINE_CONFIG (avec prefix depuis juillet 2026)
```js
const DISCIPLINE_CONFIG = {
  swim:  { label, emoji, color, accent, defaultUnit, prefix: 'sw'  },
  bike:  { label, emoji, color, accent, defaultUnit, prefix: 'bw'  },
  run:   { label, emoji, color, accent, defaultUnit, prefix: 'rw'  },
  str:   { label, emoji, color, accent, defaultUnit, prefix: 'mw'  },
  brick: { label, emoji, color, accent, defaultUnit, prefix: 'brw' },
};
```
`getDiscipline(sessionId)` — retourne la clé discipline depuis l'ID de session (trie par longueur de prefix décroissant pour éviter faux positif brw/bw).

## Objet STORE (clés localStorage centralisées)
```js
const STORE = {
  completed:   'hi_swim_tracker_v3',
  skipped:     'hi_swim_skipped_v1',
  notes:       'hi_tri_session_notes_v1',
  results:     'hi_tri_session_results_v1',
  perfResults: 'hi_tri_perf_results_v1',
  programEnd:  'hi_tri_program_end',
  legacyStart: 'hi_tri_program_start',
};
```

## Variables d'état globales
```js
let completed, skipped, sessionNotes, sessionResults, perfResults;
let currentWeekView = null;  // null = semaine calendaire active
const TOTAL_WEEKS = 14;
```

## Ordre de déclaration (critique)
1. `weeklyPlan` (données)
2. `validatePlan()` (immédiatement après weeklyPlan)
3. Bloc STATE : STORE, loadStoredState, completed/skipped/..., save()
4. Bloc BUILD UI : currentSport, currentWeekView, TOTAL_WEEKS, DISCIPLINE_CONFIG, getDiscipline(), WEEK_PHASES
5. Fonctions utilitaires (dates, calculs)
6. Rendu : buildWeekView, buildSessionCard, wvToggleDone, wvToggleSkip
7. showToast, updateStats, exportData, importData
8. PerfSheet : openPerfSheet, submitPerfSheet, closePerfSheet
9. Init : renderProgramEndControl(), buildWeekView(null), updateStats(), validatePlan(), buildLoadChart()

## Fonctions clés
- `getCalendarActiveWeekNum()` — semaine active basée sur la date calendaire (PAS getWeekActiveNum ni getActiveWeekNum — supprimées)
- `buildWeekView(weekNum)` — reconstruit `#plan` entièrement ; null = semaine active
- `getWeekSessions(weekNum)` — retourne `{ swim[], bike[], run[], str[], brick[] }` via getDiscipline
- `updateStats()` — utilise getDiscipline pour les compteurs swim/bike/run
- `wvToggleDone(id)` — si décoché : rebuild ; si coché : ouvre openPerfSheet
- `wvToggleSkip(id)` — bascule skip + rebuild
- `showToast(state)` — états reconnus : true/false, 'skip', 'unskip', 'date-saved', 'date-error', 'note-saved', 'result-saved', 'perf-saved', 'perf-skipped', 'import-ok', 'import-error', 'import-version', 'notes-copied', 'notes-empty', 'notes-error'
- `exportData()` — export JSON avec version:1 (déjà présent)
- `importData()` — vérifie version === 1 avant import (depuis juillet 2026)
- `validatePlan()` — console.warn sur IDs dupliqués, préfixes inconnus, champs manquants

## HTML — Structure du container
```html
<div class="container">
  <div id="plan"></div>      <!-- en tête, rebuilté par buildWeekView -->
  <div class="stats-bar">   <!-- stats globales -->
  <div class="program-date-panel">
  <div class="load-chart-panel">
</div>
```

## Feature RPE / Perf Sheet
Bottom sheet injecté dans `<body>` (JAMAIS dans `#plan` qui est rebuilté).
Format `perfResults[sessionId]` : `{ rpe, distM?, pctBrasse?, paceS?, watts?, durationMin?, distKm?, paceKmS?, chargesNote? }`

**Why:** Architecture fichier unique, aucun build, push GitHub = déploiement.
**How to apply:** Respecter l'ordre de déclaration. Ne jamais redéclarer getDiscipline/validatePlan/DISCIPLINE_CONFIG. Utiliser getCalendarActiveWeekNum() directement, pas de wrappers.
