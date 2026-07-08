# SPRINT P3 — Snapshots localStorage rotatifs + restauration sécurisée

---

## Contexte technique

### Fichier cible
Un seul fichier : `index.html` à la racine du projet HIPLAN (4637 lignes au moment de la rédaction de ce prompt). Ce fichier contient l'intégralité du HTML, du CSS (`<style>`) et du JavaScript (`<script>`). Il ne doit pas être découpé en fichiers supplémentaires.

Contraintes absolues :
- Vanilla JS uniquement. Zéro framework, zéro bibliothèque externe, zéro import ES module.
- Aucun fichier supplémentaire sauf `sw.js` (déjà existant, à modifier à la fin).
- Aucune dépendance npm, pas de build step.

### Structure du fichier
- Lignes 1–17 : `<head>` avec meta, liens fonts.
- Lignes 18–37 : `:root` avec toutes les CSS custom properties (dark theme).
- Lignes 38–1422 : CSS et HTML du body (panneaux, sections, composants).
- Ligne 1343 : badge de version dans le `<h1>` : `<small class="app-version">v3</small>`.
- Lignes 1373–1387 : `<div class="program-date-panel" id="program-date-panel">` — panneau utilitaire avec les boutons Exporter/Importer. C'est ICI qu'on ajoutera le bouton "Sauvegardes".
- Ligne 1424 : ouverture du `<script>` principal (tout le JS est inline).
- Lignes 2735–2750 : fonction `validatePlan()` (valide les IDs de séances du plan, ne toucher à rien dans cette zone).
- Lignes 2755–2764 : objet `STORE` (constante globale des clés localStorage).
- Lignes 2766–2784 : fonctions `loadStoredState()` + chargement initial des variables d'état.
- Lignes 3744–3763 : fonction `exportData()` — logique de collecte des données à FACTORISER.
- Lignes 3765–3768 : fonction `triggerImport()`.
- Lignes 3770–3802 : fonction `importData(event)` — où injecter un déclencheur snapshot AVANT l'import.
- Lignes 3825–3845 : fonction `showToast(state)` — à étendre avec les nouveaux états snapshot.
- Lignes 4592–4610 : injection HTML du bottom sheet bilan hebdo (`#weekly-recap-sheet`). Modèle de référence pour l'injection de la liste de sauvegardes.
- Lignes 4611–4633 : séquence de boot en scope global (s'exécute à l'interprétation du script) : `renderProgramEndControl()` → `buildWeekView(null)` → `updateStats()` → `validatePlan()` → `buildLoadChart()` → `buildWeeklyRecap()` → enregistrement du service worker.

### État localStorage — clés exactes via l'objet STORE
```js
const STORE = {
  completed:        'hi_swim_tracker_v3',    // ligne 2756
  skipped:          'hi_swim_skipped_v1',    // ligne 2757
  notes:            'hi_tri_session_notes_v1',    // ligne 2758
  results:          'hi_tri_session_results_v1',  // ligne 2759
  perfResults:      'hi_tri_perf_results_v1',     // ligne 2760
  programEnd:       'hi_tri_program_end',          // ligne 2761
  weeklyRecapShown: 'hi_tri_weekly_recap_shown_w', // ligne 2763
  // <-- tu ajouteras ici : snapshots: 'hi_tri_snapshots'
};
```
La nouvelle clé snapshots aura pour valeur littérale `'hi_tri_snapshots'`.

### Variables d'état JS (déclarées avec `let`, lignes 2776–2780)
```js
let completed    = loadStoredState(STORE.completed);
let skipped      = loadStoredState(STORE.skipped);
let sessionNotes = loadStoredState(STORE.notes);
let sessionResults = loadStoredState(STORE.results);
let perfResults  = loadStoredState(STORE.perfResults);
```
Ces noms sont déjà pris — ne jamais les redéclarer.

### CSS custom properties disponibles (`:root`, lignes 18–37)
```
--bg: #07090f       --bg2: #0d1117      --surface: #111827
--card: #131d2e     --border: #1c2d44   --accent: #38bdf8
--green: #4ade80    --orange: #fb923c   --red: #f87171
--text: #e2eaf4     --muted: #5a7a99    --muted2: #3a5570
--accent-dim: rgba(56,189,248,0.12)
```

### Styles du `program-date-panel` (lignes 802–816)
Les boutons dans `.program-date-actions` ont par défaut : fond `var(--bg2)`, bordure `var(--border)`, texte `var(--muted)`. Au hover : bordure et texte `var(--accent)`. La classe `.primary` utilise `var(--accent-dim)` comme fond et `var(--accent)` comme couleur. Le bouton "Sauvegardes" doit hériter de ce style par défaut sans classe `.primary`.

### Patterns existants à réutiliser
- `showToast(state)` (ligne 3825) : prend une clé string et branche sur des messages/couleurs prédéfinis.
- Bottom sheet hebdomadaire (`#weekly-recap-sheet` / `#weekly-recap-backdrop`, lignes 4592–4610) : modèle de référence pour l'injection HTML du panneau liste des sauvegardes.
- Pas de modal existante dans le fichier — il faut en créer une minimale.

### Service worker
Fichier `sw.js` à la racine. Ligne 1 : `const CACHE = 'hiplan-v3';`. À bumper en `'hiplan-v4'` lors du bump de version finale.

---

## Raison du changement

Les 14 semaines de données d'entraînement vivent exclusivement dans le `localStorage` du navigateur, sans back-end ni synchronisation cloud. Un nettoyage de navigateur, un bug lors d'un import de fichier, ou une fausse manipulation peuvent effacer irrémédiablement l'historique complet. Cette feature crée un filet de sécurité autonome : des snapshots automatiques en anneau de 3, restaurables depuis l'interface, sans dépendance réseau.

---

## Ce qu'il faut implémenter

### Étape 1 — Ajouter la clé snapshots dans STORE

Dans l'objet `STORE` (ligne 2763, après `weeklyRecapShown`), ajoute :
```js
snapshots: 'hi_tri_snapshots',
```

### Étape 2 — Factoriser la collecte d'état en `collectStateSnapshot()`

La fonction `exportData()` (ligne 3744) contient la logique de collecte des données. Extrait cette logique dans une nouvelle fonction `collectStateSnapshot()` placée AVANT `exportData()`. Cette fonction doit :
- Lire les mêmes clés que l'actuelle `exportData()` : `STORE.completed`, `STORE.skipped`, `STORE.notes`, `STORE.results`, `STORE.perfResults`, `STORE.programEnd`.
- Retourner un objet `{ version: 1, completed, skipped, notes, results, perfResults, programEnd }` — sans `exportedAt` (le timestamp sera géré par la couche snapshot).
- Ne PAS inclure `STORE.snapshots` dans la collecte (interdit — cf. contraintes).

Après extraction, modifie `exportData()` pour qu'elle appelle `collectStateSnapshot()` au lieu de répliquer la logique, et ajoute `exportedAt` uniquement dans `exportData()`.

```js
// Exemple de structure attendue (à adapter au code réel) :
function collectStateSnapshot() {
  return {
    version:     1,
    completed:   JSON.parse(localStorage.getItem(STORE.completed)   || '{}'),
    skipped:     JSON.parse(localStorage.getItem(STORE.skipped)     || '{}'),
    notes:       JSON.parse(localStorage.getItem(STORE.notes)       || '{}'),
    results:     JSON.parse(localStorage.getItem(STORE.results)     || '{}'),
    perfResults: JSON.parse(localStorage.getItem(STORE.perfResults) || '{}'),
    programEnd:  localStorage.getItem(STORE.programEnd) || null,
  };
}

function exportData() {
  const data = { ...collectStateSnapshot(), exportedAt: new Date().toISOString() };
  // ... reste inchangé (création blob, download)
}
```

### Étape 3 — Implémenter `takeSnapshot()`

Ajoute une fonction `takeSnapshot()` après `collectStateSnapshot()`. Elle doit :

1. Lire le tableau actuel depuis `localStorage.getItem(STORE.snapshots)`. Parser avec try/catch, fallback sur `[]`. S'assurer que c'est bien un Array — sinon reset à `[]`.
2. Créer une nouvelle entrée : `{ ts: Date.now(), data: collectStateSnapshot() }`.
3. Ajouter la nouvelle entrée au début du tableau (index 0 = le plus récent).
4. Tronquer le tableau à 3 entrées maximum (garder les index 0, 1, 2 — éjecter le plus ancien).
5. Sérialiser et écrire dans `localStorage` via `STORE.snapshots`, enveloppé dans try/catch :
   ```js
   try {
     localStorage.setItem(STORE.snapshots, JSON.stringify(ring));
   } catch (e) {
     if (e.name === 'QuotaExceededError') console.warn('[HIPLAN] Quota localStorage dépassé — snapshot ignoré');
   }
   ```
6. Ne jamais lancer d'exception vers l'appelant — absorber toutes les erreurs en interne.

### Étape 4 — Déclencheur boot : `takeSnapshotIfNeeded()`

Ajoute une fonction `takeSnapshotIfNeeded()` après `takeSnapshot()`. Elle doit :

1. Lire les snapshots existants (`STORE.snapshots`), parser avec fallback `[]`.
2. Si le tableau est non-vide, comparer la date du snapshot le plus récent (index 0, champ `ts`) à la date du jour : si `new Date(ring[0].ts).toDateString() === new Date().toDateString()`, retourner sans rien faire (déjà snapshoté aujourd'hui).
3. Sinon appeler `takeSnapshot()`.

Dans la séquence de boot (lignes 4613–4618), appelle `takeSnapshotIfNeeded()` comme **première instruction**, avant `renderProgramEndControl()`.

### Étape 5 — Déclencheur avant import

Dans `importData(event)` (ligne 3770), ajoute `takeSnapshot()` comme **première instruction** de la fonction, avant tout accès au FileReader :

```js
function importData(event) {
  takeSnapshot(); // protection avant écrasement
  const file = event.target.files[0];
  // ... reste inchangé
}
```

### Étape 6 — Ajouter les états toast pour les snapshots

Dans `showToast(state)` (ligne 3825), ajoute les cas suivants dans la chaîne if/else, avant le `else` final :

```js
else if (state === 'snapshot-restored') { t.textContent = 'Données restaurées depuis la sauvegarde'; t.style.background = 'var(--green)'; }
else if (state === 'snapshot-none')     { t.textContent = 'Aucune sauvegarde disponible'; t.style.background = 'var(--muted)'; }
```

### Étape 7 — Injection HTML : bouton "Sauvegardes" dans le `program-date-panel`

Dans le HTML du `program-date-panel` (lignes 1382–1385), ajoute un bouton APRES le bouton "📤 Exporter" et AVANT "📥 Importer" :

```html
<button onclick="openSnapshotsPanel()">🔒 Sauvegardes</button>
```

Ce bouton hérite du style par défaut `.program-date-actions button` (fond bg2, texte muted, bordure border). Ne lui ajoute pas de classe `.primary`.

### Étape 8 — Injection HTML : panneau liste des sauvegardes (`#snapshots-panel`)

Après le bloc d'injection du `#weekly-recap-sheet` (après la ligne 4610, avant `initWeeklyRecapSwipe()`), ajoute via `document.body.insertAdjacentHTML('beforeend', ...)` le HTML suivant :

```html
<div id="snapshots-backdrop" style="display:none" onclick="closeSnapshotsPanel()"></div>
<div id="snapshots-panel" style="display:none">
  <div class="snapshots-handle"></div>
  <div class="snapshots-header">
    <span class="snapshots-title">SAUVEGARDES AUTOMATIQUES</span>
    <button class="snapshots-close-btn" onclick="closeSnapshotsPanel()" aria-label="Fermer">&#x2715;</button>
  </div>
  <div class="snapshots-body" id="snapshotsBody">
    <!-- contenu généré dynamiquement -->
  </div>
</div>
```

Ajoute également le HTML de la modal de confirmation (injectée de la même manière, dans le même `insertAdjacentHTML`) :

```html
<div id="snapshot-confirm-backdrop" style="display:none"></div>
<div id="snapshot-confirm-modal" style="display:none" role="dialog" aria-modal="true">
  <div class="snapshot-modal-title">Restaurer cette sauvegarde ?</div>
  <div class="snapshot-modal-body" id="snapshotModalBody"></div>
  <div class="snapshot-modal-actions">
    <button class="snapshot-modal-cancel" onclick="closeSnapshotModal()">Annuler</button>
    <button class="snapshot-modal-confirm" id="snapshotConfirmBtn">Restaurer</button>
  </div>
</div>
```

### Étape 9 — CSS des nouveaux composants

Dans le bloc `<style>`, après les règles `.program-date-actions` existantes (après la ligne 838), ajoute les règles CSS suivantes en respectant le dark theme :

```css
/* ── SNAPSHOTS PANEL (bottom sheet) ── */
#snapshots-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  z-index: 200; touch-action: none;
}
#snapshots-panel {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--card); border-top: 1px solid var(--border);
  border-radius: 14px 14px 0 0; z-index: 201;
  max-height: 70vh; display: flex; flex-direction: column;
  transform: translateY(100%); transition: transform 0.28s cubic-bezier(.4,0,.2,1);
}
#snapshots-panel.open { transform: translateY(0); }
.snapshots-handle {
  width: 36px; height: 4px; background: var(--border);
  border-radius: 2px; margin: 10px auto 0;
}
.snapshots-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 10px; border-bottom: 1px solid var(--border);
}
.snapshots-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--muted2);
}
.snapshots-close-btn {
  background: none; border: none; color: var(--muted);
  font-size: 16px; cursor: pointer; padding: 4px 8px; line-height: 1;
  min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;
}
.snapshots-body {
  overflow-y: auto; padding: 12px 16px 24px; flex: 1;
}
.snapshot-item {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border);
}
.snapshot-item:last-child { border-bottom: none; }
.snapshot-info { display: flex; flex-direction: column; gap: 3px; }
.snapshot-date {
  font-size: 14px; color: var(--text); font-family: 'Outfit', sans-serif;
}
.snapshot-summary {
  font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace;
}
.snapshot-restore-btn {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.8px; text-transform: uppercase;
  padding: 8px 14px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--border); background: var(--bg2);
  color: var(--muted); white-space: nowrap;
  min-height: 44px; min-width: 44px;
}
.snapshot-restore-btn:hover { border-color: var(--muted); color: var(--text); }
.snapshots-empty {
  text-align: center; color: var(--muted); font-size: 13px;
  font-family: 'Outfit', sans-serif; padding: 24px 0;
}

/* ── SNAPSHOT CONFIRM MODAL ── */
#snapshot-confirm-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  z-index: 300; touch-action: none;
}
#snapshot-confirm-modal {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: var(--card); border: 1px solid var(--border);
  border-radius: 12px; z-index: 301;
  width: min(90vw, 360px); padding: 24px 20px 20px;
  display: flex; flex-direction: column; gap: 16px;
}
.snapshot-modal-title {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  letter-spacing: 1px; text-transform: uppercase;
  color: var(--text); font-weight: 600;
}
.snapshot-modal-body {
  font-family: 'Outfit', sans-serif; font-size: 14px;
  color: var(--muted); line-height: 1.5;
}
.snapshot-modal-actions {
  display: flex; gap: 10px; justify-content: flex-end;
}
.snapshot-modal-cancel {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.8px; text-transform: uppercase;
  padding: 10px 16px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--border); background: var(--bg2);
  color: var(--muted); min-height: 44px;
}
.snapshot-modal-confirm {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.8px; text-transform: uppercase;
  padding: 10px 16px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--red); background: rgba(248,113,113,0.12);
  color: var(--red); min-height: 44px;
}
.snapshot-modal-confirm:hover { background: rgba(248,113,113,0.22); }
```

### Étape 10 — Fonctions JS : gestion du panneau et de la modal

Ajoute les fonctions suivantes dans le `<script>`, regroupées en un bloc cohérent, après les fonctions `takeSnapshot()` / `takeSnapshotIfNeeded()` (et avant la séquence de boot) :

#### `formatSnapshotDate(ts)`
Formate un timestamp en date lisible en français.
```js
function formatSnapshotDate(ts) {
  const d = new Date(ts);
  const date = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return date + ' à ' + time;
}
```

#### `getSnapshotSummary(data)`
Retourne une chaîne de résumé à partir des données d'un snapshot.
```js
function getSnapshotSummary(data) {
  try {
    const count = Object.keys(data.completed || {}).length;
    return count + ' séance' + (count > 1 ? 's' : '') + ' faite' + (count > 1 ? 's' : '');
  } catch {
    return 'Données';
  }
}
```

#### `openSnapshotsPanel()`
Lit les snapshots, génère le contenu HTML de `#snapshotsBody`, puis affiche le panneau.
```js
function openSnapshotsPanel() {
  let ring = [];
  try { ring = JSON.parse(localStorage.getItem(STORE.snapshots) || '[]'); } catch { ring = []; }
  if (!Array.isArray(ring)) ring = [];

  const body = document.getElementById('snapshotsBody');
  if (!ring.length) {
    body.innerHTML = '<div class="snapshots-empty">Aucune sauvegarde disponible.</div>';
  } else {
    body.innerHTML = ring.map((snap, idx) => `
      <div class="snapshot-item">
        <div class="snapshot-info">
          <div class="snapshot-date">${formatSnapshotDate(snap.ts)}</div>
          <div class="snapshot-summary">${getSnapshotSummary(snap.data)}</div>
        </div>
        <button class="snapshot-restore-btn" onclick="openSnapshotModal(${idx})">Restaurer</button>
      </div>
    `).join('');
  }

  const backdrop = document.getElementById('snapshots-backdrop');
  const panel    = document.getElementById('snapshots-panel');
  backdrop.style.display = 'block';
  panel.style.display    = 'flex';
  requestAnimationFrame(() => panel.classList.add('open'));
}
```

#### `closeSnapshotsPanel()`
Ferme le panneau avec animation.
```js
function closeSnapshotsPanel() {
  const panel    = document.getElementById('snapshots-panel');
  const backdrop = document.getElementById('snapshots-backdrop');
  panel.classList.remove('open');
  setTimeout(() => {
    panel.style.display    = 'none';
    backdrop.style.display = 'none';
  }, 300);
}
```

#### `openSnapshotModal(idx)`
Ouvre la modal de confirmation pour le snapshot à l'index `idx` dans l'anneau.
La modal doit :
1. Lire le snapshot à l'index `idx` dans le localStorage.
2. Remplir `#snapshotModalBody` avec le texte : "Remplacer les données actuelles par la sauvegarde du [date] ? Les données actuelles seront d'abord sauvegardées automatiquement."
3. Brancher `#snapshotConfirmBtn` sur `() => restoreSnapshot(idx)`.
4. Afficher `#snapshot-confirm-backdrop` et `#snapshot-confirm-modal`.

```js
function openSnapshotModal(idx) {
  let ring = [];
  try { ring = JSON.parse(localStorage.getItem(STORE.snapshots) || '[]'); } catch { ring = []; }
  if (!Array.isArray(ring) || !ring[idx]) return;

  const snap = ring[idx];
  document.getElementById('snapshotModalBody').textContent =
    'Remplacer les données actuelles par la sauvegarde du ' +
    formatSnapshotDate(snap.ts) +
    ' ? Les données actuelles seront d\'abord sauvegardées automatiquement.';

  const btn = document.getElementById('snapshotConfirmBtn');
  btn.onclick = () => restoreSnapshot(idx);

  document.getElementById('snapshot-confirm-backdrop').style.display = 'block';
  document.getElementById('snapshot-confirm-modal').style.display    = 'flex';
}
```

#### `closeSnapshotModal()`
Ferme la modal sans rien faire.
```js
function closeSnapshotModal() {
  document.getElementById('snapshot-confirm-backdrop').style.display = 'none';
  document.getElementById('snapshot-confirm-modal').style.display    = 'none';
}
```

#### `restoreSnapshot(idx)`
Flux de restauration sécurisé.
```js
function restoreSnapshot(idx) {
  let ring = [];
  try { ring = JSON.parse(localStorage.getItem(STORE.snapshots) || '[]'); } catch { ring = []; }
  if (!Array.isArray(ring) || !ring[idx]) { closeSnapshotModal(); return; }

  // Déclencheur (c) : snapshot de sécurité de l'état courant avant écrasement
  takeSnapshot();

  const data = ring[idx].data;
  try {
    localStorage.setItem(STORE.completed,   JSON.stringify(data.completed   || {}));
    localStorage.setItem(STORE.skipped,     JSON.stringify(data.skipped     || {}));
    localStorage.setItem(STORE.notes,       JSON.stringify(data.notes       || {}));
    localStorage.setItem(STORE.results,     JSON.stringify(data.results     || {}));
    localStorage.setItem(STORE.perfResults, JSON.stringify(data.perfResults || {}));
    if (data.programEnd) localStorage.setItem(STORE.programEnd, data.programEnd);
  } catch (e) {
    console.error('[HIPLAN] Erreur lors de la restauration du snapshot :', e);
    closeSnapshotModal();
    return;
  }

  closeSnapshotModal();
  closeSnapshotsPanel();
  showToast('snapshot-restored');
  setTimeout(() => location.reload(), 1200); // laisser le toast s'afficher avant le reload
}
```

### Étape 11 — Séquence de boot : appel de `takeSnapshotIfNeeded()`

Dans la séquence de boot (lignes 4613–4618), insère `takeSnapshotIfNeeded()` comme **toute première instruction** :

```js
takeSnapshotIfNeeded();     // <-- ajouter ICI, en premier
renderProgramEndControl();
buildWeekView(null);
updateStats();
validatePlan();
buildLoadChart();
buildWeeklyRecap();
```

### Étape 12 — Bump de version (à faire EN DERNIER)

1. Dans `index.html` ligne 1343, change `<small class="app-version">v3</small>` en `<small class="app-version">v4</small>`.
2. Dans `sw.js` ligne 1, change `const CACHE = 'hiplan-v3';` en `const CACHE = 'hiplan-v4';`.

Ces deux changements doivent être faits ensemble et en dernier, après que toute la feature soit implémentée et vérifiée.

---

## Ce qu'il ne faut PAS faire

- Ne pas déclarer une deuxième fois `const STORE`, `let completed`, `let skipped`, `let sessionNotes`, `let sessionResults`, `let perfResults` — ces noms sont déjà déclarés (lignes 2755–2780). Utilise `STORE.snapshots` pour référencer la nouvelle clé, pas une constante séparée.
- Ne pas modifier les valeurs des clés localStorage existantes dans STORE (ne pas changer `'hi_swim_tracker_v3'`, `'hi_swim_skipped_v1'`, etc.) — cela casserait toutes les données des utilisateurs existants.
- Ne pas inclure `STORE.snapshots` (`'hi_tri_snapshots'`) dans la collecte de `collectStateSnapshot()` — cela provoquerait une croissance exponentielle des données.
- Ne pas dupliquer la logique de collecte des clés d'état entre `collectStateSnapshot()` et `exportData()` — `exportData()` doit appeler `collectStateSnapshot()`.
- Ne pas ajouter de dépendances npm, de fichiers JS externes, ni de balises `<script src="...">`.
- Ne pas utiliser de framework (React, Vue, Alpine, etc.) ni de module ES (`import`/`export`).
- Ne pas créer de nouveaux fichiers HTML, CSS ou JS séparés.
- Ne pas modifier la structure des données dans les clés localStorage existantes (les objets `completed`, `skipped`, etc. doivent garder leur format actuel).
- Ne pas faire crasher l'application si `localStorage` est plein — absorber `QuotaExceededError` silencieusement (console.warn uniquement).
- Ne pas modifier `validatePlan()` (lignes 2735–2750) ni les données du `weeklyPlan`.
- Ne pas utiliser un bottom sheet pour la modal de confirmation — la spec impose une modal centrée bloquante.
- Ne pas utiliser `var(--green)` ni `var(--accent)` pour le bouton de restauration dans la liste : couleur neutre `var(--border)` / `var(--muted)` uniquement. La couleur rouge (`var(--red)`) est réservée au bouton de confirmation dans la modal.
- Ne pas bumper la version AVANT d'avoir implémenté la feature complète.

---

## Format de sortie attendu

Modifie `index.html` en place (fichier unique, toujours à la racine du projet).
Modifie `sw.js` en place pour le bump de version final.
Ne crée aucun fichier supplémentaire.
Ne retourne pas le fichier complet en réponse — applique les modifications par éditions ciblées.

---

## Critères d'acceptation et plan de test

Vérifie chaque point manuellement (ou par inspection du code) avant de valider la feature.

### T1 — Boot avec localStorage vide
- Ouvrir l'app avec `localStorage.clear()` préalable.
- Vérifier que `localStorage.getItem('hi_tri_snapshots')` contient un tableau de 1 entrée.
- Vérifier qu'aucune erreur n'apparaît dans la console.

### T2 — Boot le même jour (déduplication quotidienne)
- Recharger la page immédiatement après T1.
- Vérifier que `localStorage.getItem('hi_tri_snapshots')` contient toujours 1 entrée (pas 2).
- La comparaison doit se faire par `toDateString()`, pas par timestamp exact.

### T3 — Anneau de 3 (4 jours simulés)
- Simuler 4 boots sur 4 jours différents en manipulant le timestamp du premier snapshot dans le localStorage entre chaque test (modifier `ring[0].ts` pour une date antérieure).
- Après le 4ème boot, vérifier que `ring.length === 3` et que le plus ancien snapshot a bien été éjecté.

### T4 — Snapshot avant import
- Ouvrir le panneau Importer, sélectionner un fichier `.json` valide.
- Vérifier qu'avant l'import, un nouveau snapshot a été ajouté (le timestamp du plus récent doit être postérieur à l'ouverture de la page).

### T5 — Flux de restauration complet
- Cliquer sur "Sauvegardes", vérifier la liste des snapshots (date + résumé affichés).
- Cliquer "Restaurer" sur un snapshot : vérifier que le bouton est en couleur neutre (pas vert, pas accent).
- Vérifier que la modal s'affiche avec le texte explicite et un bouton de confirmation ROUGE.
- Confirmer la restauration : vérifier qu'un snapshot de sécurité supplémentaire est créé, que les données sont restaurées, que la page se recharge, et que le toast "snapshot-restored" apparaît avant le reload.

### T6 — Annuler dans la modal
- Ouvrir la modal de confirmation, cliquer "Annuler".
- Vérifier qu'aucune écriture n'a eu lieu (les données localStorage sont inchangées).
- Vérifier que la modal se ferme et que la liste reste ouverte (ou est refermée proprement selon l'implémentation choisie).

### T7 — Exclusion de la clé snapshots
- Inspecter `collectStateSnapshot()` : la clé `'hi_tri_snapshots'` / `STORE.snapshots` ne doit pas apparaître parmi les clés collectées.
- Vérifier que le contenu d'un snapshot ne contient pas lui-même un champ `snapshots`.

### T8 — Non-régression export/import
- Cliquer "Exporter" : vérifier que le fichier `.json` téléchargé contient les champs attendus (`version`, `exportedAt`, `completed`, `skipped`, `notes`, `results`, `perfResults`, `programEnd`) et PAS de champ `snapshots`.
- Importer ce fichier : vérifier que les données sont correctement restaurées et que `showToast('import-ok')` est appelé.

### T9 — validatePlan() sans warning
- Vérifier dans la console que `validatePlan()` (appelée au boot) ne produit aucun warning. Cela confirme que les IDs de séances et la structure du plan sont intacts.

### T10 — Zéro déclaration dupliquée
- Inspecter le code pour s'assurer qu'il n'existe pas deux `const STORE`, deux `let completed`, ni aucune autre déclaration dupliquée des variables globales existantes.

---

## Commit final

Une fois tous les critères d'acceptation vérifiés et la version bumpée :

```
feat: P3 — snapshots localStorage rotatifs (anneau de 3) + restauration sécurisée
```
