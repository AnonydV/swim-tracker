# Prompt Sprint N4 — HIPLAN Triathlon Tracker
# Feature : Historique par type de séance (bottom sheet)

---

## Contexte technique

### Projet

**HIPLAN** est un tracker d'entraînement triathlon personnel (usage solo, mobile-first, PWA, dark theme).

- **Fichier unique** : `index.html` (~4930 lignes) à la racine du projet. Modifie **uniquement ce fichier** et `sw.js`.
- **Stack** : Vanilla JS + HTML + CSS dans un seul fichier. Aucune dépendance externe, aucun framework, aucun build step.
- **Persistance** : `localStorage` exclusivement. Aucune modification des clés ou valeurs existantes.
- **Service Worker** : `sw.js` à la racine, ligne 1 : `const CACHE = 'hiplan-v5';`. À bumper en `hiplan-v6` dans ce sprint.
- **Version header** : dans `index.html`, cherche `<small class="app-version">v5</small>` et remplace par `v6`.
- **Viewport cible** : 390 px, mobile-first, touch targets minimum 44 px.

### Variables globales déjà déclarées — NE PAS RE-DÉCLARER

```js
let completed      // { [sessionId: string]: true }  — séances marquées "fait"
let skipped        // { [sessionId: string]: true }  — séances skippées
let sessionNotes   // { [sessionId: string]: string }
let sessionResults // { [sessionId: string]: string }
let perfResults    // { [sessionId: string]: PerfObject }
let currentWeekView // number | null
let currentSport   // string
const TOTAL_WEEKS = 14
const DISCIPLINE_CONFIG = { swim, bike, run, str, brick }
const WEEK_PHASES = [...]
const weeklyPlan = [...]  // tableau des 14 semaines (const, jamais muté)
const RPE_COLORS = { 1: {bg,txt}, ..., 10: {bg,txt} }
const STORE = { completed, skipped, notes, results, perfResults, programEnd, ... }
```

### Clés localStorage — NE JAMAIS MODIFIER

```
'hi_swim_tracker_v3'     → completed
'hi_swim_skipped_v1'     → skipped
'hi_tri_session_notes_v1'
'hi_tri_session_results_v1'
'hi_tri_perf_results_v1' → perfResults
'hi_tri_program_end'
'hi_tri_weekly_recap_shown_w{n}'
'hi_tri_snapshots'
```

### Helpers existants à réutiliser (NE PAS dupliquer leur logique)

| Fonction | Signature | Rôle |
|---|---|---|
| `getDiscipline` | `(sessionId: string) => 'swim'|'bike'|'run'|'str'|'brick'|null` | Détecte la discipline depuis le préfixe de l'ID |
| `secondsToMmss` | `(s: number) => string` | Formate un nombre de secondes en "mm:ss" |
| `escapeHtml` | `(value: any) => string` | Échappe les caractères HTML dangereux |
| `getSessionDisplayName` | `(session) => string` | Nom court : retire le préfixe `[A-Z]\d+ — ` |
| `showToast` | `(state: string|bool) => void` | Affiche un toast temporaire |
| `buildWeekView` | `(weekNum) => void` | Reconstruit la vue semaine |

### Structure du `perfResults[sessionId]` par discipline

Champs possibles selon la discipline (tous optionnels sauf `rpe`) :

```js
// Toutes disciplines
{ rpe: number }  // 1-10, toujours présent si perf enregistrée

// swim
{ rpe, paceS?: number, distM?: number, pctBrasse?: number }
//  paceS = secondes / 100 m

// bike
{ rpe, watts?: number, distKm?: number, durationMin?: number }

// run
{ rpe, paceKmS?: number, distKm?: number }
//  paceKmS = secondes / km

// str (muscu)
{ rpe, chargesNote?: string }

// brick : seulement { rpe }
```

### Hiérarchie z-index existante

```
100  : .app-header
799  : #perf-backdrop, #weekly-recap-backdrop
800  : #perf-sheet, #weekly-recap-sheet
900  : #snapshots-backdrop
901  : #snapshots-panel
950  : #snapshot-confirm-backdrop
951  : #snapshot-confirm-modal
```

Le history sheet doit utiliser **z-index 902 (backdrop) et 903 (sheet)** — au-dessus des sheets existantes, en dessous de la modal de confirmation de snapshot.

### Structure de la card séance (`buildSessionCard`)

La fonction `buildSessionCard(session, disciplineKey)` retourne ce template (extrait pertinent) :

```html
<div class="week-session-card wc-{color}..." id="week-card-{id}">
  <div class="wsc-top" onclick="toggleWeekSessionDetail('{id}')">
    <div class="wsc-name ...">{name}<span class="session-expand-icon">▾</span></div>
    <div class="wsc-badge {color}">{typeLabel}</div>
  </div>
  <div class="wsc-meta">{session.typeLabel || ''}</div>
  {/* Si isDone : buildPerfResultsRowHtml(session, disciplineKey) */}
  <div class="wsc-actions">{actionBtns}</div>
  {/* buildSessionDetailHtml(session, disciplineKey) */}
</div>
```

Le CSS `.wsc-btn.detail` existe déjà :
```css
.wsc-btn.detail { color: var(--muted); border-color: var(--muted2); }
.wsc-btn.detail:hover { color: var(--accent); border-color: var(--accent); }
```

### Pattern bottom sheet (référence : weekly-recap)

Le pattern standard utilisé dans ce projet pour les bottom sheets :

1. HTML : backdrop (`position:fixed; inset:0`) + sheet (`position:fixed; bottom:0; transform:translateY(100%)`), injectés via `document.body.insertAdjacentHTML('beforeend', ...)` dans le bloc d'init.
2. Ouverture : `backdrop.style.display='block'; sheet.style.display='block'; rAF(() => rAF(() => sheet.classList.add('open')))`.
3. Fermeture : `sheet.classList.remove('open'); setTimeout(() => { sheet.style.display='none'; backdrop.style.display='none'; }, 350)`.
4. Swipe-to-dismiss sur le handle (touchstart / touchmove / touchend, seuil 80 px).
5. Transition CSS : `transform 0.32s cubic-bezier(.4,0,.2,1)`.

### Bloc d'init (fin du fichier)

Le bloc d'init commence à environ la ligne 4836 et contient, dans cet ordre :
```
currentSport = 'week';
insertAdjacentHTML → #perf-backdrop + #perf-sheet
insertAdjacentHTML → #weekly-recap-backdrop + #weekly-recap-sheet
initWeeklyRecapSwipe()
insertAdjacentHTML → #snapshots-backdrop + #snapshots-panel + #snapshot-confirm-modal
takeSnapshotIfNeeded()
renderProgramEndControl()
buildWeekView(null)
updateStats()
validatePlan()
buildLoadChart()
buildWeeklyRecap()
```

---

## Stratégie de classification des séances par type

### Champ utilisé : `session.type` (niveau séance dans weeklyPlan)

Chaque objet séance dans `weeklyPlan` possède un champ `type` au niveau racine (NON dans `sets[].type`). Ce champ est :
- **Stable** : hardcodé dans les données, jamais muté à l'exécution.
- **Exhaustif** : toutes les séances des 14 semaines en sont pourvues.
- **Sémantiquement précis** : encode l'intention d'entraînement, pas la discipline seule.

**Classification = `session.type === cibleSession.type`. Aucun parsing de nom, aucune regex.**

### Inventaire complet des types réels dans le plan (14 semaines)

| `session.type` | Discipline | Exemples de séances réelles |
|---|---|---|
| `r-endurance` | Running | "Footing Z2 — Reprise" (rw1a), "Footing Z2 Long" (rw2a), "Run Z2 + Strides" (rw1b) |
| `r-tempo` | Running | "Run Tempo — Introduction" (rw2b), "Run Tempo — Progression" (rw3b) |
| `r-threshold` | Running | "Run Seuil 4×5min" (rw4b), séances seuil des semaines 5–12 |
| `r-recovery` | Running | Séances récupération active (semaines 9–10) |
| `s-technique` | Natation | "Natation — Technique crawl" (sw1a), drills (sw2a, sw3a, sw4a) |
| `s-endurance` | Natation | "Natation — Endurance crawl" (sw1b), volume continu (sw2b) |
| `b-endurance` | Vélo | Sorties Z2 vélo (bw3a, bw5a, bw9a) |
| `b-sweetspot` | Vélo | Séances sweet spot 168–189 W (bw4a, bw5a, bw6a) |
| `brick` | Brick | Enchaînements vélo+run (brw6a, brw7a, brw8a, brw9a) |
| `strength` | Muscu | "Renforcement — Activation générale" (mw1a), tous les mw* |

### Métrique clé affichée par ligne d'historique

| Discipline (`getDiscipline(id)`) | Champ(s) perf | Affichage |
|---|---|---|
| `swim` | `perf.paceS` (secondes/100m) | `secondsToMmss(perf.paceS) + ' /100m'` ; fallback : `perf.distM + ' m'` |
| `bike` | `perf.watts` | `perf.watts + ' W'` |
| `run` | `perf.paceKmS` (secondes/km) | `secondsToMmss(perf.paceKmS) + ' /km'` ; fallback : `perf.distKm + ' km'` |
| `str` | `perf.chargesNote` (texte libre) | Texte tronqué à 42 chars + `…` si plus long |
| `brick` | — | Aucune métrique (RPE seul suffit) |

Si aucun champ métrique n'est disponible pour la discipline, n'affiche pas de ligne métrique (pas de `—`, absence discrète).

### Gestion des cas limites

- **`session.type` absent ou inconnu** : affiche un libellé générique `'Type inconnu'` en titre ; inclut quand même la séance dans l'historique.
- **Aucune séance de ce type avec `completed` ou `skipped`** : afficher l'état vide (voir spec UX).
- **localStorage vide** : `completed = {}`, `skipped = {}`, `perfResults = {}` → état vide propre, aucune erreur.

---

## Ce qu'il faut implémenter

### 1. Ajouter le CSS dans `<style>` (juste avant la fermeture `</style>`)

Ajoute ce bloc CSS à la fin de la section `<style>`, avant `</style>` :

```css
/* ─── SESSION HISTORY SHEET ─── */
#session-history-backdrop {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.72); z-index: 902; touch-action: none;
}
#session-history-sheet {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #07090f;
  border-radius: 16px 16px 0 0;
  border-top: 1px solid #1c2d44;
  max-height: 60vh;
  z-index: 903;
  transform: translateY(100%);
  transition: transform 0.32s cubic-bezier(.4,0,.2,1);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: flex; flex-direction: column; overflow: hidden;
}
#session-history-sheet.open { transform: translateY(0); }
.hist-sheet-handle {
  width: 36px; height: 4px; background: #1c2d44;
  border-radius: 99px; margin: 10px auto 0; cursor: grab; flex-shrink: 0;
}
.hist-sheet-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 12px 16px 8px; border-bottom: 1px solid #1c2d44; flex-shrink: 0;
}
.hist-sheet-title-block { flex: 1; min-width: 0; overflow: hidden; }
.hist-sheet-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px; letter-spacing: 2px; color: #e2eaf4;
  display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hist-sheet-count {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: #5a7a99; letter-spacing: 0.5px; display: block; margin-top: 2px;
}
.hist-sheet-close-btn {
  min-width: 48px; min-height: 48px;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer;
  color: #5a7a99; font-family: 'JetBrains Mono', monospace;
  font-size: 18px; flex-shrink: 0;
}
#session-history-body {
  overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 8px 16px 24px; flex: 1;
}
.hist-empty {
  text-align: center; padding: 32px 0;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  color: #5a7a99; font-style: italic;
}
.hist-item {
  padding: 12px 0; border-bottom: 1px solid #1c2d44;
}
.hist-item:last-child { border-bottom: none; }
.hist-item-skipped { opacity: 0.4; }
.hist-item-top {
  display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;
}
.hist-item-week {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: #5a7a99; letter-spacing: 0.5px; flex-shrink: 0;
}
.hist-item-name {
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  color: #e2eaf4; font-weight: 500; flex: 1; min-width: 0;
}
.hist-skipped-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: #5a7a99; letter-spacing: 0.5px; flex-shrink: 0; font-style: italic;
}
.hist-item-bottom {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.hist-item-rpe {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 3px 8px; border-radius: 99px; height: 24px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  font-weight: 700; flex-shrink: 0; white-space: nowrap;
}
.hist-item-metric {
  font-family: 'JetBrains Mono', monospace; font-size: 13px;
  color: #e2eaf4; font-weight: 600;
}
```

### 2. Ajouter la constante `SESSION_TYPE_LABELS`

Localise la fonction `getDiscipline` (cherche `function getDiscipline(sessionId)`). Ajoute `SESSION_TYPE_LABELS` **immédiatement après la fermeture de `getDiscipline`** et avant `const WEEK_PHASES = [`:

```js
const SESSION_TYPE_LABELS = {
  'r-endurance': 'Endurance Z2 — Course',
  'r-tempo':     'Tempo — Course',
  'r-threshold': 'Seuil — Course',
  'r-recovery':  'Récupération — Course',
  's-technique': 'Technique — Natation',
  's-endurance': 'Endurance — Natation',
  'b-endurance': 'Endurance Z2 — Vélo',
  'b-sweetspot': 'Sweet Spot — Vélo',
  'brick':       'Brick',
  'strength':    'Force & Renforcement',
};
```

### 3. Ajouter les 5 fonctions JS

Localise la section `// ═══ WEEKLY RECAP` (cherche `function closeWeeklyRecap`). Insère le bloc suivant **immédiatement avant** `function closeWeeklyRecap()` (ou juste avant le commentaire de section WEEKLY RECAP), de façon à regrouper les fonctions de sheets :

```js
// ═══════════════════════════════════════════════════
// SESSION HISTORY SHEET — Historique par type de séance
// ═══════════════════════════════════════════════════

function getHistKeyMetric(disc, perf) {
  if (!perf) return null;
  if (disc === 'swim') {
    if (perf.paceS  > 0) return secondsToMmss(perf.paceS)   + ' /100m';
    if (perf.distM  > 0) return perf.distM + ' m';
    return null;
  }
  if (disc === 'bike') {
    if (perf.watts  > 0) return perf.watts + ' W';
    return null;
  }
  if (disc === 'run') {
    if (perf.paceKmS > 0) return secondsToMmss(perf.paceKmS) + ' /km';
    if (perf.distKm  > 0) return perf.distKm + ' km';
    return null;
  }
  if (disc === 'str') {
    if (perf.chargesNote) {
      const note = perf.chargesNote.trim();
      return note.length > 42 ? note.slice(0, 39) + '…' : note;
    }
    return null;
  }
  return null; // brick : RPE seul, pas de métrique clé
}

function buildSessionHistoryContent(sessionId) {
  // 1. Trouver le type de la séance cible
  let targetType = null;
  for (const week of weeklyPlan) {
    const s = week.sessions.find(sess => sess.id === sessionId);
    if (s) { targetType = s.type || null; break; }
  }

  const typeLabel = (targetType && SESSION_TYPE_LABELS[targetType])
    ? SESSION_TYPE_LABELS[targetType]
    : (targetType || 'Type inconnu');

  // 2. Collecter toutes les séances du même type, complétées ou skippées
  const matches = [];
  for (const week of weeklyPlan) {
    for (const s of week.sessions) {
      if (targetType && s.type !== targetType) continue;
      if (!targetType && s.id !== sessionId) continue; // fallback : séance seule
      const isDone    = !!completed[s.id];
      const isSkipped = !!skipped[s.id];
      if (!isDone && !isSkipped) continue;
      matches.push({ session: s, weekNum: week.weekNum, isDone, isSkipped });
    }
  }

  // 3. Trier : semaine la plus récente en premier
  matches.sort((a, b) => b.weekNum - a.weekNum);

  if (matches.length === 0) {
    return {
      count: 0,
      typeLabel,
      html: '<p class="hist-empty">Aucune séance de ce type complétée pour l\'instant.</p>'
    };
  }

  // 4. Construire les lignes HTML
  const rows = matches.map(function(item) {
    const s = item.session;
    const disc = getDiscipline(s.id);
    const perf = item.isDone ? (perfResults[s.id] || null) : null;
    const rpeColor = (perf && perf.rpe)
      ? (RPE_COLORS[perf.rpe] || { bg: '#5a7a99', txt: '#fff' })
      : null;
    const rpeBadge = rpeColor
      ? '<span class="hist-item-rpe" style="background:' + rpeColor.bg + ';color:' + rpeColor.txt + '">RPE ' + perf.rpe + '</span>'
      : '';
    const metric = getHistKeyMetric(disc, perf);
    const metricHtml = metric
      ? '<span class="hist-item-metric">' + escapeHtml(metric) + '</span>'
      : '';
    const skippedClass = item.isSkipped ? ' hist-item-skipped' : '';
    const skippedTag   = item.isSkipped ? '<span class="hist-skipped-tag">Passée</span>' : '';
    const hasBottom    = rpeBadge || metricHtml;

    return '<div class="hist-item' + skippedClass + '">'
      + '<div class="hist-item-top">'
      +   '<span class="hist-item-week">S' + item.weekNum + '</span>'
      +   '<span class="hist-item-name">' + escapeHtml(s.name) + '</span>'
      +   skippedTag
      + '</div>'
      + (hasBottom
        ? '<div class="hist-item-bottom">' + rpeBadge + metricHtml + '</div>'
        : '')
      + '</div>';
  }).join('');

  return { count: matches.length, typeLabel, html: rows };
}

function openSessionHistorySheet(sessionId) {
  const backdrop = document.getElementById('session-history-backdrop');
  const sheet    = document.getElementById('session-history-sheet');
  const body     = document.getElementById('session-history-body');
  const titleEl  = document.getElementById('session-history-title');
  const countEl  = document.getElementById('session-history-count');
  if (!backdrop || !sheet || !body) return;

  const result = buildSessionHistoryContent(sessionId);

  if (titleEl) titleEl.textContent = result.typeLabel;
  if (countEl) {
    countEl.textContent = result.count > 0
      ? result.count + ' séance' + (result.count > 1 ? 's' : '')
      : '';
  }
  body.innerHTML = result.html;

  backdrop.style.display = 'block';
  sheet.style.display    = 'block';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { sheet.classList.add('open'); });
  });
}

function closeSessionHistorySheet() {
  const sheet    = document.getElementById('session-history-sheet');
  const backdrop = document.getElementById('session-history-backdrop');
  if (!sheet) return;
  sheet.style.transition = '';
  sheet.style.transform  = '';
  requestAnimationFrame(function() {
    sheet.classList.remove('open');
    setTimeout(function() {
      sheet.style.display = 'none';
      if (backdrop) backdrop.style.display = 'none';
    }, 350);
  });
}

function initHistorySheetSwipe() {
  const handle = document.querySelector('#session-history-sheet .hist-sheet-handle');
  const sheet  = document.getElementById('session-history-sheet');
  if (!handle || !sheet) return;

  let startY = 0, currentDelta = 0;

  handle.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
    currentDelta = 0;
    sheet.style.transition = 'none';
  }, { passive: true });

  handle.addEventListener('touchmove', function(e) {
    var delta = e.touches[0].clientY - startY;
    if (delta > 0) {
      currentDelta = delta;
      sheet.style.transform = 'translateY(' + delta + 'px)';
    }
  }, { passive: true });

  handle.addEventListener('touchend', function() {
    sheet.style.transition = '';
    if (currentDelta > 80) {
      closeSessionHistorySheet();
    } else {
      sheet.style.transform = '';
    }
    currentDelta = 0;
  });
}
```

### 4. Modifier `buildSessionCard` — ajouter le bouton "Hist."

Localise `function buildSessionCard(session, disciplineKey)`. Dans le template HTML retourné, trouve la ligne :

```js
      <div class="wsc-actions">${actionBtns}</div>
```

Remplace-la par :

```js
      <div class="wsc-actions">${actionBtns}<button class="wsc-btn detail" onclick="event.stopPropagation(); openSessionHistorySheet('${session.id}')" aria-label="Historique de ce type de séance">Hist.</button></div>
```

**Aucune autre ligne de `buildSessionCard` ne doit changer.** La variable `actionBtns` (déjà construite par le bloc if/else isDone/isSkipped) reste inchangée.

### 5. Injecter le HTML du history sheet dans le bloc d'init

Dans le bloc d'init (fin du fichier), repère la ligne :

```js
takeSnapshotIfNeeded();
```

Ajoute **immédiatement avant** cette ligne le bloc suivant :

```js
document.body.insertAdjacentHTML('beforeend', [
  '<div id="session-history-backdrop" style="display:none" onclick="closeSessionHistorySheet()"></div>',
  '<div id="session-history-sheet" style="display:none">',
  '  <div class="hist-sheet-handle"></div>',
  '  <div class="hist-sheet-header">',
  '    <div class="hist-sheet-title-block">',
  '      <span class="hist-sheet-title" id="session-history-title">Historique</span>',
  '      <span class="hist-sheet-count" id="session-history-count"></span>',
  '    </div>',
  '    <button class="hist-sheet-close-btn" onclick="closeSessionHistorySheet()" aria-label="Fermer">&#x2715;</button>',
  '  </div>',
  '  <div id="session-history-body"></div>',
  '</div>',
].join(''));
initHistorySheetSwipe();
```

### 6. Bumper la version

**Dans `index.html`** — cherche `<small class="app-version">v5</small>` et remplace par `<small class="app-version">v6</small>`.

**Dans `sw.js`** — ligne 1 : remplace `const CACHE = 'hiplan-v5';` par `const CACHE = 'hiplan-v6';`.

---

## Ce qu'il ne faut PAS faire

- **Ne pas re-déclarer** `const` ou `let` pour des variables déjà déclarées en scope global (`completed`, `skipped`, `perfResults`, `DISCIPLINE_CONFIG`, `RPE_COLORS`, `SESSION_TYPE_LABELS` une fois déclarée, etc.). Vérifie qu'aucune déclaration en double n'est introduite.
- **Ne pas modifier** les clés localStorage ni la structure de `STORE`.
- **Ne pas modifier** le schéma de `weeklyPlan` : lecture seule stricte, jamais d'assignation sur les objets du plan.
- **Ne pas modifier** les fonctions `getDiscipline`, `secondsToMmss`, `escapeHtml`, `buildWeekView`, `buildPerfResultsRowHtml`, `wvToggleDone`, `wvToggleSkip`, ni aucune fonction existante autre que `buildSessionCard` (et uniquement la ligne `wsc-actions`).
- **Ne pas ajouter de fichiers supplémentaires** (ni CSS, ni JS, ni images). Tout va dans `index.html`, sauf le bump de `sw.js`.
- **Ne pas utiliser de framework**, bibliothèque externe, ou import ES module.
- **Ne pas dupliquer** les fonctions `getHistKeyMetric`, `buildSessionHistoryContent`, `openSessionHistorySheet`, `closeSessionHistorySheet`, `initHistorySheetSwipe` — chacune n'existe qu'une seule fois.
- **Ne pas dupliquer** les IDs DOM : `session-history-backdrop`, `session-history-sheet`, `session-history-body`, `session-history-title`, `session-history-count` ne doivent apparaître qu'une fois dans le HTML injecté.
- **Ne pas appeler `initHistorySheetSwipe()` plusieurs fois** (une seule fois dans le bloc d'init).
- **Ne pas toucher** au `session.type` des sets (`sets[].type` vaut `warm`, `main`, `interval`, `cool`) — ce n'est PAS le type de séance.
- **Ne pas modifier** `buildSessionDetailHtml` ni aucun autre helper de rendu de card.
- **Ne pas utiliser de guillemets non-échappés** dans les chaînes JS imbriquées dans les templates HTML (l'`onclick` doit utiliser des apostrophes ou `&apos;` si imbriqué dans des attributs HTML à guillemets doubles).
- **Ne pas utiliser de flèches `=>` dans les `addEventListener`** si des fonctions `function` traditionnelles sont plus sûres pour éviter des problèmes de portée (cohérence avec le style du fichier).

---

## Format de sortie attendu

- Modifie `index.html` en place.
- Modifie `sw.js` (ligne 1 uniquement).
- Ne crée pas de fichiers supplémentaires.
- Valide mentalement que `validatePlan()` ne génère pas de warning (le plan n'est pas modifié).
- Effectue une vérification de non-régression des identifiants globaux (aucune re-déclaration).

---

## Critères d'acceptation et plan de test

### Comportement attendu

**Test 1 — Ouverture et contenu**
- Aller en vue semaine sur une semaine contenant une séance seuil run (type `r-threshold`) déjà complétée.
- Tapper "Hist." sur la card.
- Résultat attendu : le bottom sheet s'ouvre en 60 vh, titre = "Seuil — Course", compteur = nombre de séances seuil run complétées ou skippées.
- Les séances listées sont uniquement des `r-threshold`, triées semaine décroissante (ex : S8, S7, S5, S4), chacune avec son badge RPE coloré et son allure /km si saisie.
- Aucune séance d'un autre type (ni `r-endurance`, ni séance de natation) n'apparaît.

**Test 2 — État vide**
- Ouvrir l'historique d'une séance dont aucune occurrence n'est `completed` ni `skipped`.
- Résultat attendu : message "Aucune séance de ce type complétée pour l'instant." centré, aucune erreur console.

**Test 3 — Séances skippées**
- Skipper une séance seuil run, puis ouvrir l'historique d'une autre séance seuil.
- Résultat attendu : la séance skippée apparaît dans la liste avec opacité réduite (`.hist-item-skipped`) et le tag "Passée". Aucun badge RPE, aucune métrique pour les skippées.

**Test 4 — localStorage vide**
- Supprimer toutes les clés localStorage, recharger.
- Ouvrir l'historique de n'importe quelle séance.
- Résultat attendu : état vide, aucune erreur JS console.

**Test 5 — Séances disciplines différentes**
- Ouvrir l'historique d'une séance natation technique (type `s-technique`).
- Résultat attendu : uniquement des séances `s-technique`, aucune séance run ni vélo.
- Métrique : allure /100m (champ `paceS`) si saisie.

**Test 6 — Muscu (chargesNote)**
- Valider une séance muscu avec une note de charges > 42 caractères.
- Ouvrir l'historique depuis une autre séance muscu.
- Résultat attendu : note tronquée avec `…`, aucune erreur.

**Test 7 — Ouverture/fermeture répétée**
- Ouvrir et fermer le history sheet 5 fois de suite depuis la même card.
- Résultat attendu : pas de duplication du sheet dans le DOM, pas de listeners multipliés, animation correcte à chaque fois.

**Test 8 — Non-régression : vue semaine**
- La vue semaine s'affiche normalement après fermeture du sheet.
- Les boutons "Fait", "Skip", "Annuler", "Unskip" fonctionnent comme avant.
- La perf-sheet s'ouvre normalement depuis les cards complétées.
- Le weekly recap s'ouvre normalement.

**Test 9 — Z-index**
- Si le snapshots panel (z-index 901) est ouvert, ouvrir le history sheet depuis une card — le sheet (z-index 903) doit couvrir le snapshots panel.

**Test 10 — Bump version**
- Le header affiche `v6`.
- `sw.js` ligne 1 : `const CACHE = 'hiplan-v6';`.

**Test 11 — Anti-régression `validatePlan()`**
- Ouvrir la console après chargement : aucun warning `[validatePlan]`, aucune erreur `Uncaught`, aucune erreur de syntaxe JS.

**Test 12 — Tap target mobile**
- Sur un vrai mobile 390 px, le bouton "Hist." doit être tappable sans grossissement : vérifier que `.wsc-btn` a `min-height: 44px` (déjà en place dans le CSS existant).

### Convention de commit

```
feat: N4 — historique par type de séance (bottom sheet)
```
