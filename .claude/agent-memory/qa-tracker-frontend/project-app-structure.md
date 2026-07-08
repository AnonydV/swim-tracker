---
name: project-app-structure
description: Architecture technique du tracker triathlon HIPLAN — plan unifié weeklyPlan, localStorage, détection semaine active, 5 disciplines, TOTAL_WEEKS=7 depuis v13 (weeklyPlan contient quand même S1-S10)
metadata:
  type: project
---

Application monopage vanilla JS/HTML/CSS, sans framework ni test runner.

**Fichier principal** : `C:\Users\vicba\OneDrive\Documents\HIPLAN\index.html`

**Plan de données (variable JS globale unique)** :
- `weeklyPlan` : plan d'entraînement unifié, **10 semaines dans les données** (S1-S10 présentes)
  - `weekNum` de 1 à 10, chaque objet a un tableau `sessions`
  - Mais depuis v13 : `TOTAL_WEEKS = 7` → navigation bloquée à S7, S8-S10 inaccessibles mais présentes en data
  - IDs swim : `sw1a`, `sw1b`, ... (préfixe `sw`)
  - IDs vélo : `bw2a`, `bw3a`, ... (préfixe `bw`)
  - IDs run : `rw1a`, `rw1b`, ... (préfixe `rw`)
  - IDs muscu : `mw1a`, `mw2a`, ... (préfixe `mw`)
  - IDs brick : `brw4a`, `brw6a`, `brw7a`, `brw8a` (préfixe `brw`)

**Versions** :
- v12 : TOTAL_WEEKS=10, RACE_WEEK=7, weeklyPlan S1-S10
- v13 : TOTAL_WEEKS=7, RACE_WEEK=7, weeklyPlan S1-S10 inchangé. Ajout mode course (checklist, fiche jour J, nutrition, header orange)

**ANOMALIE CONNUE v13 — updateStats itère sur tout weeklyPlan (S1-S10)** :
`updateStats` fait `weeklyPlan.forEach(w => ...)` sans filtre sur TOTAL_WEEKS. Avec TOTAL_WEEKS=7 et 12 sessions en S8-S10, le dénominateur total = 48 au lieu de 36. Si toutes les sessions S1-S7 sont faites (36/48 = 75%), la barre de progression plafonne à 75% et n'atteint jamais 100%. C'est un bug introduit par v13 (pas signalé dans la spec). Même problème pour `buildLoadChart` (affiche 10 barres).

**ANOMALIE ACTIVE V8 — brw8a type/discipline mismatch** :
`brw8a` (S8 — "Run — Récupération active J+1") a `type: "r-recovery"` mais son ID préfixe `brw` → `getDiscipline('brw8a')` retourne `'brick'`. Conséquences :
- Carte affichée en colonne Brick (orange/🧱) alors que contenu = run récupération
- `updateStats()` : +25 min dans minBike ET minRun (double-comptage) au lieu de minRun uniquement
- Pas de crash, bug fonctionnel moyen

**`DISCIPLINE_CONFIG`** — 5 entrées :
- `swim`  : accent `#38bdf8`, emoji `🏊`, defaultUnit `'min'`, prefix `'sw'`
- `bike`  : accent `#facc15`, emoji `🚴`, defaultUnit `'min'`, prefix `'bw'`
- `run`   : accent `#a3e635`, emoji `🏃`, defaultUnit `'min'`, prefix `'rw'`
- `str`   : accent `#c084fc`, emoji `💪`, defaultUnit `''`, prefix `'mw'`
- `brick` : accent `#fb923c`, emoji `🧱`, defaultUnit `'min'`, prefix `'brw'`

**Clés localStorage** :
- `hi_swim_tracker_v3` : sessions complétées `{ id: true }`
- `hi_swim_skipped_v1` : sessions skippées `{ id: true }`
- `hi_tri_session_notes_v1` : notes textuelles `{ id: string }`
- `hi_tri_session_results_v1` : résultats chronos `{ id: string }`
- `hi_tri_perf_results_v1` : résultats RPE + métriques `{ [sessionId]: { rpe, distM, ... } }`
- `hi_tri_program_end` : date de fin du programme au format `YYYY-MM-DD`
- `hi_tri_program_start` : LEGACY (migré vers `program_end` à la lecture)
- `hi_tri_race_checklist_v1` : état checklist course `{ [itemId]: bool }` (ajouté v13)
- `hi_tri_weekly_recap_shown_w{N}` : flag récap hebdo vu

**DEFAULT_PROGRAM_END = '2026-08-23'** (ajouté v13) : fallback si ni `hi_tri_program_end` ni `hi_tri_program_start` n'est en localStorage. Priorité : storedEnd > legacyMigration > DEFAULT_PROGRAM_END.

**MIGRATION RISK v13** : si localStorage contient `hi_tri_program_end = '2026-09-13'` (ancienne valeur plan 10 semaines), alors avec TOTAL_WEEKS=7 et RACE_WEEK=7 : `getRaceDate() = programEnd - 0 = 2026-09-13` (FAUX, devrait être 2026-08-23). L'utilisateur doit mettre à jour manuellement `hi_tri_program_end` à `'2026-08-23'` pour corriger.

**getRaceDate()** : `addDays(programEnd, -(TOTAL_WEEKS - RACE_WEEK) * 7)`. Avec TOTAL_WEEKS=7 et RACE_WEEK=7 : offset = 0. Donc getRaceDate() = programEnd. DEFAULT_PROGRAM_END = '2026-08-23' → race = 23 août ✓ (si pas de valeur localStorage).

**Countdown** (v13, date 8 juillet) : J-46 (23 août - 8 juillet = 46 jours). ✓

**WEEK_PHASES** (v13) :
- Phase 1 — BASE AÉROBIE : semaines [1, 2]
- Phase 2 — CONSTRUCTION 70.3 : semaines [3, 4]
- Phase 3 — RÉCUPÉRATION : semaines [5]
- Phase 4 — AFFÛTAGE : semaines [6]
- Phase 5 — COURSE : semaines [7]

**Sessions-clés pour les tests (plan v13, S1-S7 accessibles)** :
- S1 (4 sessions) : `rw1a`, `sw1a`, `sw1b`, `mw1a`
- S3 (6 sessions) : contient `bw6a` (vélo 85 min, bandeau nutrition)
- S4 (6 sessions) : contient `bw4a` (vélo 135 min, bandeau nutrition), `brw4a` (brick)
- S6 (6 sessions) : contient `bw7a` (vélo 75 min, bandeau nutrition), `brw7a` (brick)
- S7 (4 sessions, RACE_WEEK) : contient checklist course. Sessions : `rw7a`? (à vérifier)

**Bandeau nutrition (Lot 3 v13)** : activé si `disciplineKey === 'bike' && session.unit === 'min' && session.dist > 60`. Séances qualifiantes : `bw6a` (S3, 85 min), `bw4a` (S4, 135 min), `bw7a` (S6, 75 min). Bricks exclus (disciplineKey = 'brick').

**Semaines par session dans le plan v13** (S1-S7, 36 sessions totales) :
- S1: 4 | S2: 5 | S3: 6 | S4: 6 | S5: 5 | S6: 6 | S7: 4

**Détection semaine active** : basée sur la date calendaire réelle (`getCalendarActiveWeekNum()`). Clampée [1..TOTAL_WEEKS]. Retourne 1 si aucune date de fin définie, ou si today <= programStart. Retourne TOTAL_WEEKS si today >= programEnd.

**Vue unique** : uniquement vue semaine unifiée (`buildWeekView`), pas de tabs par discipline.

**Syntaxe JS v13** : validée par `node --check` (aucune erreur).

**Why** : Application personnelle de suivi d'entraînement triathlon Half-Ironman, replan Vichy 70.3, race 23 août 2026, programme 7 semaines actives S1-S7.

**How to apply** : Utiliser ces clés localStorage exactes dans les scénarios de test. Toujours re-vérifier les IDs concrets dans `weeklyPlan`. Si localStorage contient `hi_tri_program_end != '2026-08-23'`, le countdown sera faux. Tester le bug updateStats en vérifiant la barre de progression après avoir complété toutes les sessions S1-S7.
