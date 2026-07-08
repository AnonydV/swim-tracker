---
name: known-bugs
description: Bugs et risques techniques identifiés lors des analyses QA de index.html — mis à jour après v15 (2026-07-08)
metadata:
  type: project
---

## Bugs INTRODUITS par v15 (non committée, 2026-07-08)

**BUG BLOQUANT (Lot 3) — Sélecteur `:nth-of-type` invalide pour les sliders du check-in**
`saveCheckin` utilise `#checkin-widget input[type=range]:nth-of-type(1/2/3)`. Chaque slider est seul dans son `<label>`, donc `:nth-of-type(2)` et `:nth-of-type(3)` ne matchent aucun élément (un seul `input` par parent `label`). `querySelector` retourne `null` pour legs et energy → `parseInt(null.value)` = TypeError. La sauvegarde du check-in crashe systématiquement.
Fix : remplacer par `querySelectorAll('#checkin-widget input[type=range]')` et indexer [0], [1], [2].

**BUG MAJEUR (Lot 2) — `toggleAdapted` n'appelle pas `updateStats()`**
Après marquage ou désmarquage d'une session comme Adaptée, `buildWeekView` est appelé mais `updateStats` ne l'est pas. La barre de stats (séances faites, barre de progression) ne se met pas à jour tant que l'utilisateur ne fait pas une autre action qui trigger `updateStats`.
Fix : ajouter `updateStats();` dans `toggleAdapted` après `safeWrite('hi_tri_adapted_v1', ...)`.

**BUG MAJEUR (Lot 2) — Mutuelle exclusivité incomplète : `wvToggleDone` et `wvToggleSkip` ne purgent pas `adapted`**
Si une session est en état Adapté (ex: sw1c) et que l'utilisateur clique "Fait" depuis le panel "À faire" (bouton rsw-done-btn), `adapted[id]` reste présent. La session est alors comptée 2× dans `updateStats` (`completed[id] || adapted[id]`) ET affiche encore le badge ADAPTÉ même si elle est en état Fait. De même pour wvToggleSkip.
Fix : ajouter `delete adapted[id]; safeWrite('hi_tri_adapted_v1', JSON.stringify(adapted));` dans les branches else de `wvToggleDone` et `wvToggleSkip`.

**MINEUR (Lot 4) — CSS `missed-link-btn` : `color: var(--muted)` au lieu de `var(--muted2)`**
La spec demandait `--muted2` (#3a5570, très atténué) pour que le lien soit réellement discret. Le dev a mis `--muted` (#5a7a99), qui est plus visible. L'effet discret est amoindri mais pas bloquant. Le hover est `var(--text)` (correct visuellement).

---

## Bugs INTRODUITS par v13 (non committée, 2026-07-08)

**BUG MAJEUR — `updateStats` et `buildLoadChart` itèrent sur tout weeklyPlan (S1-S10) malgré TOTAL_WEEKS=7**
`updateStats` fait `weeklyPlan.forEach(w => ...)` sans filtre sur TOTAL_WEEKS. Avec TOTAL_WEEKS=7 mais weeklyPlan contenant 48 sessions (S1-S10), le dénominateur total = 48 au lieu de 36. Si toutes les sessions S1-S7 sont complétées, la barre de progression affiche 75% au lieu de 100%. Même problème pour `buildLoadChart` qui trace 10 barres au lieu de 7.
Fix : ajouter `if (w.weekNum > TOTAL_WEEKS) return;` au début du forEach dans `updateStats` et filter `weeklyPlan.filter(w => w.weekNum <= TOTAL_WEEKS)` dans `buildLoadChart`.
Introduit par : passage TOTAL_WEEKS 10→7 sans adapter les fonctions d'agrégation.

**BUG CRITIQUE (migration) — localStorage programEnd incompatible avec TOTAL_WEEKS=7**
Si localStorage contient `hi_tri_program_end = '2026-09-13'` (ancienne valeur plan 10 semaines), alors avec TOTAL_WEEKS=7 et RACE_WEEK=7 : `getRaceDate() = programEnd - 0 = '2026-09-13'` au lieu de `'2026-08-23'`. Le countdown affichera J-67 au lieu de J-46, et la fiche course / checklist s'ouvriront au mauvais moment.
Fix (côté utilisateur) : vider manuellement `hi_tri_program_end` en localStorage pour activer le DEFAULT_PROGRAM_END = '2026-08-23', OU saisir '2026-08-23' dans le contrôle de date de fin de programme.
Fix (côté code) : dans `getProgramEndDate()`, si storedEnd est défini mais que programEnd != DEFAULT_PROGRAM_END et TOTAL_WEEKS a changé, forcer la migration. Ou simplifier : DEFAULT_PROGRAM_END prend toujours le dessus, localStorage seulement en override explicite.

**BUG MINEUR — `#header-race-btn` : min-height CSS = 36px au lieu de 44px**
CSS L1852 : `min-height: 36px` sur `#header-race-btn`. La spec impose 44px pour les touch targets mobile. Le bouton est sous le seuil recommandé de 8px.
Fix : `min-height: 44px;`

**TYPO — `t1_5` : 'scotée' au lieu de 'scotchée'**
L2868 : `{ id: 't1_5', text: 'Nutrition vélo scotée sur le cadre (gels, barre)' }`. Faute de frappe : 'scotée' → 'scotchée'.

---

## Bugs RÉSOLUS par le refactoring weeklyPlan (2026-07)

**[RÉSOLU] BUG CRITIQUE — Muscu : IDs cycliques partagés entre semaines**
Remplacés par des IDs uniques par semaine (`mw1a`, `mw2a`, ...). Le bug de co-marquage entre semaines est supprimé.

**[RÉSOLU] BUG MOYEN — `completed[id] = false` stocké au lieu de supprimer la clé**
`wvToggleDone` utilise maintenant `delete completed[id]`. Plus de clés parasites en localStorage.

---

## Bugs ACTIFS (sprint N1+N3)

**BUG MAJEUR — Tooltip N1 (buildProgressionPanel) jamais visible sur desktop, ~300ms sur mobile**
Cause : l'événement `click` sur un dot SVG bubbles jusqu'au document. Le listener SVG appelle `showProgTooltip`, puis le listener document appelle immédiatement `hideProgTooltip`.
Fix : ajouter `event.stopPropagation()` après `opts.onDotTap(pts[idx], event)` à la ligne 2965.

**BUG MINEUR — Touch target chips N1 : 32px inline au lieu de 44px CSS**
Localisation : L1408-1411 (inline `min-height:32px`) vs L632 (CSS `.prog-chip { min-height: 44px }`).

**CODE MORT MINEUR — Dead variable L3085 dans buildProgressionPanel**
`let svgEl = document.getElementById('prog-line-svg')` immédiatement écrasé.

---

## Bugs ACTIFS (pré-sprint, toujours présents)

**ANOMALIE — brw8a type/discipline mismatch**
`brw8a` (S8) a `type: "r-recovery"` mais préfixe `brw` → getDiscipline retourne `'brick'`. Bug fonctionnel moyen, S8 inaccessible avec TOTAL_WEEKS=7 donc impact réduit.

**RÉGRESSION — `buildSessionResultHtml` : dead code**
S'active uniquement pour `type: 'r-quality'` ou `type: 'r-race'`. Aucune session du weeklyPlan n'utilise ces types.

**FONCTION LEGACY — `migrateStrengthSessionIds`**
Migration one-shot encore présente, inoffensive mais dead code.

**BUG MOYEN — Import silencieusement partiel si `completed` est un tableau**
`importData` ne vérifie pas que `completed` est un objet.

**RISQUE MOYEN — Semaine active décalée en cas de changement d'heure (DST)**
Division en ms par 7*24*3600*1000 sans correction DST.

**BUG CRITIQUE — SW install fail : fichiers SVG absents dans SHELL**
SHELL référence `/swim-tracker/icon.svg` et `icon-maskable.svg`. Ces fichiers n'existent pas. `caches.addAll` échoue. PWA offline non fonctionnel.

**BUG MOYEN — Favicon et apple-touch-icon pointent vers icon.svg absent**
Aucun favicon dans l'onglet navigateur.

---

## Analyse statique N4

**BÉNIN — Style var/let/const incohérent dans les fonctions N4**

**BÉNIN — Bouton "Hist." visible sur cartes sans historique**

**VÉRIFIÉ OK — Z-index N4 vs autres bottom sheets** : history 902/903, snapshots 900/901, perf/recap 799/800, snapshot-confirm 950/951.

**VÉRIFIÉ OK — SESSION_TYPE_LABELS couvre les 10 types du weeklyPlan**

---

**Why** : Trouvés lors des analyses statiques de index.html (juillet 2026).
**How to apply** : Toujours re-tester les bugs actifs après toute modification. Le bug updateStats/TOTAL_WEEKS est le risque QA le plus immédiat post-v13. Le bug de migration localStorage doit être testé avant toute démo.
