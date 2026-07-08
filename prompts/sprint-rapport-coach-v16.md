# Sprint Rapport Coach — v16

## Contexte technique

Le projet HIPLAN est une PWA mono-fichier :
- **Fichier principal :** `C:\Users\vicba\OneDrive\Documents\HIPLAN\index.html` (~8000 lignes, HTML + CSS + JS inline, vanilla JS, aucun framework)
- **Service worker :** `C:\Users\vicba\OneDrive\Documents\HIPLAN\sw.js` — ligne 1 : `const CACHE = 'hiplan-v15';`
- **Badge version dans le HTML :** ligne ~2254 — `<small class="app-version">v15</small>`
- **Toutes les données** sont en localStorage, sans base de données ni serveur

### Variables globales d'état (déclarées, NE PAS re-déclarer)

```js
let completed    = loadStoredState(STORE.completed);   // {[id]: true}
let skipped      = loadStoredState(STORE.skipped);     // {[id]: true}
let sessionNotes = loadStoredState(STORE.notes);       // {[id]: string}
let perfResults  = loadStoredState(STORE.perfResults); // {[id]: {rpe, ...}}
var adapted = {};      // chargé depuis 'hi_tri_adapted_v1'
var checkinData = {};  // chargé depuis 'hi_tri_checkin_v1'
```

> **Attention :** Les notes de séances sont stockées dans `sessionNotes`, PAS dans `notes`. Utiliser `sessionNotes[id]` pour lire la note d'une séance.

### Objet STORE (ligne ~3117 de index.html — NE JAMAIS MODIFIER LES VALEURS)

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
// Clés hors STORE (accès direct) :
// 'hi_tri_adapted_v1'  → {[sessionId]: bool}
// 'hi_tri_checkin_v1'  → {'YYYY-MM-DD': {sleep, legs, energy}}
```

### Constantes et fonctions utilitaires existantes (NE PAS re-déclarer)

```js
const TOTAL_WEEKS = 7;
const RACE_WEEK = 7;
const DEFAULT_PROGRAM_END = '2026-08-23';

// WEEK_PHASES est un tableau, pas un objet :
const WEEK_PHASES = [
  { phase: 1, name: 'BASE AÉROBIE',      weeks: [1, 2] },
  { phase: 2, name: 'CONSTRUCTION 70.3', weeks: [3, 4] },
  { phase: 3, name: 'RÉCUPÉRATION',      weeks: [5] },
  { phase: 4, name: 'AFFÛTAGE',          weeks: [6] },
  { phase: 5, name: 'COURSE',            weeks: [7] },
];

// Pour obtenir le nom de phase d'une semaine :
// WEEK_PHASES.find(p => p.weeks.includes(weekNum))?.name

function getCalendarActiveWeekNum() // retourne 1..TOTAL_WEEKS selon date du jour
function getWeekDateRangeDates(weekNum) // retourne { start: Date, end: Date } ou null
function formatWeekDateRange(start, end) // retourne '6–12 juil. 2026' (format court)
function formatDateShort(date) // retourne '6 juil' (sans point)
function getDiscipline(sessionId) // retourne 'swim'|'bike'|'run'|'str'|'brick'|null
function getProgramEndDate() // retourne Date de fin de programme (utilisé pour date de course)
function safeWrite(key, value) // wrapper sécurisé autour de localStorage.setItem — OBLIGATOIRE

// weeklyPlan : tableau [{weekNum, sessions: [{id, name, dist, ...}]}]
// session.dist = durée en minutes (champ `dist`, unité toujours minutes dans ce plan)
```

### Schema perfResults par discipline

```js
// swim : { rpe, paceS, distM, pctBrasse? }
//   paceS = secondes/100m (convertir en MM:SS)
//   distM = distance en mètres
// bike : { rpe, watts, durationMin, distKm }
// run  : { rpe, paceKmS, distKm }
//   paceKmS = secondes/km (convertir en MM:SS)
// str  : { rpe, chargesNote }
//   chargesNote = texte libre
```

### Structure HTML existante (program-date-panel, lignes ~2285-2300)

```html
<div class="program-date-panel" id="program-date-panel">
  <div class="program-date-copy">
    <div class="program-date-label">Calendrier du programme</div>
    <div class="program-date-status" id="program-date-status">...</div>
  </div>
  <div class="program-date-actions">
    <input type="date" id="programEndInput" ...>
    <button class="primary" id="programEndSaveBtn" onclick="saveProgramEndFromInput()">Valider</button>
    <button id="programEndEditBtn" onclick="enableProgramEndEdit()" style="display:none">✏️ modifier la date de fin</button>
    <button onclick="copyAllSessionNotes()">📋 Copier toutes mes notes</button>
    <button onclick="exportData()">📤 Exporter</button>       ← insérer le nouveau bouton APRÈS celui-ci
    <button onclick="openSnapshotsPanel()">🔒 Sauvegardes</button>
    <button onclick="triggerImport()">📥 Importer</button>
    <input type="file" id="importFileInput" ...>
  </div>
</div>
```

### Fonction exportData existante (lignes ~4889-4899, à titre de référence)

```js
function exportData() {
  const data = { ...collectStateSnapshot(), exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `hiplan-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## Raison du changement

L'utilisateur utilise régulièrement un agent IA triathlon-coach pour affiner son plan d'entraînement. Actuellement, transmettre un bilan au coach nécessite de copier manuellement les notes ou d'exporter le JSON brut (illisible pour un agent-coach). Cette feature génère un fichier Markdown structuré, lisible directement par un LLM, avec toutes les données d'entraînement passées : séances faites/sautées/adaptées, résultats chiffrés par discipline (pace, watts, distance), RPE, check-in hebdomadaires, et notes libres.

---

## Ce qu'il faut implémenter

### 1. Lire le fichier avant de modifier

Avant toute modification, lis `index.html` pour localiser précisément :
- La ligne exacte du badge `<small class="app-version">v15</small>` (environ ligne 2254)
- La ligne exacte du bouton `<button onclick="exportData()">📤 Exporter</button>` (environ ligne 2295)
- La ligne exacte (ou une zone proche après la fonction `exportData`) où insérer la nouvelle fonction `exportCoachReport`
- La ligne 1 de `sw.js` pour confirmer `const CACHE = 'hiplan-v15';`

### 2. Ajouter la fonction `exportCoachReport()`

Déclare la fonction immédiatement après la fonction `exportData()` (environ ligne 4900). La fonction doit :

**2a. Construire l'en-tête du rapport :**

```
# HIPLAN — Rapport Coach
**Généré le:** {date en français long, ex: "8 juillet 2026"}
**Semaine active:** S{activeWeekNum} — {nom de phase}
**Date de course:** 23 août 2026 (J-{nbJours})
**Semaines restantes:** {RACE_WEEK - activeWeekNum} semaine(s) avant course
```

- Date française longue : utiliser `new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })`
- Calcul J-X : `Math.round((raceDate - today) / 86_400_000)` où `raceDate = new Date(2026, 7, 23)` (mois 0-indexé) et `today = startOfToday()`
- Nom de phase : `WEEK_PHASES.find(p => p.weeks.includes(activeWeekNum))?.name`
- "Semaines restantes" : `RACE_WEEK - activeWeekNum` — si <= 0, écrire `"Semaine de course"` à la place

**2b. Itérer sur les semaines 1 à `activeWeekNum` (inclus) :**

Pour chaque semaine `n` de 1 à `Math.min(activeWeekNum, TOTAL_WEEKS)` :

- Récupérer les sessions : `weeklyPlan.find(w => w.weekNum === n)?.sessions || []`
- Récupérer les dates : `getWeekDateRangeDates(n)` → `{ start, end }` → formater avec `formatWeekDateRange(start, end)`
- Compter :
  - `nbDone` = sessions dont `completed[s.id]` est truthy
  - `nbSkipped` = sessions dont `skipped[s.id]` est truthy
  - `nbTotal` = sessions.length

Titre de section :
```
## S{n} — {WEEK_PHASES.find(p => p.weeks.includes(n))?.name} · {plage de dates}
```
Si `n === activeWeekNum`, ajouter ` ← SEMAINE EN COURS` à la fin du titre.

Résumé (ligne suivante, préfixe `>`):
```
> {nbDone}/{nbTotal} séances réalisées · {nbSkipped} sautée(s)
```

Check-in (si disponible) :

La clé de `checkinData` est une date `'YYYY-MM-DD'` (format ISO), PAS un weekNum. Pour trouver les check-ins de la semaine `n`, utilise `getWeekDateRangeDates(n)` pour obtenir les dates de la semaine, puis filtre `checkinData` sur les clés dont la date est dans l'intervalle `[start, end]` de cette semaine. Si au moins un check-in existe pour la semaine, calcule la moyenne de chaque champ et affiche :
```
> Check-in: Sommeil {avg_sleep}/5 · Jambes {avg_legs}/5 · Energie {avg_energy}/5
```
(arrondi à 1 décimale)

Tableau des séances :

```markdown
| Séance | Discipline | Statut | Durée | Résultat | RPE | Note |
|--------|-----------|--------|-------|----------|-----|------|
```

Pour chaque session `s` dans `sessions` :
- **Séance** : `s.id`
- **Discipline** : libellé lisible selon `getDiscipline(s.id)` :
  - `'swim'` → `'Natation'`
  - `'bike'` → `'Vélo'`
  - `'run'` → `'Course'`
  - `'str'` → `'Muscu'`
  - `'brick'` → `'Brick'`
  - autre → valeur brute
- **Statut** :
  - `completed[s.id]` ET `adapted[s.id]` → `'≈ Adapté'`
  - `completed[s.id]` (sans adapté) → `'✓ Fait'`
  - `skipped[s.id]` → `'⊘ Sauté'`
  - semaine en cours ou passée sans statut → `'○ À faire'`
  - semaine future → `'⊡ Pas encore'` (ne devrait pas arriver car on n'itère pas au-delà de activeWeekNum)
- **Durée** : `s.dist + ' min'` (le champ `dist` contient la durée en minutes)
- **Résultat** : selon discipline et perfResults, voir règles ci-dessous
- **RPE** : `perf.rpe + '/10'` ou `'—'` si absent
- **Note** : `sessionNotes[s.id]` ou vide (PAS `notes[s.id]`)

Règles de formatage du champ Résultat :

```js
const perf = perfResults[s.id];
const disc = getDiscipline(s.id);

if (!perf) {
  resultat = '—';
} else if (disc === 'swim') {
  // paceS en secondes → MM:SS
  const paceStr = perf.paceS ? formatSecondsToMMSS(perf.paceS) + '/100m' : '';
  const distStr = perf.distM ? perf.distM + 'm' : '';
  resultat = [distStr, paceStr].filter(Boolean).join(' · ') || '—';
} else if (disc === 'bike') {
  const wStr = perf.watts ? perf.watts + 'W' : '';
  const dStr = perf.distKm ? perf.distKm + 'km' : '';
  resultat = [wStr, dStr].filter(Boolean).join(' · ') || '—';
} else if (disc === 'run') {
  const paceStr = perf.paceKmS ? formatSecondsToMMSS(perf.paceKmS) + '/km' : '';
  const dStr = perf.distKm ? perf.distKm + 'km' : '';
  resultat = [paceStr, dStr].filter(Boolean).join(' · ') || '—';
} else if (disc === 'str') {
  resultat = perf.chargesNote ? perf.chargesNote.slice(0, 60) : '—';
} else {
  resultat = '—';
}
```

Déclare une fonction locale `formatSecondsToMMSS(totalSeconds)` DANS le corps de `exportCoachReport` (ou comme fonction helper déclarée juste avant `exportCoachReport` — vérifier d'abord qu'elle n'existe pas déjà dans le fichier sous ce nom) :

```js
function formatSecondsToMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return m + ':' + String(s).padStart(2, '0');
}
```

**2c. Déclencher le téléchargement :**

```js
const today = startOfToday();
const isoDate = today.toISOString().slice(0, 10);
const blob = new Blob([markdown], { type: 'text/markdown; charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `hiplan-rapport-coach-${isoDate}.md`;
a.click();
URL.revokeObjectURL(url);
```

### 3. Ajouter le bouton dans le HTML

Dans le bloc `<div class="program-date-actions">` (environ ligne 2290), ajouter ce bouton **immédiatement après** `<button onclick="exportData()">📤 Exporter</button>` :

```html
<button onclick="exportCoachReport()">📊 Rapport Coach</button>
```

Ne pas déplacer ni modifier les autres boutons existants.

### 4. Bumper le cache service worker

Dans `sw.js`, ligne 1, remplacer :
```
const CACHE = 'hiplan-v15';
```
par :
```
const CACHE = 'hiplan-v16';
```

### 5. Bumper le badge version dans le HTML

Dans `index.html`, à la ligne contenant `<small class="app-version">v15</small>` (environ ligne 2254), remplacer `v15` par `v16`.

---

## Ce qu'il ne faut PAS faire

- Ne pas re-déclarer `completed`, `skipped`, `sessionNotes`, `perfResults`, `adapted`, `checkinData`, `TOTAL_WEEKS`, `RACE_WEEK`, `DEFAULT_PROGRAM_END`, `WEEK_PHASES`, `getDiscipline`, `formatDateShort`, `getWeekDateRangeDates`, `formatWeekDateRange`, `startOfToday`, `getProgramEndDate`, `safeWrite`, ni aucune autre variable/fonction déjà déclarée dans le fichier
- Ne pas utiliser `localStorage.setItem` directement — cette fonction ne fait aucun write, donc cette règle est N/A ici, mais ne pas l'oublier si un write s'avérait nécessaire
- Ne pas modifier `exportData()`, `collectStateSnapshot()`, ni aucune autre fonction existante
- Ne pas ajouter de fichiers supplémentaires (ni CSS séparé, ni JS séparé, ni module)
- Ne pas introduire de dépendance externe (npm, CDN, framework)
- Ne pas modifier les valeurs de l'objet `STORE` (les clés localStorage sont figées)
- Ne pas lire les notes via `notes[id]` — la variable correcte est `sessionNotes[id]`
- Ne pas accéder à `checkinData` par weekNum directement — les clés sont des dates ISO `'YYYY-MM-DD'`, il faut filtrer par plage de dates
- Ne pas itérer au-delà de `activeWeekNum` (pas de semaines futures dans le rapport)
- Ne pas créer de nouvelle clé localStorage
- Ne pas ajouter de `console.log` de debug dans le code livré

---

## Format de sortie attendu

Modifie `index.html` en place (fichier unique, pas de fichier annexe). Modifie `sw.js` en place.

Les deux seules modifications sont :
1. `index.html` : ajout du bouton HTML + ajout de la fonction `exportCoachReport()` (+ éventuellement `formatSecondsToMMSS` si déclarée séparément) + bump badge version `v15` → `v16`
2. `sw.js` : bump `hiplan-v15` → `hiplan-v16`

Ne pas créer d'autres fichiers.

---

## Critère de succès

Le bouton "Rapport Coach" apparait dans le `program-date-panel`, à droite du bouton "Exporter". Un clic déclenche le téléchargement d'un fichier `hiplan-rapport-coach-YYYY-MM-DD.md`. Ce fichier contient :
- Un en-tête avec la date du jour en français, la semaine active, la date de course et le compte J-X
- Une section `## S{n}` pour chaque semaine de 1 à la semaine active incluse
- Dans chaque section : un résumé (séances faites/total/sautées), le check-in si disponible, et un tableau Markdown avec une ligne par séance indiquant statut, durée, résultats chiffrés, RPE et notes
- Les données affichées correspondent aux vraies données de l'utilisateur stockées en localStorage (pas de données fictives)
