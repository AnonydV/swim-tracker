# Sprint « Pack Fiabilité Jour J » — HIPLAN v12

---

## Contexte technique

### Fichier cible

Deux fichiers à modifier :

- **`index.html`** à la racine du projet (~4650 lignes, actuellement `v11`). Ce fichier contient l'intégralité du HTML, du CSS (dans `<style>`) et du JavaScript (dans `<script>`). Il ne doit pas être découpé en fichiers supplémentaires.
- **`sw.js`** (à la racine, ligne 1 : `const CACHE = 'hiplan-v11';`). Modifié uniquement pour le bump de version en fin de sprint.

Contraintes absolues :
- Vanilla JS uniquement. Zéro framework, zéro bibliothèque externe, zéro import ES module.
- Aucun fichier supplémentaire sauf `sw.js` (déjà existant).
- Aucune dépendance npm, pas de build step.
- Mobile-first, touch targets minimum 44 px, viewport cible 390 px.

### Cartographie des zones pertinentes dans `index.html`

Lis chaque zone avant modification pour confirmer les numéros de ligne — ils peuvent avoir légèrement dérivé.

**STORE (~L2391) :**
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

**`loadStoredState` (~L2403) :**
```js
function loadStoredState(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    localStorage.removeItem(key);
    return {};
  }
}
```

**Variables globales déclarées (~L2413-2417) :**
```js
let completed    = loadStoredState(STORE.completed);
let skipped      = loadStoredState(STORE.skipped);
let sessionNotes = loadStoredState(STORE.notes);
let sessionResults = loadStoredState(STORE.results);
let perfResults  = loadStoredState(STORE.perfResults);
```

**`save()` (~L2419) :**
```js
function save() {
  localStorage.setItem(STORE.completed,   JSON.stringify(completed));
  localStorage.setItem(STORE.skipped,     JSON.stringify(skipped));
  localStorage.setItem(STORE.notes,       JSON.stringify(sessionNotes));
  localStorage.setItem(STORE.results,     JSON.stringify(sessionResults));
  localStorage.setItem(STORE.perfResults, JSON.stringify(perfResults));
}
```

**Constantes BUILD UI (~L2435-2437) :**
```js
let currentSport = 'week';
let currentWeekView = null;
const TOTAL_WEEKS = 10;
```

**Helpers de dates existants (~L2473-2551) :**
- `addDays(date, days)` — retourne une nouvelle Date
- `parseIsoLocalDate(value)` — parse 'YYYY-MM-DD' → Date locale
- `toIsoLocalDate(date)` — sérialise Date → 'YYYY-MM-DD'
- `getProgramEndDate()` — lit `STORE.programEnd`, retourne Date ou null (migration legacy incluse)
- `getProgramStartDate()` — retourne `addDays(programEnd, -((TOTAL_WEEKS * 7) - 1))`
- `startOfToday()` — retourne minuit local aujourd'hui
- `getCalendarActiveWeekNum()` — retourne l'entier 1–10 de la semaine active

**`updateHeaderSubtitle()` (~L2581-2610) :** calcule actuellement `diffDays` vers `programEnd` (sept.) → BUG à corriger (Lot 1).

**`refreshCalendarViews()` (~L2612-2619) :**
```js
function refreshCalendarViews() {
  renderProgramEndControl();
  currentWeekView = getCalendarActiveWeekNum();
  buildWeekView(currentWeekView);
  updateStats();
  buildLoadChart();
  updateHeaderSubtitle();
}
```

**`getWeekPhase(weekNum)` (~L2930) :**
```js
function getWeekPhase(weekNum) {
  return WEEK_PHASES.find(phase => phase.weeks.includes(weekNum)) || WEEK_PHASES[0];
}
```
`WEEK_PHASES` actuel (v11, plan 10 semaines) :
```js
const WEEK_PHASES = [
  { phase: 1, name: 'BASE AÉROBIE',      weeks: [1, 2] },
  { phase: 2, name: 'CONSTRUCTION 70.3', weeks: [3, 4] },
  { phase: 3, name: 'AFFÛTAGE & RACE',   weeks: [5, 6, 7] },
  { phase: 4, name: 'RÉCUPÉRATION',      weeks: [8, 9, 10] },
];
```

**`buildRemainingSessionsPanel()` (~L3144-3188) :** construit les lignes de séances restantes de la semaine active.

**`openWeekSessionDetail(id)` (~L3231) et `toggleWeekSessionDetail(id)` (~L3237) :** ouvrent/basculent le détail d'une card semaine.

**`showToast(state)` (~L3642) :** affiche un toast temporaire. États existants (ne pas redéclarer) :
`true`, `false`, `'skip'`, `'unskip'`, `'date-saved'`, `'date-error'`, `'note-saved'`, `'notes-copied'`, `'notes-empty'`, `'notes-error'`, `'import-ok'`, `'import-error'`, `'import-version'`, `'result-saved'`, `'perf-saved'`, `'perf-skipped'`, `'snapshot-restored'`, `'snapshot-none'`.

**Infrastructure snapshots (P3) :**
- `collectStateSnapshot()` (~L3426) — retourne l'état courant sérialisable
- `takeSnapshot()` (~L3450) — pousse dans l'anneau de 3 entrées (clé `STORE.snapshots`), a déjà son propre `try/catch QuotaExceededError` interne
- `takeSnapshotIfNeeded()` (~L3465) — appelle `takeSnapshot()` si pas encore fait aujourd'hui
- `formatSnapshotDate(ts)` (~L3517) — formate un timestamp en date FR lisible
- `openSnapshotModal(idx)` (~L3570) — ouvre la modal de confirmation de restauration pour l'entrée `idx` de l'anneau
- `restoreSnapshot(idx)` (~L3593) — prend un snapshot de sécurité, restaure, recharge la page
- DOM injectés au boot : `#snapshots-backdrop`, `#snapshots-panel`, `#snapshot-confirm-backdrop`, `#snapshot-confirm-modal`, `#snapshotModalBody`, `#snapshotConfirmBtn`

**Bloc `serviceWorker.register` (~L4639-4647) :**
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    const stale = regs.filter(r => !r.active || r.active.scriptURL.includes('sw.js') === false);
    stale.forEach(r => r.unregister());
  });
  navigator.serviceWorker.register('./sw.js')
    .catch(err => console.warn('SW non disponible :', err.message));
}
```

**Séquence de boot (fin de fichier, ~L4619-4632) :**
```js
initHistorySheetSwipe();

takeSnapshotIfNeeded();

renderProgramEndControl();
updateHeaderSubtitle();
document.fonts.ready.then(() => updateHeaderSubtitle());
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```

**Variables CSS du design system :**
```css
--accent: #38bdf8;          /* swim / générique */
--accent-dim: rgba(56,189,248,0.12);
--green: #4ade80;
--green-dim: rgba(74,222,128,0.12);
--orange: #fb923c;
--orange-dim: rgba(251,146,60,0.12);
--red: #f87171;
--muted: #5a7a99;
--muted2: #3a5570;
```
Polices : titres en `'Bebas Neue', sans-serif` · chiffres/mono en `'JetBrains Mono', monospace` · corps en `'DM Sans', sans-serif`.

### Variables globales — NE PAS RE-DÉCLARER

```
STORE, completed, skipped, sessionNotes, sessionResults, perfResults,
currentSport, currentWeekView, TOTAL_WEEKS, DISCIPLINE_CONFIG,
SESSION_TYPE_LABELS, WEEK_PHASES, RPE_COLORS, weeklyPlan
```

### Clés localStorage — NE JAMAIS MODIFIER LES CHAÎNES

```
'hi_swim_tracker_v3'       → completed
'hi_swim_skipped_v1'       → skipped
'hi_tri_session_notes_v1'  → sessionNotes
'hi_tri_session_results_v1'→ sessionResults
'hi_tri_perf_results_v1'   → perfResults
'hi_tri_program_end'       → programEnd (date de FIN du programme, S10)
'hi_tri_snapshots'         → anneau de 3 snapshots
```

---

## Raison des changements

Ce sprint « Pack Fiabilité Jour J » livre 5 lots correctifs et UX avant la course Vichy 70.3 du **23 août 2026** (semaine 7 d'un plan de 10 semaines, `programEnd = 2026-09-13`).

- **Lot 1 (BUG)** : le countdown pointe vers `programEnd` (13 sept.) au lieu de la date de course (23 août). Le matin de la course, l'app afficherait « J-21 » au lieu de « JOUR J ».
- **Lot 2** : `save()` écrit dans `localStorage` sans protection → en quota plein ou mode privé, l'action UI se casse silencieusement.
- **Lot 3** : les corruptions de données perdent l'historique sans feedback → l'utilisateur ne sait pas qu'un snapshot propre existe.
- **Lot 4** : les mises à jour du SW sont silencieuses → l'utilisateur ne sait pas quand une nouvelle version est disponible.
- **Lot 5** : le panel « À faire cette semaine » liste les séances mais n'aide pas à naviguer directement vers la première à faire.

---

## Ce qu'il faut implémenter

### Lot 1 — Fix countdown raceDate (BUG — priorité 1)

#### 1a. Ajouter la constante `RACE_WEEK`

Localise `const TOTAL_WEEKS = 10;` (~L2437). Ajoute la ligne suivante immédiatement après :

```js
const RACE_WEEK = 7; // Semaine de la course (Vichy 70.3) dans le plan
```

Vérifie qu'aucune déclaration `RACE_WEEK` n'existe déjà dans le fichier avant d'ajouter cette ligne.

#### 1b. Ajouter `getRaceDate()`

Localise `function getProgramEndDate()` (~L2493). Repère sa fermeture (`}`, ~L2502). Insère la fonction suivante **immédiatement après** la fermeture de `getProgramEndDate()` et **avant** `function getProgramStartDate()` :

```js
function getRaceDate() {
  const programEnd = getProgramEndDate();
  if (!programEnd) return null;
  // La course est le dernier jour de RACE_WEEK.
  // programEnd est le dernier jour de TOTAL_WEEKS.
  // Offset = (TOTAL_WEEKS - RACE_WEEK) semaines en arrière.
  return addDays(programEnd, -(TOTAL_WEEKS - RACE_WEEK) * 7);
}
```

Vérifie qu'aucune fonction nommée `getRaceDate` n'existe déjà dans le fichier avant de l'ajouter.

#### 1c. Modifier `updateHeaderSubtitle()`

Localise `function updateHeaderSubtitle()` (~L2581). Remplace **l'intégralité du corps** de cette fonction par la version ci-dessous. Ne modifie pas la signature ni la déclaration `function updateHeaderSubtitle()`.

Avant (corps actuel, résumé) :
```js
  const programEnd = getProgramEndDate();
  if (!programEnd) { ... }
  const programEndDay = new Date(programEnd.getFullYear(), programEnd.getMonth(), programEnd.getDate());
  const diffDays = Math.round((programEndDay - startOfToday()) / 86_400_000);
  ...
  if (diffDays < 0) {
    el.textContent = '// COURSE TERMINÉE';
    return;
  }
```

Après (corps complet à substituer) :
```js
  const el = document.getElementById('header-subtitle');
  if (!el) return;
  const raceDate = getRaceDate();
  if (!raceDate) {
    el.textContent = '// Mon plan d\'entrainement';
    return;
  }
  const raceDateDay = new Date(raceDate.getFullYear(), raceDate.getMonth(), raceDate.getDate());
  const diffDays = Math.round((raceDateDay - startOfToday()) / 86_400_000);
  const activeWeek = getCalendarActiveWeekNum();
  const phase = getWeekPhase(activeWeek);

  let full, compact;
  if (diffDays < 0) {
    // Course terminée — afficher la phase en cours (récupération) sans countdown négatif
    full    = '// ' + phase.name + ' · SEMAINE ' + activeWeek + '/' + TOTAL_WEEKS;
    compact = '// ' + phase.name + ' · S' + activeWeek + '/' + TOTAL_WEEKS;
  } else if (diffDays === 0) {
    full    = '// JOUR J · ' + phase.name + ' · SEMAINE ' + activeWeek + '/' + TOTAL_WEEKS;
    compact = '// JOUR J · ' + phase.name + ' · S' + activeWeek + '/' + TOTAL_WEEKS;
  } else {
    full    = '// J-' + diffDays + ' · ' + phase.name + ' · SEMAINE ' + activeWeek + '/' + TOTAL_WEEKS;
    compact = '// J-' + diffDays + ' · ' + phase.name + ' · S' + activeWeek + '/' + TOTAL_WEEKS;
  }

  el.textContent = full;
  if (el.scrollWidth > el.clientWidth) {
    el.textContent = compact;
  }
```

`programEnd` (via `getProgramEndDate()`) continue d'être utilisé par le calendrier et `getCalendarActiveWeekNum()` — ne pas y toucher.

---

### Lot 2 — `safeWrite()` autour de `save()`

#### 2a. Ajouter les états de toast manquants dans `showToast()`

Localise `function showToast(state)` (~L3642). Dans la chaîne `else if`, ajoute la branche suivante **juste avant le `else` final** (le fallback `'↩ Skip annulé'`) :

```js
  else if (state === 'storage-quota') { t.textContent = 'Stockage plein — données non sauvegardées'; t.style.background = 'var(--red)'; }
```

#### 2b. Ajouter `safeWrite()` juste avant `save()`

Localise `function save()` (~L2419). Insère le helper suivant **immédiatement avant** la déclaration de `save()` :

```js
function safeWrite(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e && e.name === 'QuotaExceededError') {
      showToast('storage-quota');
    } else {
      console.warn('[HIPLAN] localStorage.setItem échoué :', key, e);
    }
    return false;
  }
}
```

Vérifie qu'aucune fonction nommée `safeWrite` n'existe déjà dans le fichier.

#### 2c. Modifier `save()` pour passer par `safeWrite()`

Remplace le corps de `function save()` par :

```js
function save() {
  safeWrite(STORE.completed,   JSON.stringify(completed));
  safeWrite(STORE.skipped,     JSON.stringify(skipped));
  safeWrite(STORE.notes,       JSON.stringify(sessionNotes));
  safeWrite(STORE.results,     JSON.stringify(sessionResults));
  safeWrite(STORE.perfResults, JSON.stringify(perfResults));
}
```

Ne modifie pas `takeSnapshot()` ni `importData()` — ils ont déjà leurs propres gardes `try/catch` internes.

---

### Lot 3 — Récupération auto après corruption

#### 3a. Ajouter le flag `_corruptionDetected`

Localise `function loadStoredState(key)` (~L2403). Insère la ligne suivante **immédiatement avant** la déclaration de cette fonction :

```js
let _corruptionDetected = false;
```

Vérifie qu'aucune variable `_corruptionDetected` n'existe déjà dans le fichier.

#### 3b. Modifier `loadStoredState()` pour lever le flag

Remplace le corps du bloc `catch` dans `loadStoredState` :

Avant :
```js
  } catch {
    localStorage.removeItem(key);
    return {};
  }
```

Après :
```js
  } catch {
    localStorage.removeItem(key);
    _corruptionDetected = true;
    return {};
  }
```

#### 3c. Modifier la séquence de boot pour la récupération conditionnelle

Dans le bloc d'init (~L4622), localise l'appel standalone :
```js
takeSnapshotIfNeeded();
```

Remplace cet appel **uniquement** par le bloc conditionnel suivant :

```js
if (_corruptionDetected) {
  var _bootRing = [];
  try { _bootRing = JSON.parse(localStorage.getItem(STORE.snapshots) || '[]'); } catch { _bootRing = []; }
  if (Array.isArray(_bootRing) && _bootRing.length > 0) {
    // Données corrompues ET snapshot disponible : proposer la restauration
    // Ne PAS appeler takeSnapshotIfNeeded() ici — cela écraserait le snapshot sain
    var _bodyEl = document.getElementById('snapshotModalBody');
    var _btnEl  = document.getElementById('snapshotConfirmBtn');
    if (_bodyEl && _btnEl) {
      _bodyEl.textContent = 'Données incomplètes détectées — restaurer la sauvegarde du ' + formatSnapshotDate(_bootRing[0].ts) + ' ?';
      _btnEl.onclick = function() { restoreSnapshot(0); };
      document.getElementById('snapshot-confirm-backdrop').style.display = 'block';
      document.getElementById('snapshot-confirm-modal').style.display    = 'flex';
    }
  } else {
    // Corruption mais aucun snapshot exploitable : continuer normalement
    takeSnapshotIfNeeded();
  }
} else {
  takeSnapshotIfNeeded();
}
```

Utilise `var` (pas `const`/`let`) pour les variables locales `_bootRing`, `_bodyEl`, `_btnEl` déclarées dans ce bloc de script inline pour éviter tout conflit de re-déclaration si le bloc est interprété plusieurs fois.

---

### Lot 4 — Toasts cycle de vie Service Worker

#### 4a. Ajouter les états de toast SW dans `showToast()`

Dans `function showToast(state)` (~L3642), ajoute les deux branches suivantes **juste avant le `else` final** (le fallback `'↩ Skip annulé'`), à la suite de la branche `'storage-quota'` ajoutée en Lot 2 :

```js
  else if (state === 'sw-update')  { t.textContent = 'Nouvelle version dispo — recharge la page'; t.style.background = 'var(--accent)'; }
  else if (state === 'sw-offline') { t.textContent = 'Disponible hors-ligne'; t.style.background = 'var(--green)'; }
```

#### 4b. Modifier le bloc `serviceWorker.register` (~L4645)

Remplace le bloc `navigator.serviceWorker.register('./sw.js').catch(...)` **uniquement** (sans toucher à la purge `getRegistrations` qui précède) par :

```js
  navigator.serviceWorker.register('./sw.js')
    .then(function(reg) {
      reg.addEventListener('updatefound', function() {
        var installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', function() {
          if (installing.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Mise à jour disponible (remplacement d'une version active)
              showToast('sw-update');
            } else {
              // Premier install réussi — app désormais disponible hors-ligne
              showToast('sw-offline');
            }
          }
        });
      });
    })
    .catch(function(err) { console.warn('SW non disponible :', err.message); });
```

Le bloc if (`'serviceWorker' in navigator`) et la purge `getRegistrations` restent inchangés.

---

### Lot 5 — UX-B1 : ligne « PROCHAIN » dans `buildRemainingSessionsPanel()`

#### 5a. Ajouter le CSS dans `<style>`

Ajoute le bloc suivant à la fin de la section `<style>`, immédiatement avant la balise de fermeture `</style>` :

```css
/* ─── RSW — LIGNE PROCHAIN ─── */
.rsw-row-next {
  background: rgba(56,189,248,0.07);
  border-radius: 6px;
  padding-left: 6px;
  padding-right: 6px;
  margin-left: -6px;
  margin-right: -6px;
}
.rsw-badge-next {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #38bdf8;
  background: rgba(56,189,248,0.15);
  border-radius: 99px;
  padding: 2px 8px;
  flex-shrink: 0;
  text-transform: uppercase;
  white-space: nowrap;
}
.rsw-next-btn {
  min-width: 44px;
  min-height: 44px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(56,189,248,0.45);
  background: transparent;
  color: #38bdf8;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  white-space: nowrap;
}
.rsw-next-btn:hover,
.rsw-next-btn:active { background: rgba(56,189,248,0.15); }
```

#### 5b. Ajouter `goToNextSession()` juste avant `buildRemainingSessionsPanel()`

Localise `function buildRemainingSessionsPanel()` (~L3144). Insère la fonction suivante **immédiatement avant** sa déclaration :

```js
function goToNextSession(id) {
  currentWeekView = getCalendarActiveWeekNum();
  buildWeekView(currentWeekView);
  requestAnimationFrame(function() {
    var card = document.getElementById('week-card-' + id);
    if (!card) return;
    openWeekSessionDetail(id);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
```

Vérifie qu'aucune fonction nommée `goToNextSession` n'existe déjà dans le fichier.

#### 5c. Modifier `buildRemainingSessionsPanel()` pour la ligne PROCHAIN

Localise le bloc `.map` dans `buildRemainingSessionsPanel()` (~L3170-3180) :

Avant :
```js
  const rows = remaining.map(({ session, disciplineKey }) => {
    const config = DISCIPLINE_CONFIG[disciplineKey];
    return `
      <div class="rsw-row">
        <span class="rsw-disc-dot" style="background:${config.accent}"></span>
        <span class="rsw-session-name">${getSessionDisplayName(session)}</span>
        <span class="wsc-badge ${disciplineKey}">${getDistLabel(session, disciplineKey)}</span>
        <button class="rsw-done-btn" onclick="currentWeekView=getCalendarActiveWeekNum();if(navigator.vibrate)navigator.vibrate(40);wvToggleDone('${session.id}')">✓ Fait</button>
      </div>
    `;
  }).join('');
```

Après (passe l'index `idx` au callback) :
```js
  const rows = remaining.map(function({ session, disciplineKey }, idx) {
    const config = DISCIPLINE_CONFIG[disciplineKey];
    const isNext = idx === 0;
    const rowClass = isNext ? 'rsw-row rsw-row-next' : 'rsw-row';
    const nextBadge = isNext
      ? '<span class="rsw-badge-next">PROCHAIN</span>'
      : '';
    const nextBtn = isNext
      ? '<button class="rsw-next-btn" onclick="goToNextSession(\'' + session.id + '\')" aria-label="Aller aux blocs de la prochaine séance">&#x2192; Blocs</button>'
      : '';
    return '<div class="' + rowClass + '">'
      + '<span class="rsw-disc-dot" style="background:' + config.accent + '"></span>'
      + nextBadge
      + '<span class="rsw-session-name">' + getSessionDisplayName(session) + '</span>'
      + '<span class="wsc-badge ' + disciplineKey + '">' + getDistLabel(session, disciplineKey) + '</span>'
      + '<button class="rsw-done-btn" onclick="currentWeekView=getCalendarActiveWeekNum();if(navigator.vibrate)navigator.vibrate(40);wvToggleDone(\'' + session.id + '\')">&#x2713; Fait</button>'
      + nextBtn
      + '</div>';
  }).join('');
```

Remarque : la syntaxe passe d'un template literal à une concaténation de chaînes pour éviter l'imbrication de backticks. Le comportement fonctionnel des lignes autres que la première (idx > 0) est **strictement identique** à l'original.

---

### Lot 6 — Bump de version (à faire EN DERNIER, après validation)

**Dans `index.html`** (~L1531) : remplace `<small class="app-version">v11</small>` par `<small class="app-version">v12</small>`.

**Dans `sw.js`** (ligne 1) : remplace `const CACHE = 'hiplan-v11';` par `const CACHE = 'hiplan-v12';`.

---

## Ce qu'il ne faut PAS faire

- **Ne pas re-déclarer** `const` ou `let` pour des variables déjà déclarées en scope global. Avant d'ajouter `RACE_WEEK`, `_corruptionDetected`, `safeWrite`, `goToNextSession`, `getRaceDate` : vérifier avec une recherche textuelle qu'aucun identifiant homonyme n'existe.
- **Ne pas modifier** les valeurs de chaîne des clés dans `STORE` (cela casse les données existantes des utilisateurs).
- **Ne pas modifier** `programEnd` ni `getProgramEndDate()` : ces fonctions restent la borne du calendrier et des semaines actives. Seul `updateHeaderSubtitle()` change sa cible de countdown.
- **Ne pas modifier** `takeSnapshot()` — il a déjà son propre `try/catch QuotaExceededError`. Le doubler avec `safeWrite` créerait une régression (double toast, logique incorrecte).
- **Ne pas modifier** `importData()` — elle appelle `takeSnapshot()` pour se protéger avant écrasement ; ne pas interférer.
- **Ne pas ajouter de fichiers supplémentaires** (ni CSS séparé, ni JS séparé, ni images). Tout va dans `index.html`, sauf le bump de `sw.js`.
- **Ne pas utiliser de framework**, bibliothèque externe, ou import ES module.
- **Ne pas dupliquer** les fonctions déclarées dans ce sprint : `safeWrite`, `getRaceDate`, `goToNextSession`, `_corruptionDetected` — une seule occurrence de chacune.
- **Ne pas utiliser de flèches `=>` dans les `addEventListener`** ajoutés dans le bloc SW (Lot 4) : utiliser `function` traditionnel, cohérent avec le reste du fichier.
- **Ne pas modifier** `getCalendarActiveWeekNum()`, `getProgramStartDate()`, `getCalendarActiveWeekNum()`, `validatePlan()`, `wvToggleDone()`, `wvToggleSkip()`, ni aucune fonction existante non listée dans « Ce qu'il faut implémenter ».
- **Ne pas bumper** le badge `v11` → `v12` ni le cache SW avant d'avoir validé tous les lots (le bump est la dernière étape).
- **Ne pas utiliser de nombres magiques** dans `getRaceDate()` : les seules valeurs littérales autorisées sont via les constantes `TOTAL_WEEKS` et `RACE_WEEK`.
- **Ne pas restaurer automatiquement** le snapshot sans confirmation explicite de l'utilisateur (Lot 3). La modal doit toujours être présentée ; aucune restauration silencieuse.

---

## Format de sortie attendu

- Modifie `index.html` en place.
- Modifie `sw.js` (ligne 1 uniquement) en place.
- Ne crée aucun fichier supplémentaire.
- Valide mentalement que `validatePlan()` ne génère pas de warning (le plan `weeklyPlan` n'est pas modifié).
- Effectue une vérification de non-régression des identifiants globaux (aucune re-déclaration).

---

## Plan de test par lot

### Lot 1 — Countdown raceDate

**T1-A — Avant la course :**
Dans la console : `localStorage.setItem('hi_tri_program_end', '2026-09-13');` puis recharge.
Attendu : le sous-titre du header affiche `// J-X · [PHASE] · SEMAINE [n]/10` où X = nombre de jours jusqu'au 23 août 2026 (pas jusqu'au 13 sept.).

**T1-B — Jour de la course (simulation) :**
Dans la console : remplace temporairement la clé pour que `getRaceDate()` renvoie aujourd'hui (utiliser `localStorage.setItem('hi_tri_program_end', toIsoLocalDate(addDays(new Date(), 21)))` si RACE_WEEK=7 et TOTAL_WEEKS=10, i.e. programEnd = aujourd'hui + 21 j). Recharge.
Attendu : `// JOUR J · [PHASE] · SEMAINE [n]/10`.

**T1-C — Après la course (phase récupération) :**
Dans la console : `localStorage.setItem('hi_tri_program_end', '2026-08-30');` (programEnd antérieur à aujourd'hui si on est après le 23 août, ou utiliser `'2025-01-01'` en test). Recharge.
Attendu : le sous-titre n'affiche **pas** de countdown négatif. Il affiche la phase en cours (ex : `// RÉCUPÉRATION · SEMAINE 10/10`) sans la mention `J-`.

**T1-D — Non-régression calendrier :**
Vérifier que `getCalendarActiveWeekNum()` et la navigation semaine fonctionnent normalement. Le changement de `updateHeaderSubtitle()` n'affecte pas le calcul de la semaine active.

---

### Lot 2 — `safeWrite()`

**T2-A — Fonctionnement normal :**
Valider une séance, skippper une séance. Les données persistent après rechargement. Aucun toast d'erreur inattendu.

**T2-B — Quota plein (simulation) :**
Dans la console, surcharger le localStorage jusqu'au quota (`localStorage.setItem('fill', 'x'.repeat(5e6))` plusieurs fois). Puis tenter de valider une séance.
Attendu : toast rouge « Stockage plein — données non sauvegardées » apparaît. Aucune erreur JS non capturée en console.

**T2-C — Non-régression snapshot :**
Déclencher manuellement `takeSnapshot()` via la console. Vérifier que la console ne reçoit pas de double toast quota et que le snapshot est écrit normalement (ou logué si plein).

---

### Lot 3 — Récupération après corruption

**T3-A — Corruption simulée :**
Dans la console : `localStorage.setItem('hi_swim_tracker_v3', '{invalid json{{');` puis recharge.
Attendu : la modal de confirmation de restauration s'ouvre automatiquement au boot avec le message « Données incomplètes détectées — restaurer la sauvegarde du [date] ? ». L'app continue de fonctionner (état partiel).

**T3-B — Confirmation restauration :**
Depuis l'état T3-A, cliquer « Restaurer ». Attendu : `restoreSnapshot(0)` s'exécute, la page se recharge avec les données du snapshot.

**T3-C — Annulation :**
Depuis l'état T3-A, fermer la modal (bouton annuler ou backdrop). Attendu : la modal se ferme, l'app continue avec l'état partiellement chargé. Aucun crash.

**T3-D — Corruption sans snapshot :**
Vider `localStorage.removeItem('hi_tri_snapshots')` ET corrompre une clé. Recharger.
Attendu : aucune modal ne s'ouvre (pas de snapshot à proposer). `takeSnapshotIfNeeded()` s'exécute normalement.

**T3-E — Pas de corruption :**
En état normal (données valides). Recharger.
Attendu : comportement inchangé, `takeSnapshotIfNeeded()` s'exécute normalement, aucune modal de corruption.

---

### Lot 4 — Toasts SW

**T4-A — Premier install :**
Effacer tous les SW enregistrés via DevTools > Application > Service Workers > Unregister. Recharger.
Attendu : toast vert « Disponible hors-ligne » apparaît après enregistrement.

**T4-B — Mise à jour disponible :**
Changer manuellement le CACHE dans `sw.js` (ex. `hiplan-v12b`), recharger avec un SW déjà actif.
Attendu : toast accent « Nouvelle version dispo — recharge la page » apparaît.

**T4-C — Non-régression :**
En usage normal (SW déjà actif, pas de mise à jour), recharger. Aucun toast SW inattendu.

---

### Lot 5 — Ligne PROCHAIN

**T5-A — Affichage :**
En semaine active avec au moins une séance restante, vérifier le panel « À faire cette semaine ».
Attendu : la première ligne a un fond bleu atténué, un badge « PROCHAIN » et un bouton « → Blocs ». Les autres lignes sont visuellement inchangées.

**T5-B — Bouton → Blocs :**
Cliquer (ou tapper) le bouton « → Blocs » sur la première ligne.
Attendu : la vue semaine se reconstruit sur la semaine active, la card de la séance s'ouvre (détail visible), et la page scrolle vers cette card. Aucune erreur JS.

**T5-C — Touch target :**
Sur un mobile 390 px (ou DevTools responsive), vérifier que le bouton « → Blocs » est tappable confortablement : `min-height: 44px`.

**T5-D — Semaine complète :**
Valider ou skipper toutes les séances de la semaine active. Le panel affiche « Semaine complète ✓ ». Aucune erreur (le cas `remaining.length === 0` retourne avant le `.map`).

**T5-E — Non-régression bouton Fait :**
Le bouton « ✓ Fait » de chaque ligne continue de déclencher `wvToggleDone` normalement. La vibration et la mise à jour du state sont préservées.

---

### Vérifications transversales

**TX-1 — Zéro erreur console :**
Après rechargement complet, la console ne doit contenir aucun `Uncaught`, aucun `TypeError`, aucun warning `[validatePlan]`.

**TX-2 — Bump version :**
Le header affiche `v12`. `sw.js` ligne 1 : `const CACHE = 'hiplan-v12';`.

**TX-3 — Non-régression générale :**
- La vue semaine s'affiche, la navigation semaine fonctionne.
- Les boutons « Fait », « Skip », « Annuler », « Unskip » fonctionnent.
- La perf-sheet s'ouvre et se ferme normalement.
- Le weekly recap s'ouvre et se ferme normalement.
- Le panel snapshots (bouton « Sauvegardes ») s'ouvre normalement.
- L'export JSON fonctionne.
- Le countdown dans le header se met à jour après modification de la date de fin.

### Convention de commit

```
feat: v12 — pack fiabilité (countdown course, safeWrite, récupération corruption, toasts SW, PROCHAIN)
```
