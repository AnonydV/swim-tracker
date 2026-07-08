# Prompt Sprint N1 + N3 — HIPLAN Triathlon Tracker

---

## Contexte technique

### Projet

**HIPLAN** est un tracker d'entraînement triathlon personnel (usage solo, mobile-first, PWA, dark theme).
- **Fichier unique** : `C:\Users\vicba\OneDrive\Documents\HIPLAN\index.html` (~4386 lignes).
- **Stack** : Vanilla JS + HTML + CSS dans un seul fichier. Aucune dépendance externe, aucun framework, aucun build step.
- **Persistance** : `localStorage` exclusivement.
- **Service Worker** : `sw.js` à la racine, cache versionné `hiplan-v2`. Ce sprint ne touche que `index.html` — pas besoin de bumper la version du SW.

### Variables globales déjà déclarées (NE PAS RE-DÉCLARER)

```js
let completed    // { [sessionId]: true } — séances marquées "fait"
let skipped      // { [sessionId]: true } — séances skippées
let sessionNotes // { [sessionId]: string }
let sessionResults // { [sessionId]: string } — résultat texte libre
let perfResults  // { [sessionId]: PerfObject } — données saisies post-séance
const TOTAL_WEEKS = 14
const DISCIPLINE_CONFIG = { swim, bike, run, str, brick }
const WEEK_PHASES = [...]
const weeklyPlan = [...]  // tableau des 14 semaines
```

### Clés localStorage — NE JAMAIS MODIFIER

```js
const STORE = {
  completed:   'hi_swim_tracker_v3',
  skipped:     'hi_swim_skipped_v1',
  notes:       'hi_tri_session_notes_v1',
  results:     'hi_tri_session_results_v1',
  perfResults: 'hi_tri_perf_results_v1',
  programEnd:  'hi_tri_program_end',
  // ...
}
```

### Structure des données de performance (`perfResults[sessionId]`)

Chaque objet peut contenir les champs suivants selon la discipline :

```js
// Toutes disciplines (obligatoire si saisi) :
{ rpe: Number }  // 1–10

// Natation (swim) :
{ rpe, paceS: Number,    // allure /100m en secondes (ex: 115 = 1:55/100m)
       distM: Number,    // distance réelle en mètres
       pctBrasse: Number // 0–50 (slider x2 = vrai %) }

// Vélo (bike) :
{ rpe, watts: Number,       // watts moyens
       durationMin: Number, // durée réelle en minutes
       distKm: Number }

// Run :
{ rpe, paceKmS: Number,  // allure /km en secondes (ex: 242 = 4:02/km)
       distKm: Number }

// Muscu (str) :
{ rpe, chargesNote: String }  // texte libre
```

### Fonctions existantes à réutiliser (ne pas re-implémenter)

| Fonction | Ligne ~| Usage |
|---|---|---|
| `getDiscipline(sessionId)` | L2789 | Retourne `'swim'|'bike'|'run'|'str'|'brick'` — gère le cas `brw` avant `bw` |
| `getWeekSummary(weekNum)` | L4121 | Retourne `{ done, total, minutesByDiscipline, avgRpe, hardestSession }` |
| `getWeekPhase(weekNum)` | L3007 | Retourne `{ phase: 1|2|3|4, name, weeks }` |
| `getCalendarActiveWeekNum()` | ~L2877 | Semaine calendaire active (1–14) |
| `getWeekSessions(weekNum)` | L2996 | Retourne `{ swim:[], bike:[], run:[], str:[], brick:[] }` |
| `validatePlan()` | L2714 | Garde anti-régression — run au boot |
| `refreshCalendarViews()` | L2910 | Appelle `buildLoadChart()` en fin |
| `buildLoadChart()` | L2918 | Construit le SVG `#load-chart-svg` (barres charge planifiée) |

### `DISCIPLINE_CONFIG` (L2781-2787)

```js
const DISCIPLINE_CONFIG = {
  swim:  { label: 'Natation', emoji: '🏊', color: 'swim',  accent: '#38bdf8', prefix: 'sw'  },
  bike:  { label: 'Vélo',     emoji: '🚴', color: 'bike',  accent: '#facc15', prefix: 'bw'  },
  run:   { label: 'Running',  emoji: '🏃', color: 'run',   accent: '#a3e635', prefix: 'rw'  },
  str:   { label: 'Muscu',    emoji: '💪', color: 'str',   accent: '#c084fc', prefix: 'mw'  },
  brick: { label: 'Brick',    emoji: '🧱', color: 'brick', accent: '#fb923c', prefix: 'brw' },
};
```

### Structure HTML existante pertinente (L1369-1399)

```html
<!-- Charge planifiée — NE PAS MODIFIER la structure HTML -->
<div id="load-chart-panel" class="load-chart-panel">
  <div class="load-chart-header">
    <span class="load-chart-title">Charge Run — 14 semaines</span>
    <!-- légende phases -->
  </div>
  <svg id="load-chart-svg" width="100%" height="130" style="display:block; overflow:visible"></svg>
</div>

<!-- Progression — HTML DÉJÀ EXISTANT — NE PAS RE-CRÉER ni déplacer -->
<div id="progression-panel" class="load-chart-panel">
  <div class="load-chart-header">
    <span class="load-chart-title">Progression</span>
    <div id="prog-chips" style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="prog-chip" data-disc="swim" onclick="buildProgressionPanel('swim')" ...>Nat</button>
      <button class="prog-chip" data-disc="bike" onclick="buildProgressionPanel('bike')" ...>Vélo</button>
      <button class="prog-chip" data-disc="run"  onclick="buildProgressionPanel('run')"  ...>Run</button>
      <button class="prog-chip" data-disc="str"  onclick="buildProgressionPanel('str')"  ...>Muscu</button>
    </div>
  </div>
  <div id="progression-chart-area" style="min-height:80px;display:flex;align-items:center;justify-content:center"></div>
</div>

<!-- Tooltip progression — DÉJÀ EXISTANT -->
<div id="prog-tooltip" style="display:none;position:fixed;...z-index:300;pointer-events:none;..."></div>

<div id="plan"></div>
```

### Système de coordonnées SVG de `buildLoadChart` (L2918-2977)

```js
const H    = 130
const padL = 4, padR = 4, padT = 18, padB = 22
const chartH = H - padT - padB  // = 90 px
const n    = weeks.length        // = 14
const barW = Math.max(6, Math.floor(chartW / n) - 3)
const step = (chartW - barW) / (n - 1)
// Centre X de la barre de la semaine i (0-indexé) :
//   cx = padL + i * step + barW / 2
// Sommet Y d'une valeur val :
//   y = padT + chartH - Math.round((val / maxVal) * chartH)
```

### Séquence d'initialisation actuelle (fin du `<script>`)

```js
renderProgramEndControl();
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```

### CSS déjà disponible — classes réutilisables

- `.load-chart-panel` : card dark avec border-radius 12px
- `.load-chart-header` / `.load-chart-title` : header avec titre monospace
- Variables CSS : `--bg`, `--bg2`, `--surface`, `--card`, `--border`, `--text`, `--muted`, `--muted2`, `--green`, `--red`, `--accent`, `--p1`, `--p2`, `--p3`
- Polices : `'JetBrains Mono'` (données numériques), `'Outfit'` (texte UI), `'DM Sans'`

---

## Raison du changement

**N1 — Graphes de progression réelle par discipline :**
L'utilisateur saisit depuis plusieurs semaines ses performances post-séance (allure, watts, RPE) dans la feuille de perf. Ces données sont stockées dans `localStorage` (`hi_tri_perf_results_v1`) mais ne sont jamais re-visualisées. L'objectif est de les afficher sous forme de courbe d'évolution par discipline — voir sa 4×5min passer de 4:10 à 4:02 sur 6 semaines est la preuve de progression qui motive la poursuite de l'entraînement.

**N3 — Charge hebdomadaire vécue (RPE × durée) :**
Le graphe de charge planifiée (barres dans `#load-chart-svg`) montre ce qui était prévu, mais pas ce qui a été réellement ressenti. Une semaine "légère sur le papier" peut être très dure si l'athlète était fatigué, et vice versa. Superposer la charge vécue (somme RPE × minutes, par semaine) permet de distinguer une vraie semaine de récupération d'une semaine subie, et de prévenir la surcharge.

---

## Lecture obligatoire avant tout code

Avant d'écrire une seule ligne, lis les sections suivantes de `index.html` :

1. **L2781–2800** : `DISCIPLINE_CONFIG` et `WEEK_PHASES`
2. **L2918–2977** : fonction `buildLoadChart()` — comprendre le système de coordonnées SVG existant
3. **L4000–4043** : fonction `submitPerfSheet()` — comprendre exactement quels champs sont écrits dans `perfResults` par discipline
4. **L4121–4158** : fonction `getWeekSummary(weekNum)` — comprendre sa boucle interne et son objet retour
5. **L1383–1399** : HTML du panneau progression — confirmer que le skeleton existe déjà

---

## Ce qu'il faut implémenter

### Étape 0 — Vérification anti-doublons (obligatoire)

Avant d'ajouter une seule déclaration `const`, `let`, `function` ou `class`, effectue une recherche textuelle dans `index.html` pour vérifier qu'aucun identifiant du même nom n'existe déjà. Les noms introduits par ce sprint sont : `buildLineChart`, `buildProgressionPanel`, `showProgTooltip`, `hideProgTooltip`. Vérifie que ces quatre noms sont absents du fichier avant de les déclarer.

---

### Étape 1 — Helper partagé `buildLineChart(svgEl, points, opts)`

Crée une fonction nommée **`buildLineChart`**, placée juste avant `buildLoadChart` dans le fichier (environ L2917).

**Signature :**
```js
function buildLineChart(svgEl, points, opts) { ... }
```

**Paramètres :**
- `svgEl` : un élément `SVGElement` déjà dans le DOM (le dessin est ajouté via `svgEl.innerHTML +=` ou `insertAdjacentHTML`)
- `points` : tableau d'objets `{ x: Number, y: Number, rawValue: any, tooltipText: String }` en coordonnées SVG déjà calculées par l'appelant
- `opts` : objet de configuration :
  ```js
  {
    color: String,          // couleur du trait et des points (ex: '#a3e635')
    dashed: Boolean,        // si true : stroke-dasharray="4 3"
    showDots: Boolean,      // true par défaut
    dotRadius: Number,      // rayon des cercles, 4 par défaut
    onDotTap: Function|null, // callback(pt, event) appelé au clic/touchstart sur un point
    badge: { text: String } | null  // si fourni, affiche un label texte au dernier point
  }
  ```

**Comportement :**
1. Si `points.length === 0`, retourner immédiatement sans dessiner.
2. Si `points.length === 1`, dessiner uniquement un point.
3. Construire une chaîne `polyline` avec les coordonnées x,y de tous les points :
   - `stroke` = `opts.color`, `stroke-width="2"`, `fill="none"`
   - Si `opts.dashed` = true, ajouter `stroke-dasharray="4 3"`
4. Pour chaque point (si `opts.showDots` !== false) : dessiner un `<circle>` de rayon `opts.dotRadius` (ou 4), rempli de `opts.color`.
   - Chaque cercle doit avoir un attribut `style="cursor:pointer"` et les handlers event suivants (inline via la chaîne SVG) :
     - `onclick` et `ontouchstart` appelant une fonction nommée `__hlcTap(event, pointIndex)` — voir point 5 ci-dessous.
5. Les handlers tap sur les points : la fonction `buildLineChart` ne peut pas référencer `opts.onDotTap` directement dans les attributs HTML inline du SVG. Utiliser l'approche suivante : stocker les données de points dans un attribut `data-` sur le SVG parent, et gérer les taps via un unique listener d'événement ajouté sur `svgEl` (une seule fois, via `svgEl.dataset.hasLineChartListener !== '1'`).
6. Si `opts.badge` est fourni, afficher un `<text>` SVG au niveau du dernier point (coordonnées du dernier élément de `points`) :
   - Texte = `opts.badge.text`
   - `font-family="'Outfit',sans-serif"`, `font-size="9"`, `fill="opts.color"`, `opacity="0.8"`
   - Positionné légèrement au-dessus et à droite du dernier point.
7. La fonction concatène tout dans une variable `let out = ''` et appelle `svgEl.insertAdjacentHTML('beforeend', out)` — elle AJOUTE au SVG existant, sans effacer son contenu. L'appelant est responsable de nettoyer le SVG si nécessaire.

**Important** : `buildLineChart` ne connaît pas les données métier. Elle reçoit uniquement des coordonnées SVG pré-calculées. Toute logique de normalisation et de filtrage est dans l'appelant.

---

### Étape 2 — Étendre `getWeekSummary(weekNum)` pour N3

Modifie la fonction `getWeekSummary` (L4121) pour ajouter le calcul de la **charge vécue hebdomadaire** sans changer la logique existante.

**Modification :**
1. Ajoute une variable `let weeklyLoad = 0` juste après les déclarations existantes (`let rpeSum = 0, rpeCount = 0` etc.).
2. Dans la boucle `sessions.forEach`, à l'intérieur du bloc `if (completed[s.id])`, après la lecture du RPE (`const perf = perfResults[s.id]`), ajoute :
   ```js
   if (perf && perf.rpe) {
     weeklyLoad += perf.rpe * (s.dist || 0);
   }
   ```
   Ce calcul est distinct du `rpeSum` existant (qui sert à l'avgRpe) — les deux doivent coexister.
3. Dans l'objet retourné (vers L4151), ajoute `weeklyLoad` comme nouveau champ :
   ```js
   return {
     done,
     total,
     minutesByDiscipline,
     avgRpe: rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : null,
     hardestSession,
     weeklyLoad  // <-- ajouté
   };
   ```
4. Assure-toi que la valeur par défaut dans le return précoce (quand `!week`, première ligne de la fonction) inclut aussi `weeklyLoad: 0`.

---

### Étape 3 — N3 : Overlay charge vécue dans `buildLoadChart()`

Modifie la fonction `buildLoadChart` (L2918) pour superposer une courbe en pointillé représentant la charge vécue.

**Modifications à apporter, APRÈS la boucle `weeks.forEach` existante et AVANT `svg.innerHTML = out` :**

1. Calcule la charge vécue pour chaque semaine en appelant `getWeekSummary(w.weekNum).weeklyLoad` pour chaque élément de `weeks`.
2. Stocke les résultats dans un tableau `veucuLoads = [Number, ...]` de longueur 14.
3. Calcule `maxVecu = Math.max(...veucuLoads.filter(v => v > 0))`. Si `maxVecu === 0` (aucun RPE saisi nulle part), sauter l'overlay sans erreur.
4. Construis les points SVG pour la courbe vécue : pour chaque semaine `i` où `veucuLoads[i] > 0` :
   - `cx = padL + i * step + barW / 2`
   - `cy = padT + chartH - Math.round((veucuLoads[i] / maxVecu) * chartH)`
   - Construis un tableau `veucuPoints = [{ x: cx, y: cy, rawValue: veucuLoads[i], tooltipText: `S${i+1} — charge vécue ${veucuLoads[i]}` }, ...]`
   - **N'inclure que les semaines où `veucuLoads[i] > 0`** (semaines sans RPE saisi sont ignorées).
5. Si `veucuPoints.length > 0`, appelle `buildLineChart(svg, veucuPoints, { color: '#e2eaf4', dashed: true, showDots: true, dotRadius: 3, onDotTap: null, badge: { text: 'VÉCU' } })`.
   - Note : à ce stade, `svg.innerHTML = out` n'a pas encore été appelé, donc `svg` est vide. Il faut réorganiser l'ordre : définir `out` pour les barres → écrire `svg.innerHTML = out` → PUIS appeler `buildLineChart(svg, veucuPoints, ...)` pour ajouter l'overlay. Ne pas inverser cet ordre.
6. **Réorganise la fin de `buildLoadChart`** pour que l'ordre soit :
   ```
   1. Construire out (barres + labels)
   2. svg.innerHTML = out         // écrit les barres
   3. Calculer veucuPoints        // si données existent
   4. buildLineChart(svg, ...)    // ajoute l'overlay sur les barres
   ```

**Couleur et style de la courbe vécue :**
- Couleur : `#e2eaf4` (blanc cassé neutre, lisible sur toutes les couleurs de phase)
- Trait pointillé : `stroke-dasharray="4 3"`
- Dots : rayon 3
- Badge "VÉCU" au dernier point (opacité 0.8)
- Aucune légende textuelle ajoutée au panel — le badge suffit.

---

### Étape 4 — N1 : Fonction `buildProgressionPanel(disc)`

Crée la fonction `buildProgressionPanel(disc)`, placée juste après `buildLineChart` dans le fichier.

Cette fonction est appelée par les chips HTML existants (onclick déjà présents dans le HTML). Elle ne doit **pas** modifier le HTML du panel `#progression-panel`, seulement le contenu de `#progression-chart-area`.

#### 4a. Collecte des points de données

Pour la discipline `disc`, itère sur `weeklyPlan` (semaine 1 à 14, dans l'ordre) puis sur chaque session de la semaine :
- Utilise `getDiscipline(s.id) === disc` pour filtrer.
- Vérifie `completed[s.id] === true`.
- Récupère `const perf = perfResults[s.id]`.
- Extrait la **métrique principale** selon la discipline :
  - `swim` → `perf.paceS` (Number, secondes/100m — **only si > 0**)
  - `bike` → `perf.watts` (Number — **only si > 0**)
  - `run` → `perf.paceKmS` (Number, secondes/km — **only si > 0**)
  - `str` → `perf.rpe` (Number 1–10)
- Si la métrique est `undefined`, `null`, ou `0` : exclure cette session des points.
- Pour chaque point retenu : stocker `{ sessionId: s.id, weekNum: w.weekNum, value: metricValue, perf }`.

#### 4b. État vide

Si aucun point n'est collecté pour la discipline, injecter dans `#progression-chart-area` :
```html
<span style="color:var(--muted);font-size:13px;font-family:'Outfit',sans-serif;">
  Aucune donnée — saisis tes performances après chaque séance
</span>
```
Et mettre à jour la surbrillance des chips (voir 4e). Retourner.

#### 4c. Calcul des coordonnées SVG

```js
const area = document.getElementById('progression-chart-area');
area.style.display = 'block';  // override le flex initial
const W = area.clientWidth || 340;
const H = 110;
const padL = 28, padR = 12, padT = 12, padB = 20;
const chartW = W - padL - padR;
const chartH = H - padT - padB;

const values = dataPoints.map(p => p.value);
const minV = Math.min(...values);
const maxV = Math.max(...values);
const range = maxV - minV || 1;

// Métriques d'allure (pace) : valeur basse = meilleure performance = haut du graphe
const isPace = (disc === 'run' || disc === 'swim');

const svgPoints = dataPoints.map((p, i) => {
  const xNorm = dataPoints.length > 1 ? i / (dataPoints.length - 1) : 0.5;
  const x = padL + xNorm * chartW;
  const yNorm = isPace
    ? (p.value - minV) / range        // valeur haute (lente) = bas du graphe
    : 1 - (p.value - minV) / range;   // valeur haute (meilleure) = haut du graphe
  const y = padT + yNorm * chartH;
  const tooltipText = formatMetricLabel(disc, p.value, p.perf);
  return { x, y, rawValue: p.value, weekNum: p.weekNum, tooltipText };
});
```

Crée une fonction locale `formatMetricLabel(disc, value, perf)` qui retourne une chaîne lisible :
- `swim` : `mm:ss /100m` (convertir `value` secondes en mm:ss) + optionnellement ` · ${perf.pctBrasse}% br.` si `perf.pctBrasse` est défini
- `bike` : `${value} W`
- `run` : `mm:ss /km` (convertir `value` secondes en mm:ss)
- `str` : `RPE ${value}`

Fonction de conversion secondes → mm:ss :
```js
function secondsToMmss(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}
```
Vérifie que `secondsToMmss` n'existe pas déjà dans le fichier avant de la déclarer.

#### 4d. Création du SVG et appel de `buildLineChart`

```js
const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgEl.setAttribute('width', '100%');
svgEl.setAttribute('height', String(H));
svgEl.style.cssText = 'display:block;overflow:visible';
svgEl.id = 'prog-line-svg';  // id stable pour éviter les orphelins

area.innerHTML = '';
area.appendChild(svgEl);

const color = DISCIPLINE_CONFIG[disc]?.accent || '#e2eaf4';

buildLineChart(svgEl, svgPoints, {
  color,
  dashed: false,
  showDots: true,
  dotRadius: 5,
  onDotTap: (pt, event) => showProgTooltip(pt, event),
  badge: null
});
```

#### 4d bis. Labels axe Y (min / max valeurs)

Ajoute via `svgEl.insertAdjacentHTML('beforeend', ...)` deux labels texte SVG sur l'axe gauche :
- Valeur maximale en haut (`y = padT`) : formatée avec `formatMetricLabel(disc, maxV, {})`
- Valeur minimale en bas (`y = padT + chartH`) : formatée avec `formatMetricLabel(disc, minV, {})`
- `x = padL - 4`, `text-anchor="end"`, `font-family="'JetBrains Mono',monospace"`, `font-size="8"`, `fill="var(--muted)"`

Pour les métriques d'allure (isPace = true) : la valeur `minV` (la meilleure allure) est en haut et `maxV` (la moins bonne) est en bas — indiquer cela en inversant les labels.

#### 4e. Surbrillance du chip actif

Après le rendu du graphe :
```js
document.querySelectorAll('.prog-chip').forEach(btn => {
  btn.style.opacity = btn.dataset.disc === disc ? '1' : '0.5';
});
```

#### 4f. Tooltip au tap (fonctions `showProgTooltip` / `hideProgTooltip`)

Crée deux fonctions nommées `showProgTooltip(pt, event)` et `hideProgTooltip()` :

```js
function showProgTooltip(pt, event) {
  const tip = document.getElementById('prog-tooltip');
  if (!tip) return;
  const x = (event.touches ? event.touches[0].clientX : event.clientX);
  const y = (event.touches ? event.touches[0].clientY : event.clientY);
  tip.textContent = `S${pt.weekNum} — ${pt.tooltipText}`;
  tip.style.display = 'block';
  tip.style.left = Math.min(x + 12, window.innerWidth - 240) + 'px';
  tip.style.top  = Math.max(y - 44, 8) + 'px';
}

function hideProgTooltip() {
  const tip = document.getElementById('prog-tooltip');
  if (tip) tip.style.display = 'none';
}
```

Ajoute un listener `document.addEventListener('click', hideProgTooltip)` **une seule fois**, à la fin du bloc d'initialisation du script (après `buildWeeklyRecap()`), avec la garde `if (!document._progTooltipListenerAdded) { document._progTooltipListenerAdded = true; document.addEventListener('click', hideProgTooltip); }`.

---

### Étape 5 — N1 : Ajustements CSS pour le sélecteur de discipline

Dans la section `<style>` du fichier, ajoute les règles suivantes pour le sélecteur de chips :

```css
/* ─── PROGRESSION PANEL ─── */
#prog-chips {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  flex-wrap: nowrap !important;
  padding-bottom: 4px;
}
.prog-chip {
  scroll-snap-align: start;
  flex-shrink: 0;
  min-height: 44px;    /* touch target minimum */
  white-space: nowrap;
}
```

Note : les chips ont des styles inline dans le HTML. Le `min-height: 44px` via CSS override les `min-height:32px` inline grâce à la spécificité de classe. Ne pas modifier les styles inline du HTML.

---

### Étape 6 — Séquence d'initialisation

La séquence d'init existante (fin du `<script>`) est :
```js
renderProgramEndControl();
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```

**Aucun appel à `buildProgressionPanel` n'est nécessaire au boot** — la fonction est appelée par les chips (onclick déjà en place). Le panneau `#progression-chart-area` reste vide (état par défaut avec le flex centering existant) jusqu'au premier tap.

**Ne pas modifier la séquence d'init.** Ne pas ajouter de nouvel appel.

---

## Ce qu'il ne faut PAS faire

- Ne pas dupliquer ni modifier `buildLoadChart` — l'étendre en place uniquement.
- Ne pas créer de fichiers supplémentaires (pas de `.js`, `.css` séparé).
- Ne pas ajouter de dépendances npm, CDN, ou bibliothèques externe.
- Ne pas modifier les clés `STORE.*` du localStorage.
- Ne pas re-créer le HTML du `#progression-panel` — il existe déjà aux lignes L1383-1397 et doit rester intact.
- Ne pas déclarer `buildLineChart`, `buildProgressionPanel`, `showProgTooltip`, `hideProgTooltip`, ou `secondsToMmss` si l'un de ces noms existe déjà dans le fichier — vérifier d'abord.
- Ne pas modifier `wvToggleDone`, `wvToggleSkip`, `openPerfSheet`, `closePerfSheet`, `submitPerfSheet`, `validatePlan`, `updateStats` (hors `getWeekSummary` décrite à l'Étape 2).
- Ne pas toucher au service worker `sw.js`.
- Ne pas utiliser `Array.prototype.find` ou d'autres méthodes polyfill-dépendantes — elles fonctionnent déjà dans le projet, simplement vérifier la cohérence.
- Ne pas créer une variable `PHASE_COLORS` globale — elle est déjà déclarée **localement** dans `buildLoadChart` et doit rester là.
- Ne pas utiliser `startsWith` manuellement pour détecter une discipline — utiliser exclusivement `getDiscipline(sessionId)`.
- Ne pas écrire dans `localStorage` pour N1 ou N3 — ces features sont read-only sur les données existantes.
- Ne pas faire déborder horizontalement le contenu sur mobile (vérifier à 390px de large).
- Ne pas ajouter de légende textuelle au graphe N3 — le badge "VÉCU" au dernier point est suffisant.

---

## Critères d'acceptation

### Fonctionnels

1. **N1 — Chip "Run" tapé avec des données** : `buildProgressionPanel('run')` affiche une courbe SVG avec un point par séance de run ayant `paceKmS > 0` dans `perfResults`. Les points sont en ordre chronologique (semaine croissante). La valeur la plus récente est à droite. Les allures meilleures (plus petites en secondes) sont plus hautes sur le graphe.

2. **N1 — Chip "Vélo" tapé avec des données** : courbe de watts affichée. Valeur la plus haute = haut du graphe.

3. **N1 — Chip "Natation" tapé avec des données** : courbe de paceS (/100m) affichée. Meilleures allures (plus petites) plus hautes.

4. **N1 — Chip "Muscu" tapé avec des données** : courbe RPE affichée.

5. **N1 — Tap sur un point** : le tooltip `#prog-tooltip` apparaît avec la valeur formatée et le numéro de semaine. Un second tap ailleurs le cache.

6. **N1 — État vide** : si aucune perf saisie pour une discipline, le message "Aucune donnée..." s'affiche au lieu d'un graphe vide ou d'une erreur.

7. **N3 — Courbe vécue** : si au moins une semaine a `weeklyLoad > 0`, une courbe en pointillé blanc cassé est superposée aux barres du graphe de charge planifiée. Le badge "VÉCU" est visible au dernier point de la courbe.

8. **N3 — Pas de courbe si aucun RPE saisi** : si `perfResults` est vide ou si aucune séance n'a de RPE, les barres s'affichent normalement sans overlay ni erreur.

9. **Non-régression** : le graphe de charge planifiée (barres colorées par phase, label semaines, dot semaine active) reste identique à l'état actuel.

### Qualité

10. **Chargement sans erreur console** : aucune erreur JavaScript au boot, y compris avec `localStorage` vide.

11. **`validatePlan()` sans warning** : aucun nouveau warning émis.

12. **Mobile-first** : sur écran 390px de large, aucun débordement horizontal, tap targets chips ≥ 44px de hauteur, graphes lisibles.

13. **Pas de doublon de déclaration** : aucun `Identifier X has already been declared` en console.

---

## Plan de test manuel

Effectue ces tests dans cet ordre avant de commiter :

| # | Action | Résultat attendu |
|---|---|---|
| T1 | Ouvrir l'app avec `localStorage` entièrement vide | Chargement sans erreur, progression panel vide, graphe charge sans overlay |
| T2 | Taper chip "Run" | Message "Aucune donnée..." affiché |
| T3 | Taper chip "Vélo" | Message "Aucune donnée..." affiché |
| T4 | Marquer une séance run comme "Fait" avec RPE=7 et paceKmS=242 saisis | Taper chip "Run" → un seul point visible sur le graphe |
| T5 | Ajouter des perfs sur 3 autres séances run (semaines différentes) | Courbe run visible avec 4 points, ordre chronologique |
| T6 | Taper sur un point du graphe run | Tooltip avec "S{n} — 4:02 /km" visible |
| T7 | Taper ailleurs sur l'écran | Tooltip caché |
| T8 | Marquer une séance bike avec watts=220 | Chip Vélo → courbe watts affichée |
| T9 | Marquer des séances sur plusieurs semaines avec RPE | Graphe de charge : barres planifiées intactes + courbe vécue en pointillé blanc avec badge "VÉCU" |
| T10 | Réduire la fenêtre à 390px | Aucun débordement horizontal, chips scrollables |
| T11 | Console.log("validatePlan") | Aucun warning nouveau |
| T12 | Naviguer entre les semaines (flèches) | Graphe charge se re-render correctement avec l'overlay |

---

## Format de sortie attendu

1. Modifie **uniquement** `index.html` en place.
2. N'ajoute aucun autre fichier.
3. Les modifications doivent être localisées dans les zones suivantes du fichier :
   - Section `<style>` : ajout des règles CSS `#prog-chips` et `.prog-chip`
   - Section `<script>`, avant `buildLoadChart` (~L2917) : insertion de `buildLineChart`
   - Section `<script>`, après `buildLineChart` : insertion de `buildProgressionPanel`, `showProgTooltip`, `hideProgTooltip`
   - Après `buildLineChart` et avant le reste du fichier : optionnellement `secondsToMmss` si elle n'existe pas
   - Fonction `getWeekSummary` (L4121) : ajout du champ `weeklyLoad`
   - Fonction `buildLoadChart` (L2918) : ajout de l'overlay vécue en fin de fonction
   - Fin du script : ajout du listener `hideProgTooltip` avec garde
4. Une fois les modifications terminées, effectue un commit git avec le message : `feat: N1+N3 — graphes progression réelle par discipline + overlay charge vécue`
