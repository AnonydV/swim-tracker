# Sprint « Pré-Course » — HIPLAN v15

---

## Contexte technique

### Fichiers cibles

Deux fichiers à modifier :

- **`index.html`** à la racine du projet (~5000 lignes, actuellement `v14`). Ce fichier contient l'intégralité du HTML, du CSS (dans `<style>`) et du JavaScript (dans `<script>`). Il ne doit pas être découpé en fichiers supplémentaires.
- **`sw.js`** (à la racine, ligne 1 : `const CACHE = 'hiplan-v14';`). Modifié uniquement pour le bump de version en fin de sprint.

Contraintes absolues :
- Vanilla JS uniquement. Zéro framework, zéro bibliothèque externe, zéro import ES module.
- Aucun fichier supplémentaire sauf `sw.js` (déjà existant).
- Aucune dépendance npm, pas de build step.
- Mobile-first, touch targets minimum 44 px sauf mention contraire explicite, viewport cible 390 px.

### Cartographie des zones pertinentes dans `index.html`

Lis chaque zone avant modification pour confirmer les numéros de ligne — ils peuvent avoir légèrement dérivé depuis la lecture initiale.

**Fin du bloc `<style>` (~L1922) :**
```
.nb-note::before { content: '\2022'; position: absolute; left: 0; color: var(--orange); }
</style>
```
C'est ici qu'on ajoute tout nouveau CSS (immédiatement avant `</style>`).

**Balise `<header>` (~L1928-1943) :**
```html
<header class="app-header">
  <div class="header-inner">
    <div class="logo-block">
      <h1>HALF <span>IRONMAN</span> <small class="app-version">v14</small></h1>
      <p id="header-subtitle">// Mon plan d'entrainement</p>
      <button id="header-race-btn" style="display:none" onclick="openRaceDaySheet()" aria-label="Fiche course">&#x1F3C1; Fiche course</button>
    </div>
    <div class="progress-global">
      ...
    </div>
  </div>
</header>
```

**`--muted` (~L35) :**
```css
--muted: #5a7a99;
```
Variable CSS dans `:root`. Le Lot 1 la modifie conditionnellement via classe `.outdoor-mode` sur `<body>`.

**`wsc-badge` (~L1048-1061) :**
```css
.wsc-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  ...
}
.wsc-badge.swim  { background: rgba(56,189,248,0.15);  color: var(--accent); }
.wsc-badge.bike  { background: rgba(250,204,21,0.15);  color: #facc15; }
...
```
Les badges de discipline (`wsc-badge`) sont les pills affichant la durée sur chaque session card. Le Lot 1 augmente leur `font-size` à 12px en mode outdoor.

**`const STORE` (~L2793) :**
```js
const STORE = {
  completed:        'hi_swim_tracker_v3',
  skipped:          'hi_swim_skipped_v1',
  notes:            'hi_tri_session_notes_v1',
  results:          'hi_tri_session_results_v1',
  perfResults:      'hi_tri_perf_results_v1',
  programEnd:       'hi_tri_program_end',
  legacyStart:      'hi_tri_program_start',
  weeklyRecapShown: 'hi_tri_weekly_recap_shown_w',
  snapshots:        'hi_tri_snapshots',
};
```

**`safeWrite(key, value)` (~L2829) :** helper localStorage avec guard `QuotaExceededError` — déjà existant depuis v12. NE PAS RE-DÉCLARER.

**`const TOTAL_WEEKS = 7` (~L2861) et `const RACE_WEEK = 7` (~L2862) :** constantes déjà déclarées. NE PAS RE-DÉCLARER.

**`const RACE_CHECKLIST` (~L2864) :** défini immédiatement après `RACE_WEEK`. NE PAS RE-DÉCLARER.

**`const DISCIPLINE_CONFIG` (~L3071) :**
```js
const DISCIPLINE_CONFIG = {
  swim:  { label: 'Natation', emoji: '🏊', color: 'swim',  accent: '#38bdf8', defaultUnit: 'min', prefix: 'sw'  },
  bike:  { label: 'Vélo',     emoji: '🚴', color: 'bike',  accent: '#facc15', defaultUnit: 'min', prefix: 'bw'  },
  run:   { label: 'Running',  emoji: '🏃', color: 'run',   accent: '#a3e635', defaultUnit: 'min', prefix: 'rw'  },
  str:   { label: 'Muscu',    emoji: '💪', color: 'str',   accent: '#c084fc', defaultUnit: '',    prefix: 'mw'  },
  brick: { label: 'Brick',    emoji: '🧱', color: 'brick', accent: '#fb923c', defaultUnit: 'min', prefix: 'brw' },
};
```

**`const WEEK_PHASES` (~L3098) :**
```js
const WEEK_PHASES = [
  { phase: 1, name: 'BASE AÉROBIE',      weeks: [1, 2] },
  { phase: 2, name: 'CONSTRUCTION 70.3', weeks: [3, 4] },
  { phase: 3, name: 'RÉCUPÉRATION',      weeks: [5] },
  { phase: 4, name: 'AFFÛTAGE',          weeks: [6] },
  { phase: 5, name: 'COURSE',            weeks: [7] },
];
```

**Séances eau libre dans `weeklyPlan` :**
Identifiées par leur `id` (préfixe `sw`) et présentes dans le plan :
- `sw1c` — semaine 1, "Natation — Première sortie eau libre"
- `sw4c` — semaine 4, "Natation — Sortie eau libre longue (combinaison)"
- `sw7a` — semaine 7, "Natation — Sortie eau libre pré-course (sans combinaison)"

Ce sont les seules séances natation eau libre du plan. Le Lot 2 s'applique uniquement à ces trois IDs.

**`getRaceDate()` (~L3144) :** fonction déjà déclarée depuis v12. NE PAS RE-DÉCLARER.

**`updateHeaderSubtitle()` (~L3230) :** calcule `raceDate` et `diffDays` dans son corps. Le Lot 1 l'étend sans toucher à la logique existante.

**`buildLoadChart()` (~L3476-3560) :** construit le graphe SVG de charge. Le Lot 3 ajoute une courbe de forme en overlay ou un mini-panel séparé sous le graphe. L'axe SVG existant a : `padT = 18`, `padB = 22`, `H = 130`. Un axe secondaire dans ce SVG est techniquement risqué (espace limité) — si trop complexe, utiliser la variante mini-panel séparé décrite dans le Lot 3.

**`buildSessionSetsHtml(session, disciplineKey)` (~L3668) :** NE PAS MODIFIER. Signature exacte à conserver.

**`buildSessionDetailHtml(session, disciplineKey)` (~L3704) :** corps actuel :
```js
function buildSessionDetailHtml(session, disciplineKey) {
  return `
    <div class="session-detail" id="week-detail-${session.id}">
      ${buildSessionSetsHtml(session, disciplineKey)}
      ${session.tip ? `<div class="session-tip-box"><strong>💡 Conseil :</strong> ${session.tip}</div>` : ''}
      ${buildNutritionBannerHtml(session, disciplineKey)}
      ${buildSessionResultHtml(session)}
      ${buildSessionNoteHtml(session.id)}
    </div>
  `;
}
```
Le Lot 4 ajoute un lien discret « Séance impossible ? » dans cette fonction.

**`buildSessionCard(session, disciplineKey)` (~L3717) :** construit la card d'une séance. Structure des états d'action actuels (dans la variable `actionBtns`) :
```js
if (isDone)        → bouton "✕ Annuler"
else if (isSkipped) → bouton "↩ Unskip"
else               → boutons "✓ Fait" + "⏭ Skip"
```
Le Lot 2 ajoute le bouton « Adapté » dans la branche `else` (état neutre) uniquement pour les séances eau libre.

**`buildWeekView(weekNum)` (~L3880) :** fin de la fonction (~L3959-3963) :
```js
  container.appendChild(grid);
  if (weekNum === RACE_WEEK) {
    container.appendChild(buildRaceChecklistCard());
  }
  buildRemainingSessionsPanel();
}
```
Le Lot 3 injecte le widget check-in en haut de la vue semaine active (voir section Lot 3 pour le point d'injection exact).

**`buildRemainingSessionsPanel()` (~L3977) :** NE PAS MODIFIER — fonction existante non concernée par ce sprint.

**`showToast(state)` (~L4483) :** états existants — NE PAS RE-DÉCLARER :
`true`, `false`, `'skip'`, `'unskip'`, `'date-saved'`, `'date-error'`, `'note-saved'`, `'notes-copied'`, `'notes-empty'`, `'notes-error'`, `'import-ok'`, `'import-error'`, `'import-version'`, `'result-saved'`, `'perf-saved'`, `'perf-skipped'`, `'snapshot-restored'`, `'snapshot-none'`, `'storage-quota'`, `'sw-update'`, `'sw-offline'`.

**Pattern bottom sheet existant (~L4624+) :** toutes les sheets suivent ce pattern :
1. DOM injecté via `document.body.insertAdjacentHTML('beforeend', ...)` au boot, après `initHistorySheetSwipe()`.
2. Ouvrir : `backdrop.style.display = 'block'`; `sheet.style.display = 'block'`; double `requestAnimationFrame` pour déclencher la transition CSS.
3. Fermer : `sheet.classList.remove('open')`; `setTimeout(..., 350)` pour cacher après animation.
4. CSS : `transform: translateY(100%)` au repos; `.open { transform: translateY(0); }`.

**Séquence de boot (~L5478+) :**
```js
initHistorySheetSwipe();

if (_corruptionDetected) { ... } else { takeSnapshotIfNeeded(); }

renderProgramEndControl();
updateHeaderSubtitle();
document.fonts.ready.then(() => updateHeaderSubtitle());
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```
Les nouvelles initialisations du Lot 1 (restauration état outdoor) et du Lot 3 (restauration check-in) se font AVANT `updateHeaderSubtitle()` resp. AVANT `buildLoadChart()`.

**Variables globales — NE PAS RE-DÉCLARER :**
```
STORE, completed, skipped, sessionNotes, sessionResults, perfResults,
currentSport, currentWeekView, TOTAL_WEEKS, RACE_WEEK, DISCIPLINE_CONFIG,
SESSION_TYPE_LABELS, WEEK_PHASES, RPE_COLORS, weeklyPlan, _corruptionDetected,
safeWrite, getRaceDate, goToNextSession, getDiscipline, RACE_CHECKLIST,
RACE_DAY_DATA, NUTRITION_PROTOCOLS, buildRaceChecklistCard,
toggleRaceChecklistItem, buildRaceDaySheetContent, openRaceDaySheet,
closeRaceDaySheet, buildNutritionBannerHtml
```

**Nouvelles identités à vérifier avant ajout** (recherche textuelle — si l'un existe déjà, s'arrêter et signaler) :
```
outdoorMode, toggleOutdoorMode, initOutdoorMode,
adapted, toggleAdapted, isOpenWaterSession,
checkinData, buildCheckinWidget, saveCheckin, renderCheckinCurve,
buildMissedSessionSheet, openMissedSessionSheet, closeMissedSessionSheet
```

**Clés localStorage — NE JAMAIS MODIFIER LES CHAÎNES EXISTANTES :**
```
'hi_swim_tracker_v3'       → completed
'hi_swim_skipped_v1'       → skipped
'hi_tri_session_notes_v1'  → sessionNotes
'hi_tri_session_results_v1'→ sessionResults
'hi_tri_perf_results_v1'   → perfResults
'hi_tri_program_end'       → programEnd
'hi_tri_snapshots'         → anneau de 3 snapshots
'hi_tri_race_checklist_v1' → checklist course (v13+)
```
Nouvelles clés ajoutées dans ce sprint (lecture/écriture directe via `safeWrite`, pas dans `STORE`) :
```
'hi_tri_outdoor_v1'  → booléen stringifié (Lot 1)
'hi_tri_adapted_v1'  → objet {sessionId: bool} (Lot 2)
'hi_tri_checkin_v1'  → objet {'YYYY-MM-DD': {sleep, legs, energy}} (Lot 3)
```

**Design system :**
```css
--accent: #38bdf8;          /* swim */
--orange: #fb923c;          /* alerte / course / adapté */
--orange-dim: rgba(251,146,60,0.12);
--green: #4ade80;
--red: #f87171;
--muted: #5a7a99;           /* valeur par défaut — modifiée en outdoor */
```
Couleurs disciplines : swim `#38bdf8`, bike `#facc15`, run `#a3e635`, muscu `#c084fc`.
Polices : titres `'Bebas Neue', sans-serif` · chiffres `'JetBrains Mono', monospace` · corps `'Outfit', sans-serif`.

---

## Raison des changements

Ce sprint « Pré-Course » livre 4 lots UX à J-46 de Vichy 70.3 (dimanche 23 août 2026), dans les 7 semaines restantes du plan. Les 4 lots améliorent l'expérience de préparation sans modifier les données de séances ni la structure du programme.

- **Lot 1** : les entraînements en extérieur (plein soleil) rendent l'écran illisible. Un toggle de luminosité renforce les contrastes sans changer le design system de base.
- **Lot 2** : les sorties eau libre (lac) se passent souvent dans des conditions différentes du plan (durée écourtée, météo). Un état « Adapté » distinct de Fait/Skippé capture cette réalité sans fausser les stats de complétion.
- **Lot 3** : la fatigue accumulée n'est pas visible dans l'app. Un check-in matinal (3 sliders) et une courbe de forme permettent de détecter les semaines à risque avant de se blesse.
- **Lot 4** : une séance ratée sans guidage crée de l'anxiété. Une bottom sheet légère avec recommandation basée sur la raison et le délai avant reprise aide à décider sans sur-compenser.

---

## Ce qu'il faut implémenter

---

### Lot 1 — Mode plein soleil (toggle SOL/NUI)

#### 1a. Déclarer la variable globale `outdoorMode`

Localise `let currentSport = 'week';` (~L2859). Insère la ligne suivante immédiatement APRÈS. Vérifie qu'aucune déclaration `outdoorMode` n'existe déjà.

```js
let outdoorMode = false;
```

#### 1b. Ajouter `toggleOutdoorMode()` et `initOutdoorMode()`

Localise `function updateHeaderSubtitle()` (~L3230). Insère immédiatement AVANT cette fonction les deux fonctions suivantes. Vérifie qu'aucune déclaration `toggleOutdoorMode` ou `initOutdoorMode` n'existe.

```js
function toggleOutdoorMode() {
  outdoorMode = !outdoorMode;
  safeWrite('hi_tri_outdoor_v1', outdoorMode ? 'true' : 'false');
  document.body.classList.toggle('outdoor-mode', outdoorMode);
  var btn = document.getElementById('outdoor-toggle-btn');
  if (btn) btn.textContent = outdoorMode ? '☀' : '☽';
  btn && btn.setAttribute('aria-pressed', String(outdoorMode));
}

function initOutdoorMode() {
  var stored = localStorage.getItem('hi_tri_outdoor_v1');
  outdoorMode = (stored === 'true');
  document.body.classList.toggle('outdoor-mode', outdoorMode);
  var btn = document.getElementById('outdoor-toggle-btn');
  if (btn) {
    btn.textContent = outdoorMode ? '☀' : '☽';
    btn.setAttribute('aria-pressed', String(outdoorMode));
  }
}
```

Note : `☀` = ☀, `☽` = ☽. Si un emoji ne s'affiche pas correctement sur le device cible, remplacer par les labels texte `SOL` / `NUI` dans `textContent`.

#### 1c. Ajouter le bouton toggle dans le HTML du header

Localise le bloc HTML du header. Le `.logo-block` contient actuellement `<h1>`, `<p id="header-subtitle">` et `<button id="header-race-btn">`. Ajoute le bouton suivant comme **premier enfant de `.logo-block`**, avant le `<h1>`, afin qu'il soit positionné en absolu dans le coin et ne déplace aucun élément existant :

```html
<button id="outdoor-toggle-btn"
  onclick="toggleOutdoorMode()"
  aria-label="Basculer mode plein soleil"
  aria-pressed="false"
  title="Mode plein soleil">&#x263D;</button>
```

Ce bouton sera positionné en `position: absolute` dans le coin supérieur droit du header via CSS (voir 1d), sans modifier le flux du `.logo-block` ni ajouter de hauteur au header.

#### 1d. Ajouter le CSS du Lot 1

Ajoute le bloc suivant immédiatement avant `</style>` (~L1922) :

```css
/* ─── LOT 1 — MODE PLEIN SOLEIL ─── */
#outdoor-toggle-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  color: var(--muted);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  transition: background 0.15s, color 0.15s;
}
#outdoor-toggle-btn[aria-pressed="true"] {
  color: #facc15;
  border-color: rgba(250,204,21,0.4);
  background: rgba(250,204,21,0.08);
}
#outdoor-toggle-btn:active { background: rgba(255,255,255,0.08); }

/* Mode outdoor : overrides ciblés uniquement */
body.outdoor-mode {
  --muted: #8ab5cc;
}
body.outdoor-mode .wsc-badge {
  font-size: 12px;
}
body.outdoor-mode .wsc-name {
  font-size: 15px;
}
body.outdoor-mode .session-note-label,
body.outdoor-mode .set-desc,
body.outdoor-mode .session-tip-box {
  font-size: 14px;
}
body.outdoor-mode .week-nav-title,
body.outdoor-mode .wsb-lbl {
  font-size: 13px;
}
```

Note sur le contraste : `--muted` passe de `#5a7a99` à `#8ab5cc`, ratio ≈ 5.4:1 sur fond `#07090f`. Les éléments dont le `font-size` est déjà ≥ 14px ne sont pas modifiés.

Le header a `position: sticky` — le bouton en `position: absolute` doit être relatif à `.app-header`. Vérifie que `.app-header` a `position: relative` (ajouter `position: relative;` à la règle `.app-header` si absent).

#### 1e. Appeler `initOutdoorMode()` au boot

Dans la séquence de boot, localise la ligne `renderProgramEndControl();`. Insère `initOutdoorMode();` immédiatement AVANT cette ligne :

```js
initOutdoorMode();
renderProgramEndControl();
```

---

### Lot 2 — État « Adapté » pour les séances eau libre

#### 2a. Déclarer `adapted` et `isOpenWaterSession()`

Localise `let completed = loadStoredState(STORE.completed);` (~L2823). Insère immédiatement APRÈS le bloc de déclarations `completed / skipped / sessionNotes / sessionResults / perfResults` (soit après la ligne `let perfResults = ...`) le bloc suivant. Vérifie qu'aucune déclaration `adapted` n'existe déjà.

```js
var adapted = {};
(function() {
  try { adapted = JSON.parse(localStorage.getItem('hi_tri_adapted_v1') || '{}'); } catch { adapted = {}; }
})();
```

Utilise `var` (pas `const`/`let`) pour `adapted` car il est muté directement comme `completed` et `skipped`.

Localise `function getDiscipline(sessionId)` (~L3079). Insère immédiatement AVANT cette fonction. Vérifie qu'aucune déclaration `isOpenWaterSession` n'existe.

```js
var OPEN_WATER_IDS = { 'sw1c': true, 'sw4c': true, 'sw7a': true };

function isOpenWaterSession(sessionId) {
  return !!OPEN_WATER_IDS[sessionId];
}
```

#### 2b. Ajouter `toggleAdapted(id)`

Localise `function wvToggleDone(id)` (~L4031). Insère immédiatement AVANT cette fonction. Vérifie qu'aucune déclaration `toggleAdapted` n'existe.

```js
function toggleAdapted(id) {
  var openCards = getOpenWeekSessionIds();
  if (adapted[id]) {
    delete adapted[id];
  } else {
    adapted[id] = true;
    delete completed[id];
    delete skipped[id];
    save();
  }
  safeWrite('hi_tri_adapted_v1', JSON.stringify(adapted));
  buildWeekView(currentWeekView);
  restoreOpenWeekSessions(openCards);
  if (adapted[id]) {
    showToast('adapted');
  }
}
```

#### 2c. Ajouter l'état de toast `'adapted'` dans `showToast()`

Localise `function showToast(state)` (~L4483). Dans la chaîne `else if`, ajoute la branche suivante **juste avant le `else` final** (le fallback `'↩ Skip annulé'`). Vérifie qu'aucun état `'adapted'` n'est déjà défini.

```js
  else if (state === 'adapted') { t.textContent = 'Séance marquée Adapté'; t.style.background = 'var(--orange)'; }
```

#### 2d. Modifier `buildSessionCard` pour ajouter le bouton « Adapté »

Localise `function buildSessionCard(session, disciplineKey)` (~L3717). Dans le corps de cette fonction, localise le calcul de `isDone`, `isSkipped`. Ajoute immédiatement APRÈS ces deux variables :

```js
  const isAdapted = isOpenWaterSession(session.id) && !!adapted[session.id];
```

Puis, dans le calcul de `actionBtns`, la branche `else` (état neutre — ni fait, ni skippé) contient actuellement :
```js
  } else {
    actionBtns = `
      <button class="wsc-btn check" onclick="event.stopPropagation(); wvToggleDone('${session.id}')">✓ Fait</button>
      <button class="wsc-btn skip" onclick="event.stopPropagation(); wvToggleSkip('${session.id}')">⏭ Skip</button>
    `;
  }
```

Remplace cette branche `else` par :
```js
  } else {
    var adaptedBtn = isOpenWaterSession(session.id)
      ? `<button class="wsc-btn adapted" onclick="event.stopPropagation(); toggleAdapted('${session.id}')">~ Adapté</button>`
      : '';
    actionBtns = `
      <button class="wsc-btn check" onclick="event.stopPropagation(); wvToggleDone('${session.id}')">✓ Fait</button>
      <button class="wsc-btn skip" onclick="event.stopPropagation(); wvToggleSkip('${session.id}')">⏭ Skip</button>
      ${adaptedBtn}
    `;
  }
```

Ajoute également le badge orange sur la card. Localise dans `buildSessionCard` la construction de la classe CSS de la card :
```js
  return `
    <div class="week-session-card wc-${config.color}${isDone ? ' wc-done' : ''}${isSkipped ? ' wc-skipped' : ''}${isOptional ? ' wc-optional' : ''}" id="week-card-${session.id}">
```
Remplace cette ligne par :
```js
  return `
    <div class="week-session-card wc-${config.color}${isDone ? ' wc-done' : ''}${isSkipped ? ' wc-skipped' : ''}${isAdapted ? ' wc-adapted' : ''}${isOptional ? ' wc-optional' : ''}" id="week-card-${session.id}">
```

Localise également le bloc `.wsc-top` dans `buildSessionCard`. Ajoute le badge ADAPTÉ juste après `${noteIndicator}${resultIndicator}` dans le `wsc-name`, de façon à ce qu'il s'affiche dans le titre de la card :

```js
  const adaptedBadge = isAdapted ? '<span class="wsc-badge-adapted">ADAPTÉ</span>' : '';
```

Et dans le HTML retourné, dans la div `.wsc-name` :
```js
    <div class="wsc-name ${isDone ? 'done-text' : ''}">${getSessionDisplayName(session)}${noteIndicator}${resultIndicator}${adaptedBadge} <span class="session-expand-icon">▾</span></div>
```

Pour l'état « Adapté » actif (séance déjà marquée adaptée), le bouton dans `actionBtns` doit devenir un bouton « Désadapter ». Modifie `buildSessionCard` pour gérer ce cas : si `isAdapted`, la branche `else` affiche le bouton d'annulation plutôt que les boutons Fait/Skip/Adapté :

```js
  if (isDone) {
    actionBtns = `<button class="wsc-btn uncheck" onclick="event.stopPropagation(); wvToggleDone('${session.id}')">✕ Annuler</button>`;
  } else if (isSkipped) {
    actionBtns = `<button class="wsc-btn unskip" onclick="event.stopPropagation(); wvToggleSkip('${session.id}')">↩ Unskip</button>`;
  } else if (isAdapted) {
    actionBtns = `<button class="wsc-btn unadapted" onclick="event.stopPropagation(); toggleAdapted('${session.id}')">↩ Désadapter</button>`;
  } else {
    var adaptedBtn = isOpenWaterSession(session.id)
      ? `<button class="wsc-btn adapted" onclick="event.stopPropagation(); toggleAdapted('${session.id}')">~ Adapté</button>`
      : '';
    actionBtns = `
      <button class="wsc-btn check" onclick="event.stopPropagation(); wvToggleDone('${session.id}')">✓ Fait</button>
      <button class="wsc-btn skip" onclick="event.stopPropagation(); wvToggleSkip('${session.id}')">⏭ Skip</button>
      ${adaptedBtn}
    `;
  }
```

**Impact sur `updateStats()` et `buildRemainingSessionsPanel()` :** les séances `adapted` doivent compter comme « faites » dans les stats et ne plus apparaître dans le panel « À faire cette semaine ». Localise `function updateStats()` (~L4510) et `function buildRemainingSessionsPanel()` (~L3977) :

Dans `updateStats()`, la séance est comptée `done` si `completed[s.id]`. Ajoute `|| adapted[s.id]` à cette condition. Localise la ligne :
```js
      if (completed[s.id]) {
```
Remplace par :
```js
      if (completed[s.id] || adapted[s.id]) {
```

Dans `buildRemainingSessionsPanel()`, la séance est exclue si `!completed[s.id] && !skipped[s.id]`. Localise :
```js
      if (!completed[s.id] && !skipped[s.id]) {
```
Remplace par :
```js
      if (!completed[s.id] && !skipped[s.id] && !adapted[s.id]) {
```

**Impact sur `exportData()` / `importData()` :** hors périmètre de ce sprint. `adapted` est persisté directement dans `localStorage` via sa propre clé, pas dans `STORE`. Les exports existants ne le couvrent pas — acceptable pour ce sprint.

#### 2e. Ajouter le CSS du Lot 2

Ajoute le bloc suivant immédiatement avant `</style>`, après le bloc CSS du Lot 1 :

```css
/* ─── LOT 2 — ÉTAT ADAPTÉ ─── */
.wsc-btn.adapted {
  background: var(--orange-dim);
  border: 1px solid rgba(251,146,60,0.5);
  color: var(--orange);
  min-height: 44px;
  min-width: 44px;
  padding: 6px 12px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.wsc-btn.adapted:active { background: rgba(251,146,60,0.25); }
.wsc-btn.unadapted {
  background: transparent;
  border: 1px solid rgba(251,146,60,0.3);
  color: var(--muted);
  min-height: 44px;
  min-width: 44px;
  padding: 6px 12px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.wsc-badge-adapted {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--orange);
  background: rgba(251,146,60,0.15);
  border-radius: 4px;
  padding: 1px 6px;
  margin-left: 4px;
  vertical-align: middle;
}
.week-session-card.wc-adapted {
  border-left: 3px solid var(--orange);
  opacity: 0.85;
}
```

---

### Lot 3 — Check-in matinal forme/fatigue

#### 3a. Déclarer `checkinData` et le charger au boot

Localise la déclaration `var adapted = {};` ajoutée en 2a. Insère immédiatement APRÈS le bloc d'initialisation de `adapted` le bloc suivant. Vérifie qu'aucune déclaration `checkinData` n'existe.

```js
var checkinData = {};
(function() {
  try { checkinData = JSON.parse(localStorage.getItem('hi_tri_checkin_v1') || '{}'); } catch { checkinData = {}; }
})();
```

#### 3b. Ajouter `saveCheckin()` et `buildCheckinWidget()`

Localise `function buildWeekView(weekNum)` (~L3880). Insère immédiatement AVANT cette fonction les deux fonctions suivantes. Vérifie qu'aucune déclaration `saveCheckin` ou `buildCheckinWidget` n'existe.

```js
function saveCheckin(sleep, legs, energy) {
  var today = toIsoLocalDate(startOfToday());
  checkinData[today] = { sleep: sleep, legs: legs, energy: energy };
  safeWrite('hi_tri_checkin_v1', JSON.stringify(checkinData));
  buildCheckinWidget();
  renderCheckinCurve();
  showToast('checkin-saved');
}

function buildCheckinWidget() {
  var el = document.getElementById('checkin-widget');
  if (!el) return;
  var today = toIsoLocalDate(startOfToday());
  var existing = checkinData[today];

  if (existing) {
    var avg = ((existing.sleep + existing.legs + existing.energy) / 3).toFixed(1);
    el.innerHTML = '<div class="ci-summary">'
      + '<div class="ci-summary-title">Check-in du jour</div>'
      + '<div class="ci-summary-scores">'
      + '<span class="ci-score">&#x1F634; ' + existing.sleep + '/5</span>'
      + '<span class="ci-score">&#x1F9B5; ' + existing.legs + '/5</span>'
      + '<span class="ci-score">&#x26A1; ' + existing.energy + '/5</span>'
      + '<span class="ci-avg">Moy. ' + avg + '</span>'
      + '</div>'
      + '<button class="ci-edit-btn" onclick="buildCheckinForm()">Modifier</button>'
      + '</div>';
  } else {
    buildCheckinForm();
  }
}

function buildCheckinForm() {
  var el = document.getElementById('checkin-widget');
  if (!el) return;
  var today = toIsoLocalDate(startOfToday());
  var existing = checkinData[today] || { sleep: 3, legs: 3, energy: 3 };
  el.innerHTML = '<div class="ci-form">'
    + '<div class="ci-form-title">Check-in matinal &mdash; ' + today + '</div>'
    + '<label class="ci-label">&#x1F634; Sommeil <span id="ci-val-sleep">' + existing.sleep + '</span>/5'
    + '<input class="ci-slider" type="range" min="1" max="5" value="' + existing.sleep + '" oninput="document.getElementById(\'ci-val-sleep\').textContent=this.value"></label>'
    + '<label class="ci-label">&#x1F9B5; Jambes <span id="ci-val-legs">' + existing.legs + '</span>/5'
    + '<input class="ci-slider" type="range" min="1" max="5" value="' + existing.legs + '" oninput="document.getElementById(\'ci-val-legs\').textContent=this.value"></label>'
    + '<label class="ci-label">&#x26A1; Énergie <span id="ci-val-energy">' + existing.energy + '</span>/5'
    + '<input class="ci-slider" type="range" min="1" max="5" value="' + existing.energy + '" oninput="document.getElementById(\'ci-val-energy\').textContent=this.value"></label>'
    + '<button class="ci-submit-btn" onclick="'
    + 'saveCheckin('
    + 'parseInt(document.querySelector(\'#checkin-widget input[type=range]:nth-of-type(1)\').value),'
    + 'parseInt(document.querySelector(\'#checkin-widget input[type=range]:nth-of-type(2)\').value),'
    + 'parseInt(document.querySelector(\'#checkin-widget input[type=range]:nth-of-type(3)\').value)'
    + ')">Valider le check-in</button>'
    + '</div>';
}
```

Note sur le sélecteur des sliders dans `saveCheckin` : utilise `#checkin-widget input[type=range]:nth-of-type(n)` (1, 2, 3) pour cibler sleep, legs, energy dans l'ordre de rendu. Vérifie que ce sélecteur fonctionne dans le contexte HTML généré par `buildCheckinForm()`.

#### 3c. Ajouter `renderCheckinCurve()` et la logique d'alerte

Insère immédiatement APRÈS les fonctions ajoutées en 3b, toujours AVANT `buildWeekView`. Vérifie qu'aucune déclaration `renderCheckinCurve` n'existe.

```js
function renderCheckinCurve() {
  // Récupère les 14 derniers jours avec un check-in, triés chronologiquement
  var today = startOfToday();
  var points = [];
  for (var i = 13; i >= 0; i--) {
    var d = addDays(today, -i);
    var key = toIsoLocalDate(d);
    if (checkinData[key]) {
      var e = checkinData[key];
      var avg = (e.sleep + e.legs + e.energy) / 3;
      points.push({ date: key, avg: avg });
    }
  }

  // Alerte : score < 2.5 deux jours consécutifs en semaine de charge (S3 ou S4)
  var activeWeek = getCalendarActiveWeekNum();
  if (activeWeek === 3 || activeWeek === 4) {
    var lowCount = 0;
    for (var j = points.length - 1; j >= 0 && lowCount < 2; j--) {
      if (points[j].avg < 2.5) { lowCount++; } else { break; }
    }
    if (lowCount >= 2) {
      var alertEl = document.getElementById('checkin-alert');
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.textContent = 'Attention : fatigue élevée 2 jours de suite en semaine de charge. Envisage de réduire le volume de la prochaine séance.';
      }
    } else {
      var alertEl2 = document.getElementById('checkin-alert');
      if (alertEl2) alertEl2.style.display = 'none';
    }
  }

  // Courbe dans le mini-panel (alternative au graphe SVG — voir note ci-dessous)
  var miniEl = document.getElementById('checkin-curve-panel');
  if (!miniEl || points.length < 2) return;

  var W = miniEl.clientWidth || 300;
  var H = 60;
  var padL = 4, padR = 4, padT = 6, padB = 14;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var n = points.length;
  var step = n > 1 ? chartW / (n - 1) : 0;

  var pathD = points.map(function(p, i) {
    var x = (padL + i * step).toFixed(1);
    var y = (padT + chartH - ((p.avg - 1) / 4) * chartH).toFixed(1);
    return (i === 0 ? 'M' : 'L') + x + ',' + y;
  }).join(' ');

  var labelsOut = points.map(function(p, i) {
    if (i !== 0 && i !== n - 1 && i !== Math.floor(n / 2)) return '';
    var x = (padL + i * step).toFixed(1);
    return '<text x="' + x + '" y="' + (H - 2) + '" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="7" fill="#3a5570">' + p.date.slice(5) + '</text>';
  }).join('');

  miniEl.innerHTML = '<svg width="100%" height="' + H + '" style="display:block">'
    + '<path d="' + pathD + '" stroke="#facc15" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>'
    + labelsOut
    + '</svg>';
}
```

Note sur la stratégie d'affichage de la courbe : la variante choisie est un **mini-panel séparé** sous le graphe de charge existant (div `#checkin-curve-panel`), pas une superposition dans le SVG `load-chart-svg`. Cette approche évite de modifier `buildLoadChart()` et réduit le risque de régression sur le graphe de charge. Le mini-panel est injecté dans le DOM fixe (voir 3d).

#### 3d. Injecter le widget check-in dans `buildWeekView`

Dans `buildWeekView(weekNum)`, la séquence courante commence par :
```js
  container.innerHTML = '';
  const sessionsBySport = getWeekSessions(weekNum);
  ...
  container.appendChild(nav);
```

Ajoute le widget check-in juste APRÈS `container.appendChild(nav)` et AVANT `container.appendChild(summary)`, mais **uniquement si la semaine affichée est la semaine active** :

```js
  container.appendChild(nav);

  // Widget check-in — semaine active uniquement
  if (isActive) {
    var ciDiv = document.createElement('div');
    ciDiv.id = 'checkin-widget';
    ciDiv.className = 'ci-container';
    container.appendChild(ciDiv);
    var ciAlert = document.createElement('div');
    ciAlert.id = 'checkin-alert';
    ciAlert.className = 'ci-alert';
    ciAlert.style.display = 'none';
    container.appendChild(ciAlert);
  }

  container.appendChild(summary);
```

Note : `isActive` est déjà calculé dans `buildWeekView` (ligne `const isActive = weekNum === getCalendarActiveWeekNum();`). Réutilise cette variable, ne la recalcule pas.

Après ce changement, appelle `buildCheckinWidget()` et `renderCheckinCurve()` à la fin de l'appel `buildWeekView` depuis le boot. Localise dans la séquence de boot :
```js
buildLoadChart();
```
Remplace par :
```js
buildLoadChart();
renderCheckinCurve();
```

Et dans `buildWeekView`, ajoute à la toute fin de la fonction (juste avant la dernière `}`) :
```js
  if (isActive) {
    buildCheckinWidget();
    renderCheckinCurve();
  }
```

#### 3e. Injecter le mini-panel courbe dans le DOM fixe

Localise dans le HTML fixe le div `id="load-chart-svg"` ou son conteneur parent. Après le conteneur du graphe de charge (le div qui contient l'SVG), ajoute dans le HTML source :

```html
<div id="checkin-curve-panel" class="ci-curve-panel" style="display:none"></div>
```

Affiche ce panel uniquement quand il y a des données. Dans `renderCheckinCurve()`, ajoute en début de fonction, après le calcul de `points` :

```js
  var curvePanelEl = document.getElementById('checkin-curve-panel');
  if (curvePanelEl) curvePanelEl.style.display = (points.length >= 2) ? 'block' : 'none';
```

#### 3f. Ajouter l'état de toast `'checkin-saved'` dans `showToast()`

Dans `function showToast(state)`, ajoute la branche suivante juste avant le `else` final, après la branche `'adapted'` ajoutée en 2c :

```js
  else if (state === 'checkin-saved') { t.textContent = '✓ Check-in enregistré'; t.style.background = 'var(--green)'; }
```

#### 3g. Ajouter le CSS du Lot 3

Ajoute le bloc suivant immédiatement avant `</style>`, après le bloc CSS du Lot 2 :

```css
/* ─── LOT 3 — CHECK-IN MATINAL ─── */
.ci-container {
  background: rgba(250,204,21,0.04);
  border: 1px solid rgba(250,204,21,0.2);
  border-radius: 10px;
  padding: 12px 14px;
  margin: 10px 0;
}
.ci-form-title, .ci-summary-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #facc15;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.ci-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--text);
  margin-bottom: 8px;
  min-height: 44px;
}
.ci-slider {
  flex: 1;
  accent-color: #facc15;
  height: 6px;
  cursor: pointer;
}
.ci-submit-btn {
  display: block;
  width: 100%;
  min-height: 44px;
  background: rgba(250,204,21,0.12);
  border: 1px solid rgba(250,204,21,0.4);
  border-radius: 8px;
  color: #facc15;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.15s;
}
.ci-submit-btn:active { background: rgba(250,204,21,0.25); }
.ci-summary-scores {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
}
.ci-score {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--text);
}
.ci-avg {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #facc15;
}
.ci-edit-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  cursor: pointer;
  padding: 4px 10px;
  min-height: 44px;
}
.ci-alert {
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.3);
  border-radius: 8px;
  color: #f87171;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  padding: 10px 14px;
  margin: 6px 0 10px;
}
.ci-curve-panel {
  margin: 6px 0 12px;
  min-height: 60px;
}
```

---

### Lot 4 — Guide « séance sautée »

#### 4a. Ajouter `openMissedSessionSheet()` et `closeMissedSessionSheet()`

Localise `function buildSessionDetailHtml(session, disciplineKey)` (~L3704). Insère immédiatement AVANT cette fonction les fonctions suivantes. Vérifie qu'aucune déclaration `openMissedSessionSheet`, `closeMissedSessionSheet`, ou `buildMissedSessionSheet` n'existe.

```js
var MISSED_ADVICE = {
  'fatigue-1':  'Reporter à J+1 à 85% du volume, intensité maintenue. Pas de compensation après.',
  'fatigue-2':  'Récupérer d'abord. Reprendre à la prochaine séance prévue sans rattraper.',
  'fatigue-3':  'Récupérer d'abord. Reprendre à la prochaine séance prévue sans rattraper.',
  'imprevu-1':  'Reporter demain si possible. Sinon laisser tomber sans compensation.',
  'imprevu-2':  'Laisser tomber. Le programme le gère.',
  'imprevu-3':  'Laisser tomber. Le programme le gère.',
  'douleur-1':  'Stop. Consulte avant de reprendre quelle que soit la situation.',
  'douleur-2':  'Stop. Consulte avant de reprendre quelle que soit la situation.',
  'douleur-3':  'Stop. Consulte avant de reprendre quelle que soit la situation.',
  'meteo-1':    'Adapter ou reporter si sécurité en jeu. Sinon remplacer par séance indoor équivalente.',
  'meteo-2':    'Adapter ou reporter si sécurité en jeu. Sinon remplacer par séance indoor équivalente.',
  'meteo-3':    'Adapter ou reporter si sécurité en jeu. Sinon remplacer par séance indoor équivalente.',
};
var MISSED_TAPER_NOTE = 'En affûtage : laisser tomber. Ne jamais compenser à moins de 14j de la course.';

function buildMissedSessionSheet() {
  var raison = document.querySelector('#missed-sheet input[name="missed-raison"]:checked');
  var delai  = document.querySelector('#missed-sheet input[name="missed-delai"]:checked');
  var raisonVal = raison ? raison.value : null;
  var delaiVal  = delai  ? delai.value  : null;
  var advEl = document.getElementById('missed-advice-text');
  if (!advEl) return;
  if (!raisonVal || !delaiVal) {
    advEl.textContent = 'Sélectionne une raison et un délai pour voir la recommandation.';
    advEl.style.display = 'block';
    return;
  }
  var key = raisonVal + '-' + delaiVal;
  var advice = MISSED_ADVICE[key] || 'Évalue la situation et reprends selon tes sensations.';
  // Semaine d'affûtage (S6) ou semaine course (S7) — ajoute la note taper sauf si douleur
  var activeWeek = getCalendarActiveWeekNum();
  if ((activeWeek === 6 || activeWeek === 7) && raisonVal !== 'douleur') {
    advice += ' ' + MISSED_TAPER_NOTE;
  }
  advEl.textContent = advice;
  advEl.style.display = 'block';
}

function openMissedSessionSheet() {
  var backdrop = document.getElementById('missed-session-backdrop');
  var sheet    = document.getElementById('missed-sheet');
  if (!backdrop || !sheet) return;
  // Reset les sélections et le conseil à chaque ouverture
  sheet.querySelectorAll('input[type=radio]').forEach(function(r) { r.checked = false; });
  var advEl = document.getElementById('missed-advice-text');
  if (advEl) { advEl.textContent = ''; advEl.style.display = 'none'; }
  backdrop.style.display = 'block';
  sheet.style.display    = 'block';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { sheet.classList.add('open'); });
  });
}

function closeMissedSessionSheet() {
  var sheet    = document.getElementById('missed-sheet');
  var backdrop = document.getElementById('missed-session-backdrop');
  if (!sheet) return;
  sheet.classList.remove('open');
  setTimeout(function() {
    sheet.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
  }, 350);
}
```

#### 4b. Modifier `buildSessionDetailHtml` pour ajouter le lien discret

Localise `function buildSessionDetailHtml(session, disciplineKey)` (~L3704). Remplace le corps **complet** de cette fonction par :

```js
function buildSessionDetailHtml(session, disciplineKey) {
  const isDone    = !!completed[session.id];
  const isSkipped = !!skipped[session.id];
  const isAdapted = isOpenWaterSession(session.id) && !!adapted[session.id];
  const canShowMissed = !isDone && !isSkipped && !isAdapted;
  const missedLink = canShowMissed
    ? `<div class="missed-link-row"><button class="missed-link-btn" onclick="event.stopPropagation(); openMissedSessionSheet()">Séance impossible ?</button></div>`
    : '';
  return `
    <div class="session-detail" id="week-detail-${session.id}">
      ${buildSessionSetsHtml(session, disciplineKey)}
      ${session.tip ? `<div class="session-tip-box"><strong>💡 Conseil :</strong> ${session.tip}</div>` : ''}
      ${buildNutritionBannerHtml(session, disciplineKey)}
      ${buildSessionResultHtml(session)}
      ${buildSessionNoteHtml(session.id)}
      ${missedLink}
    </div>
  `;
}
```

Note : le bouton « Séance impossible ? » est un lien discret. Il n'a pas de tap target 44px minimum (requis explicitement dans le brief). Styliser comme texte petit, couleur muted.

#### 4c. Injecter le DOM de la bottom sheet « séance sautée » au boot

Dans la séquence de boot, après `initHistorySheetSwipe();` (qui est déjà le premier appel après les injections DOM existantes), ajoute le bloc suivant. Vérifie qu'aucun élément `missed-sheet` n'existe déjà.

```js
// Injection bottom sheet guide séance sautée (Lot 4 v15)
document.body.insertAdjacentHTML('beforeend',
  '<div id="missed-session-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200" onclick="closeMissedSessionSheet()"></div>' +
  '<div id="missed-sheet" style="display:none">' +
    '<div class="mss-handle"></div>' +
    '<div class="mss-header">' +
      '<span class="mss-title">Séance impossible ?</span>' +
      '<button class="mss-close-btn" onclick="closeMissedSessionSheet()" aria-label="Fermer">&#x2715;</button>' +
    '</div>' +
    '<div class="mss-body">' +
      '<div class="mss-q">Raison</div>' +
      '<div class="mss-radios">' +
        '<label class="mss-radio-label"><input type="radio" name="missed-raison" value="fatigue" onchange="buildMissedSessionSheet()"> Fatigue</label>' +
        '<label class="mss-radio-label"><input type="radio" name="missed-raison" value="imprevu" onchange="buildMissedSessionSheet()"> Imprévu</label>' +
        '<label class="mss-radio-label"><input type="radio" name="missed-raison" value="douleur" onchange="buildMissedSessionSheet()"> Douleur</label>' +
        '<label class="mss-radio-label"><input type="radio" name="missed-raison" value="meteo" onchange="buildMissedSessionSheet()"> Météo</label>' +
      '</div>' +
      '<div class="mss-q">Jours avant prochaine séance intense</div>' +
      '<div class="mss-radios">' +
        '<label class="mss-radio-label"><input type="radio" name="missed-delai" value="1" onchange="buildMissedSessionSheet()"> 1 jour</label>' +
        '<label class="mss-radio-label"><input type="radio" name="missed-delai" value="2" onchange="buildMissedSessionSheet()"> 2 jours</label>' +
        '<label class="mss-radio-label"><input type="radio" name="missed-delai" value="3" onchange="buildMissedSessionSheet()"> 3 jours ou +</label>' +
      '</div>' +
      '<div id="missed-advice-text" class="mss-advice" style="display:none"></div>' +
    '</div>' +
  '</div>'
);
```

#### 4d. Ajouter le CSS du Lot 4

Ajoute le bloc suivant immédiatement avant `</style>`, après le bloc CSS du Lot 3 :

```css
/* ─── LOT 4 — GUIDE SÉANCE SAUTÉE ─── */
#missed-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  max-height: 80vh;
  background: #0e1117;
  border-radius: 18px 18px 0 0;
  z-index: 210;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32,0.72,0,1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#missed-sheet.open { transform: translateY(0); }
.mss-handle {
  width: 36px; height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 99px;
  margin: 10px auto 0;
  flex-shrink: 0;
}
.mss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.mss-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--muted);
}
.mss-close-btn {
  background: transparent; border: none; color: var(--muted);
  font-size: 18px; cursor: pointer; padding: 4px 8px;
  min-height: 44px; min-width: 44px;
}
.mss-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px 16px 32px;
  flex: 1;
}
.mss-q {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 14px;
}
.mss-q:first-child { margin-top: 0; }
.mss-radios {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}
.mss-radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: var(--text);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  min-height: 44px;
  transition: background 0.12s, border-color 0.12s;
}
.mss-radio-label:has(input:checked) {
  background: rgba(56,189,248,0.1);
  border-color: rgba(56,189,248,0.4);
  color: var(--accent);
}
.mss-radio-label input[type=radio] {
  accent-color: var(--accent);
  width: 16px; height: 16px;
}
.mss-advice {
  background: rgba(56,189,248,0.06);
  border: 1px solid rgba(56,189,248,0.2);
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: var(--text);
  line-height: 1.55;
  padding: 14px 16px;
  margin-top: 18px;
}
/* Lien discret « Séance impossible ? » dans le détail de séance */
.missed-link-row {
  margin-top: 14px;
  text-align: right;
}
.missed-link-btn {
  background: transparent;
  border: none;
  color: var(--muted2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  cursor: pointer;
  padding: 2px 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.missed-link-btn:hover { color: var(--muted); }
```

---

### Lot 5 — Bump de version (à faire EN DERNIER, après validation de tous les lots)

**Dans `index.html`** (~L1931) : remplace `<small class="app-version">v14</small>` par `<small class="app-version">v15</small>`.

**Dans `sw.js`** (ligne 1) : remplace `const CACHE = 'hiplan-v14';` par `const CACHE = 'hiplan-v15';`.

---

## Ce qu'il ne faut PAS faire

- **Ne pas re-déclarer** `const` ou `let` pour des variables ou fonctions déjà déclarées. Effectuer une recherche textuelle avant chaque ajout. Variables à risque : `RACE_WEEK`, `TOTAL_WEEKS`, `getRaceDate`, `safeWrite`, `getDiscipline`, `DISCIPLINE_CONFIG`, `RACE_CHECKLIST`, `RACE_DAY_DATA`, `NUTRITION_PROTOCOLS`, `buildRaceChecklistCard`, `buildNutritionBannerHtml`, `openRaceDaySheet`, `closeRaceDaySheet`, `goToNextSession`.
- **Ne pas modifier** les valeurs de chaîne des clés dans `STORE` — cela casse les données utilisateur existantes.
- **Ne pas modifier** `buildLoadChart()` — la courbe de forme est dans un mini-panel séparé (`#checkin-curve-panel`), pas dans le SVG existant.
- **Ne pas modifier** `buildRaceChecklistCard()`, `toggleRaceChecklistItem()`, `buildRaceDaySheetContent()`, `openRaceDaySheet()`, `closeRaceDaySheet()`, `buildNutritionBannerHtml()` — ces fonctions ne sont pas dans le périmètre de ce sprint.
- **Ne pas modifier** `buildSessionSetsHtml()` — signature et corps inchangés.
- **Ne pas afficher** le widget check-in sur les semaines ≠ semaine active. La condition `if (isActive)` dans `buildWeekView` est stricte.
- **Ne pas afficher** le bouton « Adapté » ni le badge ADAPTÉ sur des séances qui ne sont pas dans `OPEN_WATER_IDS` (`sw1c`, `sw4c`, `sw7a`).
- **Ne pas compter** les séances `adapted` comme skippées. Elles comptent comme faites dans `updateStats()` et disparaissent de `buildRemainingSessionsPanel()`.
- **Ne pas utiliser** `localStorage.setItem` directement dans le code des Lots 1, 2, 3 — passer par `safeWrite()` à chaque écriture.
- **Ne pas ajouter** de hauteur au header. Le bouton `#outdoor-toggle-btn` est en `position: absolute` et ne modifie pas le flux du `.logo-block`.
- **Ne pas bumper** `v14` → `v15` avant d'avoir validé tous les lots.
- **Ne pas modifier** `wvToggleDone()`, `wvToggleSkip()`, `save()`, `takeSnapshot()`, `importData()`, `exportData()`, `validatePlan()`, `buildRemainingSessionsPanel()` — ces fonctions ne sont pas dans le périmètre sauf les modifications ponctuelles explicitement décrites dans le Lot 2.
- **Ne pas ajouter** de fichiers supplémentaires (ni CSS séparé, ni JS séparé). Tout va dans `index.html`, sauf le bump de `sw.js`.
- **Ne pas utiliser** de framework, bibliothèque externe, ou import ES module.
- **Ne pas persister** les recommandations du Lot 4 — la bottom sheet est purement consultative, aucune écriture localStorage.

---

## Format de sortie attendu

- Modifie `index.html` en place.
- Modifie `sw.js` (ligne 1 uniquement) en place.
- Ne crée aucun fichier supplémentaire.
- Vérifie mentalement que `validatePlan()` ne génère pas de warning (le plan `weeklyPlan` n'est pas modifié).
- Effectue une vérification de non-régression des identifiants globaux listés dans « NE PAS RE-DÉCLARER ».

---

## Scénarios QA par lot

### Lot 1 — Mode plein soleil

**QA-1-A — Toggle ON :**
Ouvrir l'app sur 390 px. Tapper le bouton ☽ dans le coin supérieur droit du header. Vérifier : (1) le bouton passe à ☀ avec fond jaune atténué, (2) les badges de discipline sur les session cards passent à 12px (mesurez en DevTools), (3) les titres de séances en dessous de 14px sont agrandis, (4) les éléments de texte `--muted` sont plus clairs.

**QA-1-B — Persistance après reload :**
Activer le mode outdoor, recharger. L'app recharge avec `.outdoor-mode` sur `<body>`, le bouton ☀ actif, et `localStorage.getItem('hi_tri_outdoor_v1') === 'true'`.

**QA-1-C — Toggle OFF :**
Avec le mode outdoor actif, tapper à nouveau le bouton. Les styles reviennent aux valeurs par défaut. `localStorage.getItem('hi_tri_outdoor_v1') === 'false'`.

**QA-1-D — Non-régression layout header :**
En mode NUI et en mode SOL, la hauteur du header reste identique. `#outdoor-toggle-btn` n'est pas dans le flux du `.logo-block`.

**QA-1-E — Non-régression typographie :**
En mode SOL, les éléments déjà à 14px ou plus (ex : titres Bebas Neue, chiffres JetBrains Mono 24px dans la fiche course) ne changent pas de taille.

---

### Lot 2 — État « Adapté »

**QA-2-A — Bouton visible sur séances eau libre uniquement :**
Naviguer en semaine 1. Ouvrir la card `sw1c`. Les boutons d'action affichent « ✓ Fait », « ⏭ Skip », **et** « ~ Adapté ». Ouvrir n'importe quelle autre séance (ex : `sw1a`, `bw1a`, `rw1a`). Le bouton « Adapté » est absent.

**QA-2-B — Marquage « Adapté » :**
Sur `sw1c`, tapper « ~ Adapté ». Vérifier : (1) toast orange « Séance marquée Adapté » apparaît, (2) la card affiche le badge orange « ADAPTÉ » dans le titre, (3) la card a la classe `wc-adapted` (bordure orange à gauche), (4) les boutons d'action affichent désormais « ↩ Désadapter » uniquement.

**QA-2-C — Comptabilité dans les stats :**
Après avoir marqué `sw1c` comme adapté, vérifier dans la barre de stats que le compteur « Séances faites » augmente de 1. Vérifier que `sw1c` n'apparaît plus dans le panel « À faire cette semaine ».

**QA-2-D — Annulation de l'état adapté :**
Sur `sw1c` avec état adapté actif, tapper « ↩ Désadapter ». La card revient à l'état neutre (boutons Fait / Skip / Adapté). Le badge ADAPTÉ disparaît. Le compteur de stats diminue.

**QA-2-E — Mutuelle exclusivité avec Fait et Skip :**
Marquer `sw1c` comme Adapté, puis tapper « ✓ Fait ». L'état passe à Fait (`wc-done`), le badge ADAPTÉ disparaît. Vérifier `localStorage.getItem('hi_tri_adapted_v1')` — la clé `sw1c` doit être absente ou `false`.

**QA-2-F — Persistance après reload :**
Marquer `sw4c` comme Adapté. Recharger. Naviguer en semaine 4. `sw4c` affiche le badge ADAPTÉ et le bouton « ↩ Désadapter ».

---

### Lot 3 — Check-in matinal

**QA-3-A — Affichage semaine active uniquement :**
Naviguer vers la semaine active. Le widget check-in apparaît entre la nav bar et la summary bar. Naviguer vers une autre semaine (ex : S1). Le widget est absent.

**QA-3-B — Formulaire et validation :**
Dans le widget (formulaire affiché car pas de check-in aujourd'hui), déplacer les 3 sliders. Les valeurs s'affichent en temps réel (`ci-val-sleep`, `ci-val-legs`, `ci-val-energy`). Tapper « Valider le check-in ». Toast vert « Check-in enregistré ». Le widget bascule sur le résumé avec les 3 scores et la moyenne.

**QA-3-C — Modification du check-in du jour :**
Un check-in ayant été enregistré aujourd'hui, le widget affiche le résumé. Tapper « Modifier ». Le formulaire réapparaît avec les valeurs précédemment enregistrées pré-remplies.

**QA-3-D — Persistance après reload :**
Enregistrer un check-in. Recharger. Naviguer en semaine active. Le widget affiche le résumé (scores du jour), pas le formulaire.

**QA-3-E — Courbe de forme (avec données) :**
Enregistrer des check-ins sur 3 jours ou plus (simuler en injectant `checkinData` directement dans `localStorage`). La div `#checkin-curve-panel` est visible sous le graphe de charge et affiche une courbe SVG en pointillé jaune.

**QA-3-F — Alerte fatigue en S3/S4 :**
En semaine active 3 ou 4, injecter dans `checkinData` deux jours consécutifs avec `sleep=2, legs=2, energy=2` (moyenne = 2.0 < 2.5). Recharger. Le div `#checkin-alert` est visible avec le message d'avertissement rouge.

**QA-3-G — Pas d'alerte en S1/S2/S5/S6/S7 :**
Même données de fatigue élevée, mais en semaine active 1 ou 5. Aucun `#checkin-alert` visible.

**QA-3-H — Non-régression graphe de charge :**
Le graphe SVG `load-chart-svg` s'affiche normalement, les barres et la courbe VÉCU sont inchangées. Aucun contenu du Lot 3 ne se trouve à l'intérieur de ce SVG.

---

### Lot 4 — Guide « séance sautée »

**QA-4-A — Lien visible uniquement sur séances non complétées :**
Ouvrir le détail d'une séance non faite, non skippée, non adaptée. Le lien « Séance impossible ? » est visible en bas du détail (texte petit, couleur muted, aligné à droite). Marquer la séance comme Fait puis rouvrir son détail : le lien a disparu.

**QA-4-B — Ouverture de la bottom sheet :**
Tapper « Séance impossible ? ». La bottom sheet s'ouvre avec animation (translateY). Les 4 boutons radio raison et les 3 boutons radio délai sont visibles. Aucun conseil n'est encore affiché.

**QA-4-C — Recommandation Fatigue + 1 jour :**
Sélectionner « Fatigue » et « 1 jour ». Le div `#missed-advice-text` apparaît avec : « Reporter à J+1 à 85% du volume, intensité maintenue. Pas de compensation après. »

**QA-4-D — Recommandation Douleur (toutes durées) :**
Sélectionner « Douleur » et n'importe quel délai (1, 2 ou 3+). La recommandation est toujours : « Stop. Consulte avant de reprendre quelle que soit la situation. »

**QA-4-E — Note affûtage en S6/S7 (raison ≠ douleur) :**
Simuler semaine active 6 ou 7. Sélectionner « Fatigue » + « 2 jours ». La recommandation inclut la phrase : « En affûtage : laisser tomber. Ne jamais compenser à moins de 14j de la course. »

**QA-4-F — Fermeture :**
Tapper la croix de fermeture → sheet se ferme avec animation. Tapper le backdrop → idem. Aucune erreur JS.

**QA-4-G — Reset entre deux ouvertures :**
Ouvrir la sheet, sélectionner une raison, fermer. Rouvrir sur une autre séance. Les radios sont désélectionnés, le conseil est caché.

---

### Vérifications transversales

**TX-1 — Zéro erreur console :**
Après rechargement complet, la console ne contient aucun `Uncaught`, aucun `TypeError`, aucun `[validatePlan]` warning.

**TX-2 — Bump version :**
Le header affiche `v15`. `sw.js` ligne 1 : `const CACHE = 'hiplan-v15';`.

**TX-3 — Non-régression générale :**
- La vue semaine s'affiche, la navigation S1–S7 fonctionne.
- Les boutons « ✓ Fait », « ⏭ Skip », « ↩ Unskip », « ✕ Annuler » fonctionnent normalement sur toutes les séances.
- La perf-sheet s'ouvre et se ferme normalement.
- Le weekly recap s'ouvre et se ferme normalement.
- Le panel snapshots (bouton « Sauvegardes ») s'ouvre normalement.
- L'export JSON fonctionne.
- Le panel « À faire cette semaine » affiche les séances restantes avec le badge « PROCHAIN » sur la première.
- Le countdown dans le header se met à jour après modification de la date de fin.
- La checklist course (S7) s'affiche et ses ticks persistent.
- La fiche course s'ouvre depuis le bouton header et depuis le bouton « Fiche course » de la checklist S7.
- Le bandeau nutrition s'affiche sur les séances vélo longues qualifiantes.

### Convention de commit

```
feat: v15 — mode soleil, état adapté eau libre, check-in forme, guide séance sautée
```
