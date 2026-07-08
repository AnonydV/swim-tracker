# SPRINT P4+U5 — Countdown course dans le header + progression de phase dans la vue semaine

---

## Contexte technique

### Fichier cible

Un seul fichier : `index.html` à la racine du projet HIPLAN (~4900 lignes). Ce fichier contient l'intégralité du HTML, du CSS (dans `<style>`) et du JavaScript (dans `<script>`). Il ne doit pas être découpé en fichiers supplémentaires. Le fichier `sw.js` (à la racine) sera modifié uniquement pour le bump de version en fin de sprint.

Contraintes absolues :
- Vanilla JS uniquement. Zéro framework, zéro bibliothèque externe, zéro import ES module.
- Aucun fichier supplémentaire sauf `sw.js` (déjà existant, à modifier uniquement pour le bump).
- Aucune dépendance npm, pas de build step.
- Aucun nouveau bloc DOM ajouté dans `.container` (budget vertical épuisé).

### Cartographie exacte des lignes pertinentes dans `index.html`

Lis ces zones avant toute modification pour confirmer les numéros de ligne — ils peuvent avoir légèrement dérivé.

**Header HTML (L1440-1445) :**
```html
<header class="app-header">
  <div class="header-inner">
    <div class="logo-block">
      <h1>HALF <span>IRONMAN</span> <small class="app-version">v4</small></h1>
      <p>// Mon plan d'entrainement</p>
    </div>
```
- L1443 : badge `<small class="app-version">v4</small>` — à bumper à `v5` en fin de sprint.
- L1444 : `<p>// Mon plan d'entrainement</p>` — le sous-titre statique à rendre dynamique (Feature P4).

**CSS `.logo-block p` (L82-88) :**
```css
.logo-block p {
  font-size: 12px;
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 1px;
  margin-top: 2px;
}
```
Ce bloc CSS sera modifié pour ajouter `white-space: nowrap; overflow: hidden;` (voir Feature P4).

**STORE — clés localStorage (L2856-2866) :**
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
Ne jamais modifier les valeurs de chaîne de ces clés. Ne jamais redéclarer `STORE`.

**Constantes et fonctions utilitaires existantes (à réutiliser, ne pas recalculer) :**
- L2902 : `const TOTAL_WEEKS = 14;`
- L2918-2923 : `const WEEK_PHASES = [...]` — 4 phases, chacune avec `{ phase, name, weeks[] }` :
  ```js
  { phase: 1, name: 'BASE AÉROBIE',  weeks: [1,2] }
  { phase: 2, name: 'CONSTRUCTION',  weeks: [3,4,5] }
  { phase: 3, name: 'SPÉCIFIQUE',    weeks: [6,7,8] }
  { phase: 4, name: 'AFFÛTAGE',      weeks: [9,10,11,12,13,14] }
  ```
- L2925-2928 : `function addDays(date, days)` — retourne une nouvelle Date.
- L2931-2935 : `function parseIsoLocalDate(value)` — parse une chaîne ISO 'YYYY-MM-DD' en Date locale.
- L2938-2943 : `function toIsoLocalDate(date)` — sérialise une Date en 'YYYY-MM-DD'.
- L2945-2953 : `function getProgramEndDate()` — lit `STORE.programEnd` dans localStorage, retourne un objet `Date` ou `null`.
- L2989-2992 : `function startOfToday()` — retourne `new Date(today.getFullYear(), today.getMonth(), today.getDate())` (minuit local).
- L2994-3003 : `function getCalendarActiveWeekNum()` — retourne la semaine calendaire active (entier 1–14).
- L3352-3353 : `function getWeekPhase(weekNum)` — retourne l'objet phase `{ phase, name, weeks }` pour une semaine donnée.

**`refreshCalendarViews()` (L3033-3039) :**
```js
function refreshCalendarViews() {
  renderProgramEndControl();
  currentWeekView = getCalendarActiveWeekNum();
  buildWeekView(currentWeekView);
  updateStats();
  buildLoadChart();
}
```
C'est ici qu'il faudra ajouter l'appel à `updateHeaderSubtitle()` (Feature P4).

**`saveProgramEndFromInput()` (L3324-3334) :**
```js
function saveProgramEndFromInput() {
  const input = document.getElementById('programEndInput');
  const date = parseIsoLocalDate(input?.value);
  if (!date) { showToast('date-error'); return; }
  localStorage.setItem(STORE.programEnd, toIsoLocalDate(date));
  refreshCalendarViews();   // <-- refreshCalendarViews est déjà appelé ici
  showToast('date-saved');
}
```
Grâce à l'appel à `refreshCalendarViews()`, le sous-titre se mettra à jour automatiquement quand l'utilisateur valide une nouvelle date, sans modification supplémentaire de cette fonction.

**`buildWeekView()` — titre de la nav bar (L3505-3517) :**
```js
const nav = document.createElement('div');
nav.className = 'week-view-nav';
nav.innerHTML = `
  <button class="week-nav-btn" ...>← ...</button>
  <div class="week-nav-title">
    SEMAINE ${getWeekLabel(weekNum)}
    <span>${phase.name} · ${weekDateRange}${isActive ? ' · 📍 CETTE SEMAINE' : ''}</span>
    ${weekNum !== getCalendarActiveWeekNum() ? `<button ...>↩ Semaine active</button>` : ''}
  </div>
  <button class="week-nav-btn" ...>...</button>
`;
container.appendChild(nav);
```
La ligne clé à modifier est celle du `<span>` (L3512) — Feature U5.
Les variables `phase` (retour de `getWeekPhase(weekNum)` à L3503) et `weekNum` sont déjà disponibles dans le scope à ce moment.

**Séquence de boot (L4875-4882) :**
```js
takeSnapshotIfNeeded();

renderProgramEndControl();
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```
`updateHeaderSubtitle()` sera ajouté dans cette séquence (voir Feature P4).

**`sw.js` L1 :**
```js
const CACHE = 'hiplan-v4';
```
À bumper à `'hiplan-v5'` en fin de sprint.

### Diagnostic du "statTotal 20"

Le `<div class="val" id="statTotal">20</div>` à L1463 est un placeholder HTML visible uniquement pendant les quelques millisecondes avant l'exécution du JS. La fonction `updateStats()` (L4086-4124) l'écrase immédiatement au boot (L4879) en comptant les vraies sessions depuis `weeklyPlan`. Ce n'est pas un bug actif. **Aucune action requise sur ce point.**

---

## Raison des changements

**P4 — Countdown dans le header :** L'utilisateur suit un plan de 14 semaines avec une date de course cible. Le sous-titre statique "// Mon plan d'entrainement" ne donne aucune information d'orientation temporelle. Le remplacer par un countdown contextualisé (J restants + phase + semaine/14) permet à l'utilisateur de se situer instantanément sans navigation, sans coût vertical (remplacement in-place du même élément `<p>`).

**U5 — Progression dans la phase :** Le nom de phase est déjà affiché dans le titre de la vue semaine, mais la position dans cette phase (ex : "semaine 2 sur 3 en CONSTRUCTION") est une information manquante qui aide à calibrer l'effort et à anticiper la prochaine phase. C'est un ajout discret dans un élément existant, calculable à partir de données déjà chargées.

---

## Ce qu'il faut implémenter

### 1. Feature P4 — Countdown course dans le sous-titre du header

#### 1a. Modification HTML (L1444)

Ajoute l'attribut `id="header-subtitle"` à la balise `<p>` existante du `.logo-block`. Le contenu texte reste le fallback statique au cas où JS ne s'exécute pas :

```html
<p id="header-subtitle">// Mon plan d'entrainement</p>
```

#### 1b. Modification CSS (bloc `.logo-block p`, L82-88)

Ajoute `white-space: nowrap;` et `overflow: hidden;` au bloc CSS existant `.logo-block p`. Ces deux propriétés empêchent le retour à la ligne sur écran étroit et permettent la détection de débordement par JS :

```css
.logo-block p {
  font-size: 12px;
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 1px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
}
```

#### 1c. Nouvelle fonction JS `updateHeaderSubtitle()`

Déclare cette fonction une seule fois, dans le bloc JS principal (`<script>`), à placer juste avant la fonction `refreshCalendarViews()` (L3033). Vérifie d'abord qu'aucune fonction nommée `updateHeaderSubtitle` n'existe déjà dans le fichier avant de la déclarer.

La logique de calcul des jours restants :
- Récupère `getProgramEndDate()` → si `null`, affiche le fallback statique.
- Calcule `diffDays` = différence en jours calendaires entre `startOfToday()` et la date de fin (en construisant un objet Date minuit pour la date de fin via `new Date(programEnd.getFullYear(), programEnd.getMonth(), programEnd.getDate())`).
- `diffDays = Math.round((programEndDay - startOfToday()) / 86_400_000)`.

Cas limites :
- `diffDays < 0` → texte : `'// COURSE TERMINÉE'`
- `diffDays === 0` → texte : `'// JOUR J · ' + phase.name + ' · SEMAINE ' + activeWeek + '/' + TOTAL_WEEKS`
- `diffDays > 0` → texte plein : `'// J-' + diffDays + ' · ' + phase.name + ' · SEMAINE ' + activeWeek + '/' + TOTAL_WEEKS`

Après avoir assigné le texte plein, vérifie si l'élément déborde sur écran étroit (`el.scrollWidth > el.clientWidth`). Si oui, et si `diffDays >= 0`, remplace par le format compact :
- `diffDays === 0` → `'// JOUR J · ' + phase.name + ' · S' + activeWeek + '/' + TOTAL_WEEKS`
- `diffDays > 0` → `'// J-' + diffDays + ' · ' + phase.name + ' · S' + activeWeek + '/' + TOTAL_WEEKS`

Le format compact substitue uniquement `SEMAINE n/14` par `Sn/14`. Le nom de phase reste intégral dans les deux formats.

```js
function updateHeaderSubtitle() {
  const el = document.getElementById('header-subtitle');
  if (!el) return;
  const programEnd = getProgramEndDate();
  if (!programEnd) {
    el.textContent = '// Mon plan d\'entrainement';
    return;
  }
  const programEndDay = new Date(programEnd.getFullYear(), programEnd.getMonth(), programEnd.getDate());
  const diffDays = Math.round((programEndDay - startOfToday()) / 86_400_000);
  const activeWeek = getCalendarActiveWeekNum();
  const phase = getWeekPhase(activeWeek);

  let full, compact;
  if (diffDays < 0) {
    el.textContent = '// COURSE TERMINÉE';
    return;
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
}
```

#### 1d. Appel au boot (L4877-4882)

Ajoute `updateHeaderSubtitle();` dans la séquence de boot, immédiatement après `renderProgramEndControl();` et avant `buildWeekView(null);` :

```js
takeSnapshotIfNeeded();

renderProgramEndControl();
updateHeaderSubtitle();   // <-- AJOUTER ICI
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```

#### 1e. Appel dans `refreshCalendarViews()` (L3033-3039)

Ajoute `updateHeaderSubtitle();` à la fin du corps de `refreshCalendarViews()` :

```js
function refreshCalendarViews() {
  renderProgramEndControl();
  currentWeekView = getCalendarActiveWeekNum();
  buildWeekView(currentWeekView);
  updateStats();
  buildLoadChart();
  updateHeaderSubtitle();   // <-- AJOUTER ICI
}
```

---

### 2. Feature U5 — Progression dans la phase, vue semaine

Dans `buildWeekView()`, juste après la déclaration `const phase = getWeekPhase(weekNum);` (L3503), ajoute les deux calculs suivants :

```js
const phasePos   = phase.weeks.indexOf(weekNum) + 1;   // position 1-based dans la phase
const phaseTotal = phase.weeks.length;                  // nombre total de semaines dans la phase
```

Modifie ensuite uniquement la ligne du `<span>` dans le `nav.innerHTML` (actuellement L3512) pour inclure la progression :

Avant :
```js
<span>${phase.name} · ${weekDateRange}${isActive ? ' · 📍 CETTE SEMAINE' : ''}</span>
```

Après :
```js
<span>${phase.name} · semaine ${phasePos}/${phaseTotal} · ${weekDateRange}${isActive ? ' · 📍 CETTE SEMAINE' : ''}</span>
```

Pas de nouveau composant, pas de nouveau style CSS. `phasePos` et `phaseTotal` sont des `const` locales déclarées dans le scope de la fonction `buildWeekView`, qui ne contient pas de déclarations homonymes. Vérifie-le avant de déclarer.

---

### 3. Nettoyage statTotal — aucune action requise

Le `id="statTotal"` hardcodé à "20" dans le HTML (L1463) est un placeholder purement cosmétique. `updateStats()` l'écrase immédiatement au boot. Ne touche pas à cette ligne.

---

### 4. Bump de version (à faire EN DERNIER, après validation)

**`index.html` L1443 :** remplace `v4` par `v5` dans le badge :
```html
<small class="app-version">v5</small>
```

**`sw.js` L1 :** remplace `hiplan-v4` par `hiplan-v5` :
```js
const CACHE = 'hiplan-v5';
```

Ces deux modifications sont atomiques et doivent être faites ensemble, uniquement après avoir vérifié que toutes les autres étapes passent (zéro erreur console, plan de test satisfait).

---

## Ce qu'il ne faut PAS faire

- Ne pas ajouter de nouveau bloc HTML dans `.container` (le budget vertical au-dessus de la ligne de flottaison est épuisé).
- Ne pas créer de nouvelle fonction si une fonction existante peut être réutilisée — notamment `getProgramEndDate()`, `startOfToday()`, `getCalendarActiveWeekNum()`, `getWeekPhase()`, `TOTAL_WEEKS`.
- Ne pas redéclarer des variables ou fonctions déjà existantes : `STORE`, `TOTAL_WEEKS`, `WEEK_PHASES`, `completed`, `skipped`, `sessionNotes`, `sessionResults`, `perfResults`, `refreshCalendarViews`, `updateStats`, `buildWeekView`, `saveProgramEndFromInput`.
- Ne pas modifier les valeurs de chaîne des clés dans `STORE` — elles correspondent aux données localStorage existantes des utilisateurs.
- Ne pas modifier `validatePlan()`, `wvToggleDone()`, `wvToggleSkip()`, `openPerfSheet()`, `closePerfSheet()`.
- Ne pas ajouter de dépendance externe (pas de `<script src="...">`, pas de `import`).
- Ne pas créer de fichiers supplémentaires hormis les modifications de `index.html` et `sw.js`.
- Ne pas bumper le badge et le cache SW avant d'avoir validé toutes les fonctionnalités (le bump est la dernière étape).
- Ne pas modifier la logique de `buildRemainingSessionsPanel()` ni du sticky header.
- Ne pas modifier le calcul de `getCalendarActiveWeekNum()` — il est utilisé par de nombreux composants.
- Ne pas utiliser `setInterval` ou `setTimeout` pour mettre à jour le countdown (la mise à jour au boot et à chaque changement de date est suffisante).
- Ne pas toucher au `id="statTotal"` hardcodé à "20" dans le HTML — c'est un placeholder que `updateStats()` écrase au boot, et il n'y a rien à corriger.

---

## Plan de test (à exécuter avant le bump de version)

### T1 — Boot avec date définie

1. Ouvre `index.html` dans un navigateur.
2. Définis une date de fin via le `program-date-panel` (ex : dans 38 jours).
3. Recharge la page.
4. **Vérifie** : le sous-titre du header affiche `// J-38 · [PHASE] · SEMAINE [n]/14` (ou le format compact `S[n]/14` sur 390px), avec le bon nom de phase en majuscules et le bon numéro de semaine.
5. **Vérifie** : le calcul J-X est en jours calendaires entiers depuis minuit aujourd'hui. Pour valider : si la date de fin est demain, le sous-titre doit afficher `J-1`.

### T2 — Boot sans date définie

1. Efface `localStorage.removeItem('hi_tri_program_end')` et `localStorage.removeItem('hi_tri_program_start')` dans la console.
2. Recharge la page.
3. **Vérifie** : le sous-titre affiche `// Mon plan d'entrainement` (fallback statique, aucune erreur console).

### T3 — Mise à jour après modification de la date

1. Avec une date déjà définie, clique sur "modifier la date de fin" dans le `program-date-panel`.
2. Saisis une nouvelle date (ex : dans 10 jours) et valide.
3. **Vérifie** : le sous-titre se met à jour immédiatement sans rechargement de page (`J-10 · ...`).

### T4 — Cas limite J-0 (jour de la course)

1. Dans la console : `localStorage.setItem('hi_tri_program_end', new Date().toISOString().slice(0,10));`
2. Recharge.
3. **Vérifie** : le sous-titre affiche `// JOUR J · [PHASE] · SEMAINE [n]/14`.

### T5 — Cas limite date passée

1. Dans la console : `localStorage.setItem('hi_tri_program_end', '2020-01-01');`
2. Recharge.
3. **Vérifie** : le sous-titre affiche `// COURSE TERMINÉE` (aucune erreur console).

### T6 — Progression de phase dans la vue semaine (les 14 semaines)

Parcours les 14 semaines via les boutons de navigation de la vue semaine et vérifie pour chacune :

| Semaine | Phase attendue | Affichage attendu dans le titre |
|---------|---------------|--------------------------------|
| 1 | BASE AÉROBIE | `BASE AÉROBIE · semaine 1/2` |
| 2 | BASE AÉROBIE | `BASE AÉROBIE · semaine 2/2` |
| 3 | CONSTRUCTION | `CONSTRUCTION · semaine 1/3` |
| 4 | CONSTRUCTION | `CONSTRUCTION · semaine 2/3` |
| 5 | CONSTRUCTION | `CONSTRUCTION · semaine 3/3` |
| 6 | SPÉCIFIQUE | `SPÉCIFIQUE · semaine 1/3` |
| 7 | SPÉCIFIQUE | `SPÉCIFIQUE · semaine 2/3` |
| 8 | SPÉCIFIQUE | `SPÉCIFIQUE · semaine 3/3` |
| 9 | AFFÛTAGE | `AFFÛTAGE · semaine 1/6` |
| 10 | AFFÛTAGE | `AFFÛTAGE · semaine 2/6` |
| 11 | AFFÛTAGE | `AFFÛTAGE · semaine 3/6` |
| 12 | AFFÛTAGE | `AFFÛTAGE · semaine 4/6` |
| 13 | AFFÛTAGE | `AFFÛTAGE · semaine 5/6` |
| 14 | AFFÛTAGE | `AFFÛTAGE · semaine 6/6` |

Chaque ligne doit également contenir la plage de dates et le badge "📍 CETTE SEMAINE" si applicable.

### T7 — Largeur sur mobile 390px

1. Dans les DevTools, passe en mode responsive 390px de large.
2. **Vérifie** : le sous-titre du header ne passe pas sur deux lignes (la propriété `white-space: nowrap` le bloque, et le format compact `S[n]/14` est utilisé si nécessaire).
3. **Vérifie** : la hauteur du header est inchangée par rapport à la version précédente.

### T8 — Vérifications structurelles

1. Ouvre la console du navigateur après un rechargement complet : zéro erreur JS, zéro warning.
2. Dans la console, appelle manuellement `validatePlan()` : aucun warning ne doit apparaître.
3. **Vérifie** : la barre de progression globale (`.progress-global`) est toujours visible et fonctionnelle.
4. **Vérifie** : le header reste sticky au scroll.
5. **Vérifie** : le bloc "Séances restantes" (`#remaining-sessions-panel`) est toujours le premier élément du `.container`.

---

## Format de sortie attendu

Modifie `index.html` en place et `sw.js` en place. Ne crée aucun fichier supplémentaire. Ne retourne aucun résumé ni rapport : la livraison est le fichier modifié, prêt à être ouvert directement dans un navigateur.

Le commit conventionnel associé à ce sprint est :
```
feat: P4+U5 — countdown course en header + progression de phase en vue semaine
```
