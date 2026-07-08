# Sprint « Mode Course » — HIPLAN v13

---

## Contexte technique

### Fichiers cibles

Deux fichiers à modifier :

- **`index.html`** à la racine du projet (~4800 lignes, actuellement `v12`). Ce fichier contient l'intégralité du HTML, du CSS (dans `<style>`) et du JavaScript (dans `<script>`). Il ne doit pas être découpé en fichiers supplémentaires.
- **`sw.js`** (à la racine, ligne 1 : `const CACHE = 'hiplan-v12';`). Modifié uniquement pour le bump de version en fin de sprint.

Contraintes absolues :
- Vanilla JS uniquement. Zéro framework, zéro bibliothèque externe, zéro import ES module.
- Aucun fichier supplémentaire sauf `sw.js` (déjà existant).
- Aucune dépendance npm, pas de build step.
- Mobile-first, touch targets minimum 44 px, viewport cible 390 px.

### Cartographie des zones pertinentes dans `index.html`

Lis chaque zone avant modification pour confirmer les numéros de ligne — ils peuvent avoir légèrement dérivé.

**Fin du bloc `<style>` (~L1562) :**
```
.rsw-next-btn:hover,
.rsw-next-btn:active { background: rgba(56,189,248,0.15); }
</style>
```
C'est ici qu'on ajoute tout nouveau CSS (immédiatement avant `</style>`).

**Balise `<header>` (~L1568-1582) :**
```html
<header class="app-header">
  <div class="header-inner">
    <div class="logo-block">
      <h1>HALF <span>IRONMAN</span> <small class="app-version">v12</small></h1>
      <p id="header-subtitle">// Mon plan d'entrainement</p>
    </div>
    <div class="progress-global">
      <div class="progress-label">PROGRESSION GLOBALE</div>
      <div style="display:flex;align-items:center;gap:10px">
        <div class="progress-track"><div class="progress-fill" id="globalBar" style="width:0%"></div></div>
        <div class="progress-pct" id="globalPct">0%</div>
      </div>
    </div>
  </div>
</header>
```

**`STORE` (~L2431) :**
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

**`safeWrite(key, value)` (~L2462) :** helper localStorage avec guard QuotaExceededError — déjà existant depuis v12, NE PAS RE-DÉCLARER.

**`RACE_WEEK = 7` (~L2495) :** constante déjà déclarée depuis v12, NE PAS RE-DÉCLARER.

**`DISCIPLINE_CONFIG` (~L2497) :**
```js
const DISCIPLINE_CONFIG = {
  swim:  { label: 'Natation', emoji: '🏊', color: 'swim',  accent: '#38bdf8', defaultUnit: 'min', prefix: 'sw'  },
  bike:  { label: 'Vélo',     emoji: '🚴', color: 'bike',  accent: '#facc15', defaultUnit: 'min', prefix: 'bw'  },
  run:   { label: 'Running',  emoji: '🏃', color: 'run',   accent: '#a3e635', defaultUnit: 'min', prefix: 'rw'  },
  str:   { label: 'Muscu',    emoji: '💪', color: 'str',   accent: '#c084fc', defaultUnit: '',    prefix: 'mw'  },
  brick: { label: 'Brick',    emoji: '🧱', color: 'brick', accent: '#fb923c', defaultUnit: 'min', prefix: 'brw' },
};
```

**`getRaceDate()` (~L2562) :** fonction déjà déclarée depuis v12, NE PAS RE-DÉCLARER. Calcule la date de la course à partir de `getProgramEndDate()` et des constantes `TOTAL_WEEKS` / `RACE_WEEK`.

**`updateHeaderSubtitle()` (~L2648) :** fonction déjà déclarée depuis v12. Elle calcule `diffDays` (jours jusqu'à la course) et met à jour `#header-subtitle`. Lot 4 la modifie.

**`buildSessionSetsHtml(session, disciplineKey)` (~L3046) :** rendu des blocs `sets[]` d'une séance. Signature exacte à conserver.

**`buildSessionDetailHtml(session, disciplineKey)` (~L3082) :** rendu du détail déplié d'une séance. Corps actuel :
```js
function buildSessionDetailHtml(session, disciplineKey) {
  return `
    <div class="session-detail" id="week-detail-${session.id}">
      ${buildSessionSetsHtml(session, disciplineKey)}
      ${session.tip ? `<div class="session-tip-box"><strong>💡 Conseil :</strong> ${session.tip}</div>` : ''}
      ${buildSessionResultHtml(session)}
      ${buildSessionNoteHtml(session.id)}
    </div>
  `;
}
```
Lot 3 insère un bandeau nutrition entre le bloc tip et `buildSessionResultHtml`.

**`buildWeekView(weekNum)` (~L3129) :** construit la vue semaine dans `#plan`. Structure actuelle (ordre des appels en fin de fonction) :
```js
  container.appendChild(grid);      // ~L3208
  buildRemainingSessionsPanel();     // ~L3209
}
```
Le point d'injection de la card checklist (Lot 1) est entre ces deux lignes.

**`buildRemainingSessionsPanel()` (~L3223) :** met à jour `#remaining-sessions-panel` (div séparée dans le DOM, hors `#plan`). Appel non impacté par les modifications de ce sprint.

**`showToast(state)` (~L3642) :** toast temporaire. États existants NE PAS RE-DÉCLARER :
`true`, `false`, `'skip'`, `'unskip'`, `'date-saved'`, `'date-error'`, `'note-saved'`, `'notes-copied'`, `'notes-empty'`, `'notes-error'`, `'import-ok'`, `'import-error'`, `'import-version'`, `'result-saved'`, `'perf-saved'`, `'perf-skipped'`, `'snapshot-restored'`, `'snapshot-none'`, `'storage-quota'`, `'sw-update'`, `'sw-offline'`.

**Pattern bottom sheet existant (~L4624+) :** les sheets (`#perf-sheet`, `#session-history-sheet`, `#weekly-recap-sheet`, `#snapshots-panel`) suivent toutes le même pattern :
1. DOM injecté via `document.body.insertAdjacentHTML('beforeend', ...)` au boot, en dernier.
2. Ouvrir : `backdrop.style.display = 'block'`; `sheet.style.display = 'block'`; `requestAnimationFrame(function() { requestAnimationFrame(function() { sheet.classList.add('open'); }); });`
3. Fermer : `sheet.classList.remove('open')`; `setTimeout(function() { sheet.style.display = 'none'; backdrop.style.display = 'none'; }, 350);`
4. CSS commun : `transform: translateY(100%)` au repos; `#sheet.open { transform: translateY(0); }`
La fiche jour J (Lot 2) réutilise exactement ce pattern.

**Séquence de boot (fin de fichier, ~L4722+) :**
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
L'injection DOM de la fiche course (Lot 2) va APRÈS les autres `insertAdjacentHTML` au boot, AVANT `initHistorySheetSwipe()`.

**Variables globales — NE PAS RE-DÉCLARER :**
```
STORE, completed, skipped, sessionNotes, sessionResults, perfResults,
currentSport, currentWeekView, TOTAL_WEEKS, RACE_WEEK, DISCIPLINE_CONFIG,
SESSION_TYPE_LABELS, WEEK_PHASES, RPE_COLORS, weeklyPlan, _corruptionDetected,
safeWrite, getRaceDate, goToNextSession, getDiscipline
```

**Nouvelles identités à vérifier avant ajout** (faire une recherche textuelle : si l'un d'eux existe déjà, stopper et signaler) :
```
RACE_CHECKLIST, RACE_DAY_DATA, NUTRITION_PROTOCOLS,
buildRaceChecklistCard, toggleRaceChecklistItem,
buildRaceDaySheetContent, openRaceDaySheet, closeRaceDaySheet,
buildNutritionBannerHtml
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
```
Nouvelle clé ajoutée dans ce sprint (lecture/écriture directe, pas dans `STORE`) :
```
'hi_tri_race_checklist_v1' → objet {itemId: bool} pour la checklist course
```

**Design system :**
```css
--accent: #38bdf8;          /* swim */
--orange: #fb923c;          /* alerte / course */
--orange-dim: rgba(251,146,60,0.12);
--green: #4ade80;
--red: #f87171;
--muted: #5a7a99;
```
Couleurs disciplines : swim `#38bdf8`, bike `#facc15`, run `#a3e635`, muscu `#c084fc`.
Polices : titres `'Bebas Neue', sans-serif` · chiffres `'JetBrains Mono', monospace` · corps `'DM Sans', sans-serif`.

**Modèle de données des séances dans `weeklyPlan` :**
Chaque session a : `id` (string), `name` (string), `type` (ex : `'b-endurance'`, `'r-tempo'`, `'brick'`), `dist` (number, toujours en minutes pour les séances bike/run/swim), `unit` (`'min'`), `sets[]`.
- Les séances bike pures ont `session.type.startsWith('b-')` et `disciplineKey === 'bike'`.
- Les séances run pures ont `session.type.startsWith('r-')` et `disciplineKey === 'run'`.
- Les bricks ont `session.type === 'brick'` et `disciplineKey === 'brick'`.
- Séances qualifiantes pour le bandeau nutrition dans le plan actuel (S1–S7) :
  - **Bike > 60 min** : `bw6a` (week 3, 85 min), `bw4a` (week 4, 135 min), `bw7a` (week 6, 75 min).
  - **Run > 75 min** : aucune séance pure run n'atteint ce seuil dans le plan actuel. Le code de détection doit quand même être générique pour couvrir d'éventuelles modifications futures.

---

## Raison des changements

Ce sprint « Mode Course » livre 4 lots UX à J-47 de Vichy 70.3 (dimanche 23 août 2026, semaine 7 du plan à 10 semaines). L'objectif est de transformer HIPLAN en compagnon de course opérationnel dans les 7 derniers jours, sans alourdir l'expérience des autres semaines.

- **Lot 1** : La semaine 7 n'a pas de contenu spécifique course dans l'app. Une checklist persistée est le premier artefact pratique attendu.
- **Lot 2** : Le plan de course (5 blocs, cibles chiffrées, pièges) doit être accessible en 2 taps le matin du 23 août — pas dans un PDF extérieur.
- **Lot 3** : Les séances longues vélo (bw4a 135 min, bw6a 85 min, bw7a 75 min) ne rappellent pas le protocole nutrition. C'est un oubli pratique à corriger.
- **Lot 4** : Le header ne signale pas l'approche de la course. Un changement de couleur orange à J-7 ancre la tension compétitive sans consommer d'espace vertical.

---

## Ce qu'il faut implémenter

### Lot 1 — Checklist course (card semaine 7)

#### 1a. Définir les données checklist — constante `RACE_CHECKLIST`

Localise `const DISCIPLINE_CONFIG` (~L2497). Insère immédiatement AVANT cette ligne le bloc suivant. Vérifie d'abord qu'aucune déclaration `RACE_CHECKLIST` n'existe dans le fichier.

```js
const RACE_CHECKLIST = [
  {
    id: 'T1',
    title: 'Sac T1',
    items: [
      { id: 't1_0', text: 'Combinaison (joints poignets et chevilles lubrifiés à la Vaseline)' },
      { id: 't1_1', text: 'Casque vélo (attaches vérifiées)' },
      { id: 't1_2', text: 'Lunettes vélo (+ paire de secours dans le sac)' },
      { id: 't1_3', text: 'Lunettes de natation de rechange' },
      { id: 't1_4', text: 'Chaussures vélo (propres, SPD/Look vérifiés)' },
      { id: 't1_5', text: 'Nutrition vélo scotchée sur le cadre (gels, barre)' },
      { id: 't1_6', text: 'Bidons remplis montés sur le vélo (eau + boisson énergie)' },
      { id: 't1_7', text: 'Anti-frottements (appliquer avant la nage : aisselles, cou, chevilles)' },
      { id: 't1_8', text: 'Chambre à air + bombe anti-crevaison attachées au cadre' },
    ],
  },
  {
    id: 'T2',
    title: 'Sac T2',
    items: [
      { id: 't2_0', text: 'Chaussures de course (lacets coulissants ou élastiques, semelles vérifiées)' },
      { id: 't2_1', text: 'Dossard sur ceinture élastique (prêt à clipser)' },
      { id: 't2_2', text: 'Casquette ou visière' },
      { id: 't2_3', text: '3 à 4 gels de poche pour le run' },
      { id: 't2_4', text: 'Anti-frottements (pieds si besoin)' },
      { id: 't2_5', text: 'Bonnet solaire si prévu' },
    ],
  },
  {
    id: 'VE',
    title: 'Veille J-1',
    items: [
      { id: 've_0', text: 'Préparer et vérifier les deux sacs complets (ne rien laisser au matin)' },
      { id: 've_1', text: 'Pasta party légère : pâtes blanches ou riz blanc, sauce simple, blanc de poulet ou poisson — pas de fibres crues, pas de légumes crus, pas de légumineuses' },
      { id: 've_2', text: 'Hydratation : 2,5 à 3 L d’eau dans la journée + électrolytes' },
      { id: 've_3', text: 'Éviter : alcool, aliments gras, épicés, tout nouvel aliment' },
      { id: 've_4', text: 'Tenues de course posées sur une chaise, triées dans l’ordre d’utilisation' },
      { id: 've_5', text: 'Coucher à 22h00 maximum' },
    ],
  },
  {
    id: 'MJ',
    title: 'Matin jour J',
    items: [
      { id: 'mj_0', text: 'Réveil : 2h30 à 3h avant le départ (selon heure de départ)' },
      { id: 'mj_1', text: 'Petit-déjeuner 2h–2h30 avant le départ : pain blanc + confiture/miel, 1 banane, café si habituel — 400 à 600 kcal, aucun aliment nouveau' },
      { id: 'mj_2', text: 'Au réveil : 500 ml d’eau' },
      { id: 'mj_3', text: '30 min avant le départ : 200 à 250 ml d’eau' },
      { id: 'mj_4', text: 'Arrivée sur site : 60 à 90 min avant le départ (récupération des sacs, repérage T1/T2)' },
      { id: 'mj_5', text: 'Échauffement 15–20 min : 8 min trot léger Z1, mobilité dynamique (leg swings, cercles de hanches), 200 m nage souple si accès eau' },
    ],
  },
];
```

Note : les chaînes utilisent des séquences `\uXXXX` pour tous les caractères accentués afin d'éviter tout problème d'encodage dans le fichier source.

#### 1b. Ajouter la fonction `toggleRaceChecklistItem(itemId)`

Localise `function buildRaceChecklistCard` (qui sera ajoutée en 1c). Insère la fonction suivante immédiatement AVANT `buildRaceChecklistCard`. Vérifie qu'aucune déclaration `toggleRaceChecklistItem` n'existe.

```js
function toggleRaceChecklistItem(itemId) {
  var state = {};
  try { state = JSON.parse(localStorage.getItem('hi_tri_race_checklist_v1') || '{}'); } catch { state = {}; }
  state[itemId] = !state[itemId];
  safeWrite('hi_tri_race_checklist_v1', JSON.stringify(state));
  // Mise à jour du compteur de section et du compteur global sans reconstruire toute la card
  var cb = document.getElementById('rc-cb-' + itemId);
  if (cb) cb.classList.toggle('rc-checked', !!state[itemId]);
  RACE_CHECKLIST.forEach(function(section) {
    var sectionItems = section.items;
    var done = sectionItems.filter(function(it) { return !!state[it.id]; }).length;
    var counterEl = document.getElementById('rc-count-' + section.id);
    if (counterEl) counterEl.textContent = done + '/' + sectionItems.length + ' prêts';
  });
  var allItems = RACE_CHECKLIST.flatMap(function(s) { return s.items; });
  var totalDone = allItems.filter(function(it) { return !!state[it.id]; }).length;
  var totalEl = document.getElementById('rc-total-count');
  if (totalEl) totalEl.textContent = totalDone + '/' + allItems.length + ' prêts';
}
```

#### 1c. Ajouter la fonction `buildRaceChecklistCard()`

Localise `function buildWeekView(weekNum)` (~L3129). Insère la fonction suivante immédiatement AVANT `buildWeekView`. Vérifie qu'aucune déclaration `buildRaceChecklistCard` n'existe.

```js
function buildRaceChecklistCard() {
  var state = {};
  try { state = JSON.parse(localStorage.getItem('hi_tri_race_checklist_v1') || '{}'); } catch { state = {}; }

  // Calcul diffDays pour auto-expansion
  var raceDate = getRaceDate();
  var diffDays = 99;
  if (raceDate) {
    var rd = new Date(raceDate.getFullYear(), raceDate.getMonth(), raceDate.getDate());
    diffDays = Math.round((rd - startOfToday()) / 86400000);
  }
  var defaultOpen = (diffDays >= 0 && diffDays <= 7);

  var allItems = RACE_CHECKLIST.flatMap(function(s) { return s.items; });
  var totalDone = allItems.filter(function(it) { return !!state[it.id]; }).length;

  var sectionsHtml = RACE_CHECKLIST.map(function(section) {
    var done = section.items.filter(function(it) { return !!state[it.id]; }).length;
    var itemsHtml = section.items.map(function(item) {
      var checked = !!state[item.id];
      return '<label class="rc-item-label" onclick="event.stopPropagation()">'
        + '<span id="rc-cb-' + item.id + '" class="rc-checkbox' + (checked ? ' rc-checked' : '') + '" onclick="toggleRaceChecklistItem(\'' + item.id + '\')" role="checkbox" aria-checked="' + checked + '" tabindex="0"></span>'
        + '<span class="rc-item-text">' + item.text + '</span>'
        + '</label>';
    }).join('');
    return '<div class="rc-section">'
      + '<div class="rc-section-header" onclick="this.parentNode.classList.toggle(\'rc-section-open\')">'
      + '<span class="rc-section-title">' + section.title + '</span>'
      + '<span class="rc-section-count" id="rc-count-' + section.id + '">' + done + '/' + section.items.length + ' prêts</span>'
      + '<span class="rc-section-arrow">▾</span>'
      + '</div>'
      + '<div class="rc-section-body">' + itemsHtml + '</div>'
      + '</div>';
  }).join('');

  var card = document.createElement('div');
  card.className = 'rc-card' + (defaultOpen ? ' rc-open' : '');
  card.id = 'race-checklist-card';
  card.innerHTML = '<div class="rc-card-header" onclick="document.getElementById(\'race-checklist-card\').classList.toggle(\'rc-open\')">'
    + '<span class="rc-card-icon">🏁</span>'
    + '<div class="rc-card-title-block">'
    + '<span class="rc-card-title">CHECKLIST COURSE</span>'
    + '<span class="rc-card-subtitle">VICHY 70.3 — 23 août 2026</span>'
    + '</div>'
    + '<span class="rc-total-count" id="rc-total-count">' + totalDone + '/' + allItems.length + ' prêts</span>'
    + '<button class="rc-fiche-btn" onclick="event.stopPropagation(); openRaceDaySheet()" aria-label="Ouvrir la fiche course">🏁 Fiche course</button>'
    + '<span class="rc-card-arrow">▾</span>'
    + '</div>'
    + '<div class="rc-card-body">' + sectionsHtml + '</div>';
  return card;
}
```

#### 1d. Injecter la card dans `buildWeekView`

Localise le bloc à la fin de `buildWeekView` (~L3208) :
```js
  container.appendChild(grid);
  buildRemainingSessionsPanel();
```

Remplace ces deux lignes par :
```js
  container.appendChild(grid);
  if (weekNum === RACE_WEEK) {
    container.appendChild(buildRaceChecklistCard());
  }
  buildRemainingSessionsPanel();
```

#### 1e. Ajouter le CSS de la checklist

Ajoute le bloc suivant immédiatement avant `</style>` (~L1562) :

```css
/* ─── RACE CHECKLIST CARD ─── */
.rc-card {
  background: #0e1117;
  border: 1px solid rgba(251,146,60,0.35);
  border-left: 3px solid var(--orange);
  border-radius: 10px;
  margin: 12px 0;
  overflow: hidden;
}
.rc-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px;
  cursor: pointer;
  user-select: none;
  min-height: 44px;
}
.rc-card-icon { font-size: 20px; flex-shrink: 0; }
.rc-card-title-block { flex: 1; min-width: 0; }
.rc-card-title {
  display: block;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  color: var(--orange);
}
.rc-card-subtitle {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.5px;
}
.rc-total-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--orange);
  white-space: nowrap;
  flex-shrink: 0;
}
.rc-fiche-btn {
  background: rgba(251,146,60,0.12);
  border: 1px solid rgba(251,146,60,0.4);
  border-radius: 6px;
  color: var(--orange);
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  min-height: 44px;
  min-width: 44px;
  padding: 4px 10px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.rc-fiche-btn:active { background: rgba(251,146,60,0.25); }
.rc-card-arrow {
  color: var(--muted);
  font-size: 14px;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.rc-card.rc-open .rc-card-arrow { transform: rotate(180deg); }
.rc-card-body { display: none; padding: 0 14px 12px; }
.rc-card.rc-open .rc-card-body { display: block; }
/* Sections internes */
.rc-section { margin-bottom: 8px; border-radius: 6px; overflow: hidden; background: rgba(255,255,255,0.02); }
.rc-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  min-height: 44px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.rc-section-title {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #e2eaf4;
  text-transform: uppercase;
}
.rc-section-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--orange);
  white-space: nowrap;
}
.rc-section-arrow {
  color: var(--muted);
  font-size: 12px;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.rc-section.rc-section-open .rc-section-arrow { transform: rotate(180deg); }
.rc-section-body { display: none; padding: 4px 0; }
.rc-section.rc-section-open .rc-section-body { display: block; }
/* Items */
.rc-item-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  min-height: 44px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.rc-item-label:last-child { border-bottom: none; }
.rc-checkbox {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid rgba(251,146,60,0.4);
  border-radius: 4px;
  margin-top: 2px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  flex-shrink: 0;
  display: inline-block;
}
.rc-checkbox.rc-checked {
  background: var(--orange);
  border-color: var(--orange);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 5l2.5 2.5L8 3' stroke='%230e1117' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14px;
}
.rc-item-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #c8d8e8;
  line-height: 1.4;
  flex: 1;
}
```

Assure-toi que les sections s'ouvrent par défaut quand la card est ouverte (ajoute la classe `rc-section-open` à chaque `.rc-section` dans `buildRaceChecklistCard()` lors de la génération du HTML). Modifie le code de génération `sectionsHtml` en 1c en conséquence :
```js
    var card_is_open = defaultOpen; // reuse the variable computed above
    // dans le map de section : ajouter 'rc-section-open' si defaultOpen
    card.innerHTML = '<div class="rc-card-header" ...'
    // et dans chaque '<div class="rc-section">' :
    // '<div class="rc-section' + (defaultOpen ? ' rc-section-open' : '') + '">'
```

---

### Lot 2 — Fiche jour J consolidée

#### 2a. Définir les données `RACE_DAY_DATA`

Localise `const RACE_CHECKLIST` ajoutée en 1a. Insère immédiatement APRÈS le bloc `RACE_CHECKLIST` (et avant `const DISCIPLINE_CONFIG`) le bloc suivant. Vérifie qu'aucune déclaration `RACE_DAY_DATA` n'existe.

```js
const RACE_DAY_DATA = [
  {
    id: 'swim', color: '#38bdf8', emoji: '🏄',
    title: 'NATATION — 1900 m',
    targetFigure: 'Nage relâchée, économique, conservatrice',
    targetMono: false,
    sections: [
      { heading: 'Avant le départ', items: [
        'Positionne-toi à l\'extérieur ou à l\'arrière de la masse — évite les contacts',
        'Juste avant le coup de feu : immerge le visage, souffle les bulles lentement, pars',
        '200 premiers mètres : allure conservatrice même si l\'adrénaline pousse fort',
      ]},
      { heading: 'Pendant la nage', items: [
        'Sighting toutes les 8 brassées : yeux au niveau de l\'eau, pas la tête entière',
        'Battement 2 temps : les jambes stabilisent, elles ne propulsent pas',
        'Si le souffle s\'emballe : 3 expirations forcées sous l\'eau en continuant à nager — ça suffit',
      ]},
      { heading: 'Avec combinaison (eau ≤ 24,5°C)', items: [
        'La flottabilité remonte les hanches passivement — tu as pratiqué ça au lac en S4',
        'Rythme de bras légèrement raccourci, pas forcé',
      ]},
      { heading: 'Sans combinaison (eau > 24,5°C)', items: [
        'Active le 2T dès les premiers mètres, hanches hautes, orteils pointés vers l\'arrière',
        'Tu as répété exactement ce scénario au lac en S6',
      ]},
    ],
    trap: 'Partir trop vite les 200 premiers mètres. L\'adrénaline fausse la perception — un départ trop rapide provoque l\'emballement respiratoire et coûte plus que les secondes gagnées.',
  },
  {
    id: 't1', color: '#fb923c', emoji: '⇄',
    title: 'T1 — Natation vers Vélo',
    targetFigure: '< 90 s',
    targetMono: true,
    sections: [
      { heading: 'Séquence (dans cet ordre)', items: [
        'Retirer la combinaison : humidifie les chevilles et les poignets avant d\'enlever, ne tire pas la fermeture à la va-vite',
        'Casque ON et attaché',
        'Lunettes vélo ON',
        'Chaussures vélo ON',
        'Vélo en main, départ vélo zone',
      ]},
    ],
    trap: 'Chaque seconde de panique coûte 5 secondes. Calme et automatique.',
  },
  {
    id: 'bike', color: '#facc15', emoji: '🚴',
    title: 'VÉLO — 90 km',
    targetFigure: '175–185 W (83–88% FTP)',
    targetMono: true,
    sections: [
      { heading: 'Km 0–15 : phase de contrôle', items: [
        'Ne dépasse pas 170 W même si les sensations sont excellentes',
        'La chaleur et l\'excitation de départ faussent la perception',
        'Cadence 85–90 rpm, position économique',
      ]},
      { heading: 'Km 15–90 : phase régulière', items: [
        'Maintien 175–185 W, cadence 85–90 rpm',
        'Si bonnes sensations sur portions plates : marge jusqu\'à 180–190 W, sans chercher',
        'Ta base Ironman te donne cette marge — ne la cherche pas, mais ne la refuse pas',
      ]},
      { heading: 'Nutrition (dès le km 1)', items: [
        '1 gel toutes les 25–30 min (60–80 g de glucides/heure)',
        '500–750 ml de liquide par heure',
        'Ne pas attendre d\'avoir faim ou soif',
      ]},
      { heading: 'Plan B chaleur (> 25°C)', items: [
        'Cible vélo abaissée à 170–180 W',
        'Hydratation : 750 ml/h minimum',
        'Éponger nuque et tête à chaque ravito',
      ], isPlanB: true},
    ],
    trap: 'Chasser les autres cyclistes et dépasser 190 W. Chaque watt au-delà se paie sur le run. La course se joue sur les 21 derniers kilomètres, pas sur le vélo.',
  },
  {
    id: 't2', color: '#fb923c', emoji: '⇄',
    title: 'T2 — Vélo vers Run',
    targetFigure: '< 75 s',
    targetMono: true,
    sections: [
      { heading: 'Séquence (dans cet ordre)', items: [
        'Rack vélo',
        'Casque OFF',
        'Chaussures de course ON',
        'Dossard/ceinture si pas déjà mis sur le vélo',
        'Casquette ON',
        'Gels de poche vérifiés',
      ]},
    ],
    trap: 'Séquence automatique — tu l\'as pratiquée en brw7a.',
  },
  {
    id: 'run', color: '#a3e635', emoji: '🏃',
    title: 'RUN — 21,1 km',
    targetFigure: '4:35–4:45/km',
    targetMono: true,
    sections: [
      { heading: 'Km 1–7 : phase de contrôle', items: [
        'Cours à 4:45–4:50/km strict, même si tu te sens très bien',
        'Les jambes sortent du mode vélo — laisse-les s\'adapter sans forcer',
        'L\'adrénaline + la chaleur faussent la perception de 15 à 20%',
      ]},
      { heading: 'Km 7–15 : allure cible', items: [
        'Régularité à 4:35–4:45/km',
        'Ne cherche pas à accélérer — maintenir l\'allure sur cette portion est la vraie performance',
        'Eau à chaque ravito, gel si prévu par le protocole',
      ]},
      { heading: 'Km 15–21,1 : tout ce qui reste', items: [
        'Si les réserves sont là et que les jambes répondent : lâche',
        'Si la chaleur ou la fatigue limite : maintiens 4:45–4:50/km jusqu\'à la ligne',
      ]},
      { heading: 'Plan B chaleur (> 25°C)', items: [
        'Km 1–7 : 4:55–5:00/km',
        'Éponger tête et nuque à chaque ravito',
        'Accepter que l\'allure cible soit 4:45–4:55/km sur l\'ensemble — mieux vaut finir fort',
      ], isPlanB: true},
    ],
    trap: 'Km 1 à 4:20/km sous l\'effet de l\'adrénaline. Un km 1 trop rapide peut coûter 5 minutes sur les 6 derniers kilomètres.',
  },
];
```

#### 2b. Ajouter `buildRaceDaySheetContent()`

Localise `function buildRaceChecklistCard()` ajoutée en 1c. Insère immédiatement AVANT cette fonction le builder suivant. Vérifie qu'aucune déclaration `buildRaceDaySheetContent` n'existe.

```js
function buildRaceDaySheetContent() {
  return RACE_DAY_DATA.map(function(block) {
    var sectionsHtml = block.sections.map(function(sec) {
      var itemsHtml = sec.items.map(function(item) {
        return '<li class="rds-item">' + item + '</li>';
      }).join('');
      var sectionClass = sec.isPlanB ? 'rds-section rds-section-planb' : 'rds-section';
      return '<div class="' + sectionClass + '">'
        + '<div class="rds-section-heading">' + sec.heading + '</div>'
        + '<ul class="rds-item-list">' + itemsHtml + '</ul>'
        + '</div>';
    }).join('');

    var targetHtml = block.targetMono
      ? '<div class="rds-target-mono">' + block.targetFigure + '</div>'
      : '<div class="rds-target-text">' + block.targetFigure + '</div>';

    return '<div class="rds-block" id="rds-block-' + block.id + '">'
      + '<div class="rds-block-header" style="border-left:3px solid ' + block.color + '">'
      + '<span class="rds-block-emoji">' + block.emoji + '</span>'
      + '<div class="rds-block-title-wrap">'
      + '<div class="rds-block-title" style="color:' + block.color + '">' + block.title + '</div>'
      + targetHtml
      + '</div>'
      + '</div>'
      + sectionsHtml
      + '<div class="rds-trap"><span class="rds-trap-label">PIÈGE</span> ' + block.trap + '</div>'
      + '</div>';
  }).join('');
}
```

#### 2c. Ajouter les fonctions `openRaceDaySheet()` et `closeRaceDaySheet()`

Localise `function buildRaceDaySheetContent()` ajoutée en 2b. Insère immédiatement APRÈS cette fonction les deux fonctions suivantes. Vérifie qu'aucune déclaration `openRaceDaySheet` ou `closeRaceDaySheet` n'existe.

```js
function openRaceDaySheet() {
  var backdrop = document.getElementById('race-day-backdrop');
  var sheet    = document.getElementById('race-day-sheet');
  var body     = document.getElementById('race-day-body');
  if (!backdrop || !sheet || !body) return;
  body.innerHTML = buildRaceDaySheetContent();
  backdrop.style.display = 'block';
  sheet.style.display    = 'block';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { sheet.classList.add('open'); });
  });
}

function closeRaceDaySheet() {
  var sheet    = document.getElementById('race-day-sheet');
  var backdrop = document.getElementById('race-day-backdrop');
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
```

#### 2d. Injecter le DOM de la fiche course au boot

Localise le bloc d'injection des bottom sheets au boot (cherche `// Injection du bottom sheet perf`). Ajoute le bloc suivant AVANT cette ligne (soit en premier dans la séquence d'injection). Vérifie qu'aucun élément `race-day-sheet` n'existe déjà.

```js
// Injection du bottom sheet fiche course (Lot 2 v13)
document.body.insertAdjacentHTML('beforeend',
  '<div id="race-day-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200" onclick="closeRaceDaySheet()"></div>' +
  '<div id="race-day-sheet" style="display:none">' +
    '<div class="rds-handle"></div>' +
    '<div class="rds-sheet-header">' +
      '<span class="rds-sheet-title">FICHE COURSE — VICHY 70.3</span>' +
      '<button class="rds-close-btn" onclick="closeRaceDaySheet()" aria-label="Fermer">&#x2715;</button>' +
    '</div>' +
    '<div class="rds-body" id="race-day-body"></div>' +
  '</div>'
);
```

#### 2e. Ajouter le bouton dans le header

Dans le HTML du header (~L1571-1582), localise la div `.logo-block`. Ajoute un bouton `id="header-race-btn"` immédiatement APRÈS `<p id="header-subtitle">`, dans le même `.logo-block` :

```html
      <p id="header-subtitle">// Mon plan d'entrainement</p>
      <button id="header-race-btn" style="display:none" onclick="openRaceDaySheet()" aria-label="Fiche course">&#x1F3C1; Fiche course</button>
```

Dans `updateHeaderSubtitle()` (~L2648), ajoute à la fin de la fonction (juste avant la dernière accolade fermante) le code suivant :

```js
  // Lot 2 + Lot 4 — bouton fiche course et accent orange race week
  var raceBtn = document.getElementById('header-race-btn');
  if (raceDate && diffDays >= 0 && diffDays <= 7) {
    if (raceBtn) raceBtn.style.display = 'inline-block';
    el.style.color = 'var(--orange)';
  } else {
    if (raceBtn) raceBtn.style.display = 'none';
    el.style.color = '';
  }
```

Note : `diffDays` et `raceDate` sont déjà déclarés dans le corps de `updateHeaderSubtitle()` — ce code les réutilise, pas de redéclaration.

#### 2f. Ajouter le CSS de la fiche course

Ajoute le bloc suivant immédiatement avant `</style>` (~L1562), après le CSS du Lot 1 :

```css
/* ─── RACE DAY SHEET ─── */
#race-day-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  max-height: 92vh;
  background: #0e1117;
  border-radius: 18px 18px 0 0;
  z-index: 210;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32,0.72,0,1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#race-day-sheet.open { transform: translateY(0); }
.rds-handle {
  width: 36px; height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 99px;
  margin: 10px auto 0;
  flex-shrink: 0;
}
.rds-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.rds-sheet-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--orange);
}
.rds-close-btn {
  background: transparent; border: none; color: var(--muted);
  font-size: 18px; cursor: pointer; padding: 4px 8px; min-height: 44px; min-width: 44px;
}
.rds-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 14px 32px;
  flex: 1;
}
/* Blocs discipline */
.rds-block { margin-bottom: 20px; }
.rds-block-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px 8px 0 0;
  margin-bottom: 2px;
}
.rds-block-emoji { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.rds-block-title-wrap { flex: 1; }
.rds-block-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 15px;
  letter-spacing: 0.8px;
  line-height: 1.2;
}
.rds-target-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: #e2eaf4;
  line-height: 1.2;
  margin-top: 2px;
}
.rds-target-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}
/* Sections */
.rds-section {
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 8px 12px;
}
.rds-section-planb {
  background: rgba(251,146,60,0.05);
  border-left: 2px solid rgba(251,146,60,0.3);
}
.rds-section-heading {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.rds-section-planb .rds-section-heading { color: var(--orange); }
.rds-item-list { list-style: none; padding: 0; margin: 0; }
.rds-item {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #c8d8e8;
  line-height: 1.5;
  padding: 3px 0 3px 12px;
  position: relative;
}
.rds-item::before {
  content: '\2014';
  position: absolute;
  left: 0;
  color: var(--muted);
}
/* Piège */
.rds-trap {
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.25);
  border-radius: 0 0 8px 8px;
  padding: 8px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #f87171;
  line-height: 1.4;
}
.rds-trap-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  background: rgba(248,113,113,0.2);
  border-radius: 3px;
  padding: 1px 5px;
  margin-right: 4px;
  vertical-align: middle;
}
/* Header race btn */
#header-race-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  background: rgba(251,146,60,0.12);
  border: 1px solid rgba(251,146,60,0.4);
  border-radius: 6px;
  color: var(--orange);
  cursor: pointer;
  padding: 4px 10px;
  min-height: 36px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  margin-top: 4px;
  transition: background 0.15s;
}
#header-race-btn:active { background: rgba(251,146,60,0.25); }
```

---

### Lot 3 — Bandeau nutrition séances longues

#### 3a. Définir les données `NUTRITION_PROTOCOLS`

Localise `const RACE_DAY_DATA` ajoutée en 2a. Insère immédiatement APRÈS ce bloc (et avant `const DISCIPLINE_CONFIG`) le bloc suivant. Vérifie qu'aucune déclaration `NUTRITION_PROTOCOLS` n'existe.

```js
const NUTRITION_PROTOCOLS = {
  bike: {
    title: 'Nutrition vélo — protocole horodaté',
    rows: [
      { time: 'T+0',      content: 'Départ + bidon eau (250 ml)' },
      { time: 'T+20 min', content: '1 gel (25–30 g glucides) + 150 ml eau' },
      { time: 'T+45 min', content: '1 gel ou 1/2 barre (25–30 g glucides) + 150 ml eau' },
      { time: 'T+70 min', content: '1 gel (25–30 g glucides) + 150 ml eau' },
      { time: 'T+95 min', content: '1 gel ou barre + 200 ml eau' },
      { time: 'T+120 min', content: '1 gel + 200 ml eau' },
    ],
    notes: [
      'Objectif : 60–80 g de glucides/heure, 500 ml de liquide minimum/heure',
      'Par temps chaud : monter à 750 ml/h',
      'La sortie bw4a (135 min, S4) est le test grandeur nature — répète exactement ce protocole',
    ],
  },
  run: {
    title: 'Nutrition run — protocole horodaté',
    rows: [
      { time: 'T+0',     content: 'Départ hydraté (dernier verre 30 min avant)' },
      { time: 'T+30 min', content: '1 gel (25 g glucides) + eau au ravito suivant' },
      { time: 'T+60 min', content: '1 gel (25 g glucides) + eau' },
      { time: 'T+80 min', content: 'Cola 100 ml si bien toléré, sinon 1 gel + eau' },
    ],
    notes: [
      'Objectif : 40–60 g de glucides/heure (absorption réduite par rapport au vélo)',
      'Le cola (sucre rapide + caféine) peut être très efficace après 50–60 min — à tester impérativement en S4 ou S5',
      'Rien de nouveau le jour J : uniquement ce qui a été testé',
    ],
  },
};
```

#### 3b. Ajouter `buildNutritionBannerHtml(session, disciplineKey)`

Localise `function buildSessionSetsHtml(session, disciplineKey)` (~L3046). Insère immédiatement AVANT cette fonction le helper suivant. Vérifie qu'aucune déclaration `buildNutritionBannerHtml` n'existe.

**Détection dynamique :** utilise `disciplineKey` (déjà connu à l'appel) et `session.dist` (toujours en minutes pour les séances bike/run). Les bricks (`disciplineKey === 'brick'`) ne déclenchent pas le bandeau — leur protocole mixte est géré par la fiche jour J.

```js
function buildNutritionBannerHtml(session, disciplineKey) {
  var proto = null;
  if (disciplineKey === 'bike' && session.unit === 'min' && session.dist > 60) {
    proto = NUTRITION_PROTOCOLS.bike;
  } else if (disciplineKey === 'run' && session.unit === 'min' && session.dist > 75) {
    proto = NUTRITION_PROTOCOLS.run;
  }
  if (!proto) return '';

  var rowsHtml = proto.rows.map(function(row) {
    return '<tr><td class="nb-time">' + row.time + '</td><td class="nb-content">' + row.content + '</td></tr>';
  }).join('');
  var notesHtml = proto.notes.map(function(note) {
    return '<li class="nb-note">' + note + '</li>';
  }).join('');
  var bannerId = 'nb-' + session.id;

  return '<div class="nb-banner" id="' + bannerId + '">'
    + '<div class="nb-header" onclick="document.getElementById(\'' + bannerId + '\').classList.toggle(\'nb-open\')">'
    + '<span class="nb-icon">⛽</span>'
    + '<span class="nb-title">' + proto.title + '</span>'
    + '<span class="nb-arrow">▾</span>'
    + '</div>'
    + '<div class="nb-body">'
    + '<table class="nb-table">' + rowsHtml + '</table>'
    + '<ul class="nb-notes">' + notesHtml + '</ul>'
    + '</div>'
    + '</div>';
}
```

#### 3c. Modifier `buildSessionDetailHtml` pour insérer le bandeau

Localise `function buildSessionDetailHtml(session, disciplineKey)` (~L3082). Remplace le corps **complet** de cette fonction par :

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

La seule différence avec l'original est l'ajout de `${buildNutritionBannerHtml(session, disciplineKey)}`. Ne modifie rien d'autre.

#### 3d. Ajouter le CSS du bandeau nutrition

Ajoute le bloc suivant immédiatement avant `</style>`, après les blocs CSS des Lots 1 et 2 :

```css
/* ─── BANDEAU NUTRITION ─── */
.nb-banner {
  border: 1px solid rgba(251,146,60,0.25);
  border-radius: 8px;
  margin: 10px 0;
  overflow: hidden;
  background: rgba(251,146,60,0.04);
}
.nb-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  min-height: 44px;
}
.nb-icon { font-size: 16px; flex-shrink: 0; }
.nb-title {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--orange);
  text-transform: uppercase;
}
.nb-arrow {
  color: var(--muted);
  font-size: 12px;
  transition: transform 0.2s;
}
.nb-banner.nb-open .nb-arrow { transform: rotate(180deg); }
.nb-body { display: none; padding: 0 12px 10px; }
.nb-banner.nb-open .nb-body { display: block; }
.nb-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.nb-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--orange);
  white-space: nowrap;
  padding: 5px 10px 5px 0;
  vertical-align: top;
  width: 80px;
}
.nb-content {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #c8d8e8;
  padding: 5px 0;
  line-height: 1.4;
}
.nb-notes { list-style: none; padding: 0; margin: 0; }
.nb-note {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
  padding: 3px 0 3px 10px;
  position: relative;
}
.nb-note::before { content: '\2022'; position: absolute; left: 0; color: var(--orange); }
```

---

### Lot 4 — Escalade visuelle race week

Ce lot est partiellement couvert par le code ajouté au Lot 2 (section 2e). La logique `if (raceDate && diffDays >= 0 && diffDays <= 7) { el.style.color = 'var(--orange)'; }` dans `updateHeaderSubtitle()` est l'implémentation complète du Lot 4. Aucune modification supplémentaire n'est nécessaire si le Lot 2 est correctement implémenté.

Vérifie que `el.style.color = ''` (reset) est bien exécuté dans la branche `else` pour les jours hors plage J-7.

---

### Lot 5 — Bump de version (à faire EN DERNIER, après validation)

**Dans `index.html`** (~L1571) : remplace `<small class="app-version">v12</small>` par `<small class="app-version">v13</small>`.

**Dans `sw.js`** (ligne 1) : remplace `const CACHE = 'hiplan-v12';` par `const CACHE = 'hiplan-v13';`.

---

## Ce qu'il ne faut PAS faire

- **Ne pas re-déclarer** `const` ou `let` pour des variables ou fonctions déjà déclarées. Avant chaque ajout, effectuer une recherche textuelle dans `index.html` pour vérifier l'absence de l'identifiant. Variables à risque : `RACE_WEEK`, `getRaceDate`, `safeWrite`, `getDiscipline`, `DISCIPLINE_CONFIG`, `goToNextSession`.
- **Ne pas modifier** les valeurs de chaîne des clés dans `STORE` (cela casse les données existantes). La nouvelle clé `'hi_tri_race_checklist_v1'` n'appartient pas à `STORE` — la lire et écrire directement comme literal string.
- **Ne pas dupliquer** `buildSessionDetailHtml` — une seule déclaration, modifiée en place (section 3c).
- **Ne pas afficher** la card checklist sur les semaines ≠ 7. La condition `weekNum === RACE_WEEK` dans `buildWeekView` est stricte.
- **Ne pas cacher** le bandeau nutrition dans la card repliée : `buildNutritionBannerHtml` est appelé depuis `buildSessionDetailHtml`, qui est lui-même dans `session-detail` — ce bloc est invisible tant que la session card est repliée. Aucune logique supplémentaire n'est nécessaire.
- **Ne pas modifier** `buildSessionSetsHtml` — cette fonction reste inchangée.
- **Ne pas modifier** `save()`, `loadStoredState()`, `takeSnapshot()`, `restoreSnapshot()`, `importData()` — ces fonctions ne sont pas dans le périmètre de ce sprint.
- **Ne pas ajouter** de fichiers supplémentaires (ni CSS séparé, ni JS séparé). Tout va dans `index.html`, sauf le bump de `sw.js`.
- **Ne pas utiliser** de framework, bibliothèque externe, ou import ES module.
- **Ne pas bumper** `v12` → `v13` avant d'avoir validé tous les lots.
- **Ne pas restaurer** une session ouverte dans `buildWeekView` : la fonction repart toujours d'un `container.innerHTML = ''`. Ce comportement existant n'est pas modifié.
- **Ne pas modifier** `WEEK_PHASES`, `weeklyPlan`, ni aucune donnée de séance — les IDs de séances sont intouchés.
- **Ne pas ajouter de hauteur** au header. Le bouton `#header-race-btn` doit avoir `display:none` par défaut et être affiché en `inline-block` (pas block) pour s'intégrer dans le flux sans décaler les autres éléments de `.logo-block`.
- **Ne pas utiliser** `localStorage.setItem` directement dans les nouvelles fonctions de checklist — passer par `safeWrite()` à chaque écriture.

---

## Format de sortie attendu

- Modifie `index.html` en place.
- Modifie `sw.js` (ligne 1 uniquement) en place.
- Ne crée aucun fichier supplémentaire.
- Vérifie mentalement que `validatePlan()` ne génère pas de warning (le plan `weeklyPlan` n'est pas modifié).
- Effectue une vérification de non-régression des identifiants globaux (aucune re-déclaration des 9 nouvelles identités listées en Contexte).

---

## Scénarios QA par lot

### Lot 1 — Checklist course

**QA-1-A — Non-régression semaines ≠ 7 :**
Naviguer vers la semaine 1, 2, 3, 4, 5, 6 via les boutons de navigation. Vérifier qu'aucune card checklist n'apparaît. La vue semaine doit être identique à avant le sprint.

**QA-1-B — Affichage semaine 7 :**
Naviguer vers la semaine 7. Vérifier que la card checklist apparaît après la grille des séances, avec bordure orange, les 4 sections et le bouton "🏁 Fiche course".

**QA-1-C — État replié par défaut (J > 7) :**
Avec `localStorage.setItem('hi_tri_program_end', '2026-09-13')` et date système simulée à J-30, recharger et naviguer en S7. La card doit être repliée par défaut (corps caché, sections non visibles).

**QA-1-D — État ouvert automatiquement (J ≤ 7) :**
Simuler programEnd tel que `getRaceDate()` retourne aujourd'hui + 5 jours (ex : `localStorage.setItem('hi_tri_program_end', toIsoLocalDate(addDays(new Date(), 26)))`). Recharger, naviguer en S7. La card doit être ouverte avec les sections visibles.

**QA-1-E — Persistance des ticks après reload :**
Cocher 3 items dans des sections différentes. Recharger la page. Naviguer en S7. Vérifier que les 3 items restent cochés et que les compteurs "X/N prêts" sont corrects.

**QA-1-F — Compteurs par section :**
Cocher tous les items d'une section (ex : Sac T2 — 6 items). Le compteur de cette section doit afficher "6/6 prêts". Le compteur global doit refléter le nouveau total.

**QA-1-G — Touch target :**
Sur DevTools responsive 390 px, vérifier que chaque item checkbox est tappable confortablement sur au moins 44 px de hauteur.

---

### Lot 2 — Fiche jour J

**QA-2-A — Accès depuis la checklist :**
En semaine 7, ouvrir la card checklist (si elle n'est pas déjà ouverte), tapper "🏁 Fiche course". Le bottom sheet s'ouvre avec les 5 blocs (Natation, T1, Vélo, T2, Run). Aucune erreur JS.

**QA-2-B — Accès depuis le header (J ≤ 7) :**
Simuler diffDays ≤ 7 (voir QA-1-D). Recharger. Le bouton "🏁 Fiche course" est visible dans le header. Tapper : le bottom sheet s'ouvre. Aucune hauteur supplémentaire dans le header.

**QA-2-C — Bouton header absent à J > 7 :**
Avec date normale (J > 7), vérifier que `#header-race-btn` est `display:none` et ne provoque aucune rupture de layout du header.

**QA-2-D — Scrollabilité sur 390 px :**
Ouvrir la fiche course sur DevTools 390 px. Scroller du bloc Natation jusqu'au bloc Run sans blocage. Les 5 blocs sont accessibles.

**QA-2-E — Cibles chiffrées en grand :**
Vérifier visuellement que les figures "< 90 s", "175–185 W", "< 75 s", "4:35–4:45/km" s'affichent en JetBrains Mono ≥ 24px. Le bloc Natation (sans cible mono) affiche son texte en corps standard.

**QA-2-F — Pièges en rouge :**
Vérifier que chaque bloc affiche une ligne "PIÈGE" en rouge avec fond distinctif.

**QA-2-G — Sections Plan B en orange :**
Vérifier que les sections "Plan B chaleur" du bloc Vélo et du bloc Run ont un fond et une bordure orange distinctifs.

**QA-2-H — Fermeture :**
Tapper la croix de fermeture. Le sheet se ferme avec animation. Tapper le backdrop. Idem.

---

### Lot 3 — Bandeau nutrition

**QA-3-A — Bandeau présent sur séances qualifiantes :**
Naviguer en semaine 3, ouvrir la card `bw6a` (85 min vélo). Le détail doit contenir un bandeau "⛽ Nutrition vélo" replié, positionné entre le tip et la zone de résultat.

Répéter pour `bw4a` (semaine 4, 135 min) et `bw7a` (semaine 6, 75 min).

**QA-3-B — Bandeau absent des séances courtes :**
Naviguer en semaine 2, ouvrir `bw2a` (60 min exactement — condition `> 60` non satisfaite). Aucun bandeau nutrition. Répéter sur `bw5a` (semaine 5, 50 min) et `bw10b` (semaine 10, 60 min).

**QA-3-C — Bandeau absent des séances run et muscu :**
Ouvrir n'importe quelle séance run (aucune n'atteint 75 min dans le plan). Aucun bandeau. Idem pour les séances muscu et natation.

**QA-3-D — Bandeau absent dans la card repliée :**
La card `bw6a` repliée ne doit pas afficher le bandeau. Le bandeau n'est visible qu'après dépliage.

**QA-3-E — Contenu exact du protocole vélo :**
Déplier le bandeau de `bw4a`. Vérifier la présence des 6 lignes horaires (T+0 → T+120 min) et des 3 notes (glucides/heure, temps chaud, référence bw4a).

**QA-3-F — Non-régression détail de séance :**
Sur une séance qualifiante, vérifier que le bouton "✓ Fait", la zone de note et le champ de résultat fonctionnent normalement après l'ajout du bandeau.

---

### Lot 4 — Escalade visuelle race week

**QA-4-A — Header normal à J-8 :**
Simuler diffDays = 8. `#header-subtitle` a sa couleur par défaut (non orange). Le bouton `#header-race-btn` est caché.

**QA-4-B — Header orange à J-7 :**
Simuler diffDays = 7. `#header-subtitle` passe en couleur `var(--orange)`. Le bouton `#header-race-btn` est visible.

**QA-4-C — Header orange le jour J :**
Simuler diffDays = 0. Le sous-titre affiche "// JOUR J · AFFÛTAGE & RACE · SEMAINE 7/10" en orange.

**QA-4-D — Zéro hauteur supplémentaire :**
Comparer la hauteur du header entre J-8 (bouton caché) et J-7 (bouton visible). Si la hauteur du header change, revoir le positionnement du bouton.

**QA-4-E — Non-régression après la course :**
Simuler diffDays < 0 (course terminée). Aucun countdown négatif, couleur subtitle revenue au défaut, bouton caché.

---

### Vérifications transversales

**TX-1 — Zéro erreur console :**
Après rechargement complet, la console ne doit contenir aucun `Uncaught`, aucun `TypeError`, aucun `[validatePlan]` warning.

**TX-2 — Bump version :**
Le header affiche `v13`. `sw.js` ligne 1 : `const CACHE = 'hiplan-v13';`.

**TX-3 — Non-régression générale :**
- La vue semaine s'affiche, la navigation entre semaines (S1-S10) fonctionne.
- Les boutons "✓ Fait", "⏭ Skip", "↩ Unskip", "✕ Annuler" fonctionnent.
- La perf-sheet s'ouvre et se ferme normalement.
- Le weekly recap s'ouvre et se ferme normalement.
- Le panel snapshots (bouton "Sauvegardes") s'ouvre normalement.
- L'export JSON fonctionne.
- Le panel "À faire cette semaine" affiche les séances restantes avec le badge "PROCHAIN" sur la première.
- Le countdown dans le header se met à jour après modification de la date de fin.

### Convention de commit

```
feat: v13 — mode course (checklist, fiche jour J, nutrition, accent race week)
```
