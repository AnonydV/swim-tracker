---
name: project-triathlon-tracker
description: Triathlon PWA tracker — architecture, visual charter, and known UX constraints for prompt generation
metadata:
  type: project
---

Application PWA triathlon, fichier unique `index.html` (~4930 lignes post-N4, Vanilla JS, dark theme). 5 disciplines : natation, vélo, running, muscu, brick.

**Charte visuelle :**
- Fond : `#07090f`, card : `#131d2e`, border : `#1c2d44`
- Accent swim : `#38bdf8`, bike : `#facc15`, run : `#a3e635`, str : `#c084fc`, brick : `#fb923c`
- Polices : JetBrains Mono (données numériques), DM Sans (texte UI)
- Touch targets min : 44px height (spec N2 : 56px pour le bouton "Fait")

**Architecture données :**
- 1 plan unifié `const weeklyPlan = [...]` (migration plan séparé → unifié terminée en juillet 2026)
- `TOTAL_WEEKS = 14` → passe à `10` en v8 (sprint Vichy 2026-07-06)
- `dist` en MINUTES dans tous les plans
- IDs session : `sw{n}{l}` (swim), `bw{n}{l}` (bike), `rw{n}{l}` (run), `mw{n}{l}` (str), `brw{n}{l}` (brick)
- `brw` doit être testé avant `bw` dans getDiscipline — déjà géré par le sort sur `prefix.length`

**Clés localStorage (STORE) — NE JAMAIS MODIFIER :**
- `hi_swim_tracker_v3` — completed
- `hi_swim_skipped_v1` — skipped
- `hi_tri_session_notes_v1` — notes
- `hi_tri_session_results_v1` — results
- `hi_tri_perf_results_v1` — perfResults
- `hi_tri_program_end` — programEnd
- `hi_tri_program_start` — legacyStart

**Architecture UI — structure HTML `.container` (L1237-1284) :**
```
<div class="container">
  <div id="remaining-sessions-panel"></div>  ← ajouté par N2 (premier élément)
  <div class="stats-bar">...</div>
  <div class="program-date-panel">...</div>
  <div class="load-chart-panel">...</div>
  <div id="plan"></div>
</div>
```

**Fonctions clés et leurs lignes (state post-N2) :**
- `getCalendarActiveWeekNum()` L2751 — semaine active 1-14
- `getWeekSessions(weekNum)` L2876 — `{ swim:[], bike:[], run:[], str:[], brick:[] }`
- `refreshCalendarViews()` L2790 — point d'entrée refresh global
- `buildWeekView(weekNum)` L3001 — construit `#plan`, appelle `buildRemainingSessionsPanel()` en fin de fonction
- `buildRemainingSessionsPanel()` — à insérer après `buildWeekView`, avant `wvToggleDone`
- `buildSessionCard(session, disciplineKey)` L2966 — carte expandable complète (ne pas réutiliser pour les blocs compacts)
- `wvToggleDone(id)` L3081 — marque fait, ouvre perf sheet si première fois
- `closePerfSheet(didSave)` L3861 — appelle `buildWeekView(currentWeekView)` à L3872
- `showToast(state)` L3398 — 15+ états existants
- `getSessionDisplayName(session)` L2901, `getDistLabel(session, disc)` L2895, `getDiscipline(id)` L2669

**CSS classes existantes réutilisables :**
- `.wsc-badge.{swim|bike|run|str|brick}` L925-929 — badges durée colorés par discipline
- Variables CSS : `--green: #4ade80`, `--muted: #5a7a99`, `--card`, `--border`, `--bg`

**Séquence d'init (fin du script, post-N2) :**
```js
renderProgramEndControl();
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```

**Structure HTML `.container` réelle (L1337-1401) :**
```
#remaining-sessions-panel  (N2)
.stats-bar
.program-date-panel
#load-chart-panel → svg#load-chart-svg (H=130, padL=4, padR=4, padT=18, padB=22)
#progression-panel (skeleton HTML déjà présent, buildProgressionPanel() à implémenter — sprint N1+N3)
  → #prog-chips (4 chips : swim/bike/run/str)
  → #progression-chart-area
#prog-tooltip (fixed, hidden, z-index 300)
#plan
```

**perfResults schema par discipline :**
- swim : `{ rpe, paceS, distM, pctBrasse }` — `pctBrasse` retiré de la SAISIE en v8 mais présent dans les données historiques → tolérer en lecture, ne jamais écrire
- bike : `{ rpe, watts, durationMin, distKm }`
- run  : `{ rpe, paceKmS, distKm }`
- str  : `{ rpe, chargesNote }`

**PHASE_COLORS** : défini LOCALEMENT dans buildLoadChart (pas comme const globale) : `{ 1: '#38bdf8', 2: '#facc15', 3: '#fb923c', 4: '#4ade80' }`

**SW cache actuel** : `hiplan-v11` dans `sw.js` (L1). Badge version dans `<h1>` : `<small class="app-version">v11</small>` (index.html **L1531**). Convention : bumper ensemble badge + SW à chaque sprint livré. Sprint v12 (pack fiabilité) bumpera à v12.

**Champ `session.type` (niveau séance, pas sets[].type)** : chaque séance weeklyPlan a un `type` stable. Valeurs réelles du plan :
- Run : `r-endurance`, `r-tempo`, `r-threshold`, `r-recovery`
- Swim : `s-technique`, `s-endurance`
- Bike : `b-endurance`, `b-sweetspot`
- Brick : `brick` | Muscu : `strength`
Ce champ est LA bonne clé de classification par type de séance (zéro regex, O(1) lookup). NE PAS confondre avec `sets[].type` qui vaut `warm`/`main`/`interval`/`cool`.

**Z-index hiérarchie complète (état post-N4) :**
- 100 : header
- 799 : #perf-backdrop, #weekly-recap-backdrop
- 800 : #perf-sheet, #weekly-recap-sheet
- 900 : #snapshots-backdrop
- 901 : #snapshots-panel
- 902 : #session-history-backdrop (N4)
- 903 : #session-history-sheet (N4)
- 950 : #snapshot-confirm-backdrop
- 951 : #snapshot-confirm-modal

**CSS `.wsc-btn.detail` pré-existait** (index.html L1092-1093) sans être utilisé avant N4. Prévu pour des boutons discrets dans les cards de la vue semaine.

**Bottom sheet pattern standard :** injection via `insertAdjacentHTML('beforeend')` dans le bloc d'init, display:none/block + classe `open` pour la transition CSS transform. Swipe-to-dismiss sur handle (seuil 80px). Voir `initWeeklyRecapSwipe()` comme référence.

**STORE complet (index.html L2856-2866) :**
- `completed:   'hi_swim_tracker_v3'`
- `skipped:     'hi_swim_skipped_v1'`
- `notes:       'hi_tri_session_notes_v1'`
- `results:     'hi_tri_session_results_v1'`
- `perfResults: 'hi_tri_perf_results_v1'`
- `programEnd:  'hi_tri_program_end'`
- `legacyStart: 'hi_tri_program_start'`
- `weeklyRecapShown: 'hi_tri_weekly_recap_shown_w'`
- Clé P3 (à ajouter) : `snapshots: 'hi_tri_snapshots'`

**Weekly recap** : bottom sheet (`#weekly-recap-sheet` / `#weekly-recap-backdrop`), injecté via `insertAdjacentHTML('beforeend')` avant le boot (L4592-4610). PAS une modal.

**Séquence de boot réelle (L4613-4633, scope global) :**
```js
takeSnapshotIfNeeded(); // ajouté en P3, doit être EN PREMIER
renderProgramEndControl();
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
// + SW register
```

**exportData() / importData() (L3744 / L3770) :** Collecte les 6 clés via `collectStateSnapshot()` (à créer en P3 pour factoriser). importData écrit dans STORE puis appelle `refreshCalendarViews()` + `showToast('import-ok')`.

**showToast() (L3825)** : 15+ états string. Pattern : `else if (state === 'xyz') { t.textContent = '...'; t.style.background = '...'; }` avant le `else` final.

**Features livrées :**
- RPE + résultats par discipline (modal post-séance `openPerfSheet`)
- N2 — bloc "Séances restantes" — premier élément visible, bouton Fait 56px, haptic vibrate(40)
- N1+N3 — graphes progression réelle par discipline + overlay charge vécue
- P3 — snapshots localStorage rotatifs (anneau de 3) + restauration sécurisée
- P4+U5 — countdown course dans sous-titre header + progression de phase dans vue semaine
- N4 — historique par type de séance (bottom sheet 60vh, classification via session.type)
- v8-v11 — replan Vichy 70.3 (TOTAL_WEEKS=10, RACE_WEEK=7, programEnd=2026-09-13, course=2026-08-23)
- v12 (prompt 2026-07-07) — pack fiabilité : fix countdown (getRaceDate), safeWrite, récup corruption, toasts SW, ligne PROCHAIN
- v13 (prompt 2026-07-07) — mode course : checklist S7 (4 sections, 27 items, hi_tri_race_checklist_v1), fiche jour J (5 blocs bottom sheet, RACE_DAY_DATA), bandeau nutrition (bike >60 min : bw6a/bw4a/bw7a ; run >75 min : aucun dans plan actuel), accent orange header J-7→J-0
- v15 (prompt 2026-07-08) — pré-course : toggle outdoor (hi_tri_outdoor_v1, classe .outdoor-mode, --muted=#8ab5cc, badges 12px), état adapté eau libre (sw1c/sw4c/sw7a, hi_tri_adapted_v1, comptabilisé comme fait), check-in matinal 3 sliders (hi_tri_checkin_v1, courbe 14j mini-panel séparé, alerte fatigue S3/S4), guide séance sautée (bottom sheet consultative, matrice raison×délai, pas de persistance)
- v16 (prompt 2026-07-08) — rapport coach : bouton "Rapport Coach" dans program-date-panel, `exportCoachReport()` génère `hiplan-rapport-coach-YYYY-MM-DD.md` (Markdown lisible par LLM, semaines 1→activeWeekNum, tableau séances avec statut/résultats/RPE/notes, check-in hebdo)

**Variables ajoutées en v12 (ne pas re-déclarer) :**
- `const RACE_WEEK = 7` — juste après `TOTAL_WEEKS`
- `let _corruptionDetected = false` — juste avant `loadStoredState`
- `function getRaceDate()` — juste après `getProgramEndDate()`, avant `getProgramStartDate()`
- `function safeWrite(key, value)` — juste avant `save()`
- `function goToNextSession(id)` — juste avant `buildRemainingSessionsPanel()`

**États toast ajoutés en v12 :** `'storage-quota'`, `'sw-update'`, `'sw-offline'` (dans `showToast()` avant le `else` final)

**Nouvelles identités ajoutées en v13 (ne pas re-déclarer) :**
`RACE_CHECKLIST`, `RACE_DAY_DATA`, `NUTRITION_PROTOCOLS`, `buildRaceChecklistCard`, `toggleRaceChecklistItem`, `buildRaceDaySheetContent`, `openRaceDaySheet`, `closeRaceDaySheet`, `buildNutritionBannerHtml`

**Nouvelles identités ajoutées en v15 (ne pas re-déclarer) :**
`outdoorMode`, `toggleOutdoorMode`, `initOutdoorMode`, `adapted`, `OPEN_WATER_IDS`, `isOpenWaterSession`, `toggleAdapted`, `checkinData`, `saveCheckin`, `buildCheckinWidget`, `buildCheckinForm`, `renderCheckinCurve`, `MISSED_ADVICE`, `MISSED_TAPER_NOTE`, `buildMissedSessionSheet`, `openMissedSessionSheet`, `closeMissedSessionSheet`

**Nouvelles identités ajoutées en v16 (ne pas re-déclarer) :**
`exportCoachReport` (+ éventuellement `formatSecondsToMMSS` si déclarée en helper)

**États toast ajoutés en v15 :** `'adapted'`, `'checkin-saved'`

**Clés localStorage v13 (hors STORE) :** `'hi_tri_race_checklist_v1'` — objet `{itemId: bool}`, écriture via `safeWrite()`

**Clés localStorage v15 (hors STORE) :**
- `'hi_tri_outdoor_v1'` — booléen stringifié `'true'/'false'`
- `'hi_tri_adapted_v1'` — objet `{sessionId: bool}`
- `'hi_tri_checkin_v1'` — objet `{'YYYY-MM-DD': {sleep, legs, energy}}`

**Séances eau libre du plan 7 semaines :** `sw1c` (S1), `sw4c` (S4), `sw7a` (S7) — les seules auxquelles le bouton/état adapté s'applique. Définis dans `const OPEN_WATER_IDS = { 'sw1c': true, 'sw4c': true, 'sw7a': true }`.

**Injection point checklist dans buildWeekView :** après `container.appendChild(grid)`, avant `buildRemainingSessionsPanel()`, conditionnel sur `weekNum === RACE_WEEK`

**Injection widget check-in dans buildWeekView :** après `container.appendChild(nav)`, avant `container.appendChild(summary)`, conditionnel sur `isActive`

**Detection nutrition banner :** `disciplineKey === 'bike' && session.unit === 'min' && session.dist > 60` → bike protocol ; `disciplineKey === 'run' && session.unit === 'min' && session.dist > 75` → run protocol. Bricks exclus. Run protocol never triggered in current 7-week plan.

**z-index fiche course :** backdrop 200, sheet 210 (juste au-dessus des autres sheets)

**TOTAL_WEEKS et plan :** 7 semaines (plan replan Vichy). WEEK_PHASES : 5 phases — BASE(1-2), CONSTRUCTION(3-4), RÉCUPÉRATION(5), AFFÛTAGE(6), COURSE(7). Alerte fatigue check-in uniquement en S3/S4 (semaines de charge).

**Stratégie courbe check-in :** mini-panel SVG séparé (`#checkin-curve-panel`), jamais dans le SVG `load-chart-svg`. Permet de ne pas modifier `buildLoadChart()`.

**Mode outdoor :** bouton `#outdoor-toggle-btn` en `position: absolute; top:10px; right:10px` sur `.app-header` (qui doit avoir `position: relative`). Ne modifie pas le flux du `.logo-block`. Overrides ciblés uniquement : `--muted`, `wsc-badge font-size`, `wsc-name font-size`, quelques labels.

**Why:** Tracker solo mobile, usage sous effort. La friction n°1 était de scroller avant de voir les séances du jour.

**How to apply:** Dark theme absolu + couleurs par discipline. Ne jamais modifier STORE, DISCIPLINE_CONFIG, wvToggleDone, wvToggleSkip, openPerfSheet, closePerfSheet, validatePlan. Les prompts doivent inclure les lignes exactes du code affecté (l'agent n'a pas de contexte hors prompt).
