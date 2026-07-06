# Sprint v8 — Replan Vichy 70.3 + Retrait slider %brasse

Rédigé le 2026-07-06. Destiné à l'agent dev. Autoporteur : lire entièrement avant de toucher au code.

---

## Contexte technique

- **Projet** : HIPLAN — tracker triathlon monofichier.
- **Fichier principal** : `C:\Users\vicba\OneDrive\Documents\HIPLAN\index.html` (~4 400 lignes). HTML + CSS + JS en un seul fichier. Zéro dépendance externe, zéro framework, zéro build step.
- **Fichier secondaire** : `C:\Users\vicba\OneDrive\Documents\HIPLAN\sw.js` — service worker, cache nommé `hiplan-v7` à la ligne 1.
- **Source de vérité pour les modifications de sessions** : `C:\Users\vicba\OneDrive\Documents\HIPLAN\prompts\coach-replan-vichy-70-3.md` — lis-le intégralement. Il contient les JSONs complets des sessions réécrites, des sessions à ajouter et la liste exhaustive des suppressions.
- **Stockage** : `localStorage` uniquement. Les clés sont définies dans `const STORE` (~L2944). Ne modifie aucune clé existante.
- **Structure du plan d'entraînement** : `const weeklyPlan` (tableau JS) déclaré dans le corps du script, contenant des objets `{ weekNum, phase, sessions: [...] }`. Le plan actuel couvre les weekNums 1 à 14 (`TOTAL_WEEKS = 14` à **L2990**). Après ce sprint, il couvrira les weekNums 1 à 10.
- **Phases** : `const WEEK_PHASES` déclaré à **L3019-3024**. Associe chaque weekNum à une phase numérotée (1 à 4) qui pilote les couleurs du graphe de charge et du header.
- **Version badge** : **L1531** — `<small class="app-version">v7</small>`.
- **Bugs récurrents à éviter absolument** :
  - Duplication de déclarations `const` ou `let` pour des variables déjà définies.
  - Guillemets non échappés dans les chaînes de caractères JS du weeklyPlan.
  - Modification accidentelle des clés `STORE` (casse les données utilisateur).
  - Duplication de blocs de code (fonctions, écouteurs d'événements, initialisations).
  - Ajout de fichiers supplémentaires ou de dépendances.

---

## Raison du changement

**Chantier 1 — Replan Vichy 70.3** : le programme original (14 semaines) ciblait un enchaînement triathlon L + semi-marathon 1h30 jusqu'à la semaine 14. Le coach a recadré le cycle pour un 70.3 Vichy le dimanche 23 août 2026 (= weekNum 8 du plan). Les weekNums 11 à 14 (objectif semi) sont entièrement abandonnés. Le programme passe de 14 à 10 semaines actives. Des sessions sont réécrites pour correspondre à la prépa spécifique 70.3, deux sessions sont ajoutées (premier contact vélo en S2, premier brick en S4), et plusieurs sessions incompatibles avec la race week ou la récupération post-course sont supprimées.

**Chantier 2 — Retrait slider %brasse** : la brasse n'est plus dans les consignes de nage du programme Vichy. Le slider de saisie "Part brasse" dans la fiche perf natation est retiré. Les données `pctBrasse` déjà enregistrées en localStorage sont conservées sans migration — on arrête uniquement de les saisir et de les afficher.

---

## Ce qu'il faut implémenter

---

### CHANTIER 1 — Replan Vichy 70.3

#### 1.1 — Changer `TOTAL_WEEKS` de 14 à 10

**L2990** : `const TOTAL_WEEKS = 14;` → remplacer par `const TOTAL_WEEKS = 10;`

C'est la modification structurelle centrale. Les fonctions suivantes utilisent `TOTAL_WEEKS` via référence directe et se mettent à jour automatiquement sans autre modification :
- `getProgramEndDate()` **L3052, L3053** : calcule `addDays(legacyStart, (TOTAL_WEEKS * 7) - 1)`.
- `getProgramStartDate()` **L3059** : calcule `addDays(programEnd, -((TOTAL_WEEKS * 7) - 1))`.
- `getCalendarActiveWeekNum()` **L3101, L3103** : utilise `TOTAL_WEEKS` comme plafond.
- `updateHeaderSubtitle()` **L3152-3156** : affiche `SEMAINE X/TOTAL_WEEKS` (countdown P4).
- `getAllProgramSessions()` **L3934** : boucle `for weekNum = 1; weekNum <= TOTAL_WEEKS`.
- Bouton de navigation semaine **L3650** : `weekNum >= TOTAL_WEEKS`.

Ces fonctions n'ont pas besoin d'être modifiées individuellement si `TOTAL_WEEKS` est correctement mis à 10.

#### 1.2 — Mettre à jour `WEEK_PHASES`

**L3019-3024** — remplacer l'intégralité du tableau `WEEK_PHASES` par :

```js
const WEEK_PHASES = [
  { phase: 1, name: 'BASE AÉROBIE',      weeks: [1,2] },
  { phase: 2, name: 'CONSTRUCTION 70.3', weeks: [3,4,5] },
  { phase: 3, name: 'SPÉCIFIQUE 70.3',   weeks: [6,7,8] },
  { phase: 4, name: 'RÉCUPÉRATION',      weeks: [9,10] },
];
```

Justification : le tableau actuel contient `weeks: [9,10,11,12,13,14]` en phase 4 — après suppression des weekNums 11 à 14 du `weeklyPlan`, ces références seront orphelines et causeront des comportements indéterminés dans `getWeekPhase()` (**L3485**) et `buildLoadChart()` (**L3375-L3401**).

`PHASE_COLORS` (**L3375**) est un objet séparé `{ 1: '#38bdf8', 2: '#facc15', 3: '#fb923c', 4: '#4ade80' }` — il n'a pas besoin d'être modifié, les 4 phases sont conservées.

#### 1.3 — Supprimer les weekNums 11, 12, 13, 14 du `weeklyPlan`

Supprimer entièrement les quatre blocs d'objet `{ "weekNum": N, ... }` :
- weekNum 11 → bloc débutant à **L2564** — sessions : rw11a, sw11a, bw11a, rw11b
- weekNum 12 → bloc débutant à **L2622** — sessions : rw12a, sw12a, bw12a, rw12b, rw12c, rw12d, mw12a
- weekNum 13 → bloc débutant à **L2727** — sessions : rw13a, sw13a, rw13b, rw13c, rw13d, bw13a, mw13a
- weekNum 14 → bloc débutant à **L2833** — sessions : rw14a, rw14b, bw14a, rw14c, mw14a, rw14d

Assure-toi que le `weeklyPlan` se termine correctement après le bloc weekNum 10 (dernier `]` et `;` de fermeture du tableau).

#### 1.4 — Supprimer 6 sessions dans les weekNums 8, 9, 10

Les sessions suivantes doivent être supprimées de leur bloc `sessions: [...]` respectif. Supprime l'objet complet de la session (depuis le `{` d'ouverture jusqu'au `}` de fermeture, ainsi que la virgule séparatrice).

| ID à supprimer | weekNum | Ligne approximative |
|---|---|---|
| sw8b | 8 | **L2345** |
| mw8a | 8 | **L2360** |
| brw9a | 9 | **L2438** |
| sw9b | 9 | **L2454** |
| mw9a | 9 | **L2469** |
| rw10c | 10 | **L2550** |

#### 1.5 — Ajouter bw2a dans weekNum 2

Vérification préalable : confirme que l'ID `bw2a` n'existe pas déjà dans `weeklyPlan` (grep `"id": "bw2a"` → doit retourner 0 résultat).

Le bloc weekNum 2 débute à **L1699** et contient actuellement 5 sessions : rw2a, rw2b, sw2a, sw2b, mw2a. Ajoute la session `bw2a` comme dernière entrée du tableau `sessions` de weekNum 2, après mw2a.

JSON complet de bw2a — à copier depuis `coach-replan-vichy-70-3.md`, section "AJOUT 1 — bw2a" :
```json
{
  "id": "bw2a",
  "name": "Vélo — Premier contact Z2",
  "type": "b-endurance",
  "typeLabel": "60 min · Z2 vélo",
  "dist": 60,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "10 min",
      "desc": "Pédalage progressif de Z1 (<126 W) vers 140–150 W sur 10 min. Cadence libre, jambes qui se réveillent.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "40 min",
      "desc": "40 min à 126–168 W (Z2 vélo, 60–80% FTP). Cadence cible 85–90 rpm. Effort conversationnel. Si tu n'as pas de capteur de puissance : allure où tu peux tenir une conversation sans t'essouffler.",
      "tip": "En Z2 vélo, si la FC dépasse 150 bpm, réduis la puissance. La physiologie vélo est différente de la course — les zones ne sont pas identiques à effort identique."
    },
    {
      "type": "cool",
      "dist": "10 min",
      "desc": "Retour progressif à <126 W, pédalage très souple 5 min.",
      "tip": ""
    }
  ],
  "tip": "Premier bloc vélo du programme. Objectif : retrouver les sensations, calibrer les zones de puissance. Pas de performance à chercher — juste le contact avec les pédales."
}
```

**Conséquence sur bw3a** : `bw3a` (**L1840**) est désormais le deuxième vélo, plus le premier. Mets à jour uniquement son champ `tip` :
> Deuxième sortie vélo du programme, premier travail structuré en Z2 soutenue. Si les jambes semblent plus légères qu'en S2, le vélo commence à s'installer. Pas de performance à chercher ici — allure Z2 propre et régulière.

#### 1.6 — Ajouter brw4a dans weekNum 4

Vérification préalable : confirme que l'ID `brw4a` n'existe pas déjà dans `weeklyPlan` (grep `"id": "brw4a"` → doit retourner 0 résultat).

Le bloc weekNum 4 débute à **L1870** et contient actuellement 6 sessions : rw4a, rw4b, sw4a, sw4b, bw4a, mw4a. Ajoute `brw4a` comme dernière entrée du tableau `sessions` de weekNum 4, après mw4a.

JSON complet de brw4a — à copier depuis `coach-replan-vichy-70-3.md`, section "AJOUT 2 — brw4a" :
```json
{
  "id": "brw4a",
  "name": "Brick — Premier enchaînement",
  "type": "brick",
  "typeLabel": "50 min · Brick intro",
  "dist": 50,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "8 min",
      "desc": "Pédalage souple Z1 (<126 W), montée progressive vers 155 W.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "30 min vélo",
      "desc": "30 min à 168–189 W (sweetspot / Z3 vélo). Cadence 85–90 rpm. Les 5 dernières minutes : monte la cadence à 90–95 rpm avec puissance légèrement réduite (150–160 W) pour préparer la transition.",
      "tip": "Les 5 dernières minutes à cadence haute activent les fibres musculaires pour la course et réduisent le temps d'adaptation à la foulée. C'est le secret de la transition vélo→run."
    },
    {
      "type": "interval",
      "dist": "Transition T2",
      "desc": "Transition rapide : descendre du vélo, chaussures de course, chrono relancé. Objectif : note le temps, sans pression. C'est ta première T2.",
      "tip": "La T2 se travaille à l'entraînement — chaque répétition optimise la séquence."
    },
    {
      "type": "main",
      "dist": "12 min run",
      "desc": "12 min de course immédiatement après le vélo. Cours à la sensation les 4 premières minutes — les jambes seront bizarres, c'est normal (passage du mode vélo au mode course). Après 4–5 min, cherche Z2 à 4:50–5:10/km.",
      "tip": "Ne te bats pas contre le corps les 3 premières minutes. Garde la régularité et ça revient. C'est la sensation que tu dois apprendre à gérer."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Marche 5 min, respiration nasale, récupération active.",
      "tip": ""
    }
  ],
  "tip": "Premier brick du programme. Objectif unique : découvrir la sensation de la transition vélo→course et apprendre à gérer les premières minutes sur jambes fatiguées. La performance est secondaire — c'est une découverte."
}
```

#### 1.7 — Mettre à jour les sessions modifiées (weekNums 2 à 10)

Pour chaque session listée ci-dessous, localise l'objet par son `"id"` dans `weeklyPlan` et remplace uniquement les champs indiqués. N'ajoute pas de champs absents de la session originale. Utilise le JSON complet fourni dans `coach-replan-vichy-70-3.md` pour chaque session marquée "RÉÉCRITURE COMPLÈTE" (tous les champs `name`, `typeLabel`, `dist`, `sets`, `tip` sont remplacés). Pour les sessions marquées "tip seulement" ou "sets[N].tip seulement", remplace uniquement le(s) champ(s) spécifié(s).

**weekNum 3**
- `rw3b` — champ `tip` uniquement.

**weekNum 4**
- `rw4a` — champ `tip` uniquement.
- `rw4b` — champs `sets[1].tip` (le bloc intervalles) et `tip`.

**weekNum 5**
- `rw5a` — champ `tip` uniquement.
- `bw5a` — champ `sets[1].tip` uniquement.

**weekNum 6**
- `rw6a` — champ `tip` uniquement.
- `rw6b` — champ `tip` uniquement.
- `bw6a` — champ `tip` uniquement.
- `brw6a` — **RÉÉCRITURE COMPLÈTE** (name, typeLabel, dist, sets, tip). Attention : le dist passe de 40 à 110, le nombre de sets change. Remplace l'objet entier, ID conservé.
- `mw6a` — champ `tip` uniquement.

**weekNum 7** — toutes les sessions sauf mw7a sont réécrites intégralement.
- `rw7a` — **RÉÉCRITURE COMPLÈTE**.
- `sw7a` — **RÉÉCRITURE COMPLÈTE**.
- `bw7a` — **RÉÉCRITURE COMPLÈTE**.
- `rw7b` — **RÉÉCRITURE COMPLÈTE**.
- `brw7a` — **RÉÉCRITURE COMPLÈTE**.
- `sw7b` — **RÉÉCRITURE COMPLÈTE** (passe de 65 min OWS à 30 min maintenance légère).
- `mw7a` — **AUCUN CHANGEMENT**.

**weekNum 8** — toutes les sessions restantes (après suppression de sw8b et mw8a) sont réécrites intégralement.
- `rw8a` — **RÉÉCRITURE COMPLÈTE** (65 min Z2 → 20 min activation J-1).
- `sw8a` — **RÉÉCRITURE COMPLÈTE** (65 min OWS → 30 min activation J-3).
- `bw8a` — **RÉÉCRITURE COMPLÈTE** (100 min sweetspot → 35 min activation J-2).
- `brw8a` — **RÉÉCRITURE COMPLÈTE** (85 min brick → 25 min récup active J+1). Attention : le type change de `"brick"` à `"r-recovery"` et le typeLabel change en conséquence.
- `rw8b` — **RÉÉCRITURE COMPLÈTE** : devient la session RACE 70.3 Vichy (type `"brick"`, dist 315, 7 sets incluant nage/T1/vélo/T2/run/cool/post-race).

**weekNum 9** — sessions restantes (après suppression de brw9a, sw9b, mw9a).
- `rw9a` — **RÉÉCRITURE COMPLÈTE**.
- `sw9a` — **RÉÉCRITURE COMPLÈTE**.
- `bw9a` — **RÉÉCRITURE COMPLÈTE**.
- `rw9b` — **RÉÉCRITURE COMPLÈTE**.

**weekNum 10** — sessions restantes (après suppression de rw10c).
- `sw10a` — **RÉÉCRITURE COMPLÈTE**.
- `bw10a` — **RÉÉCRITURE COMPLÈTE**.
- `rw10a` — **RÉÉCRITURE COMPLÈTE**.
- `rw10b` — **RÉÉCRITURE COMPLÈTE**.

Pour chaque réécriture complète, utilise le JSON fourni dans `coach-replan-vichy-70-3.md`, section correspondante. L'ID de session ne change jamais.

---

### CHANTIER 2 — Retrait du slider %brasse (saisie perf natation)

Les suppressions suivantes sont indépendantes du chantier 1. Effectue-les dans l'ordre ci-dessous pour éviter des références pendantes.

#### 2.1 — Supprimer la fonction `updateBrasseSlider`

**L4437-4443** — supprimer entièrement la fonction `updateBrasseSlider(input) { ... }` (6 lignes).

#### 2.2 — Supprimer le bloc slider dans `buildMetricsSection`

Dans la fonction `buildMetricsSection` (L4461), le bloc HTML du slider est à **L4486-4496** (environ) dans la template string de la discipline `swim`. Supprimer entièrement :
```html
<div class="perf-metric-block">
  <div class="perf-label-row">
    <span class="perf-label-row-left">Part brasse</span>
  </div>
  <div class="perf-slider-wrap">
    <input type="range" class="perf-slider" id="perf-brasse"
      min="0" max="50" step="5" value="${brasse}"
      style="background:linear-gradient(to right,#4ade80 0%,#4ade80 ${brassPct}%,#38bdf8 ${brassPct}%,#38bdf8 100%)"
      oninput="updateBrasseSlider(this)">
  </div>
  <div class="perf-slider-values" id="perf-brasse-display">${brasse}% brasse — ${100 - brasse}% crawl</div>
</div>
```

Supprimer également, dans la même fonction `buildMetricsSection`, les deux lignes de déclaration de variables devenues inutiles qui précèdent le template string (**L4469-4470**) :
```js
const brasse     = existing?.pctBrasse ?? 25;
const brassPct   = brasse * 2;
```

#### 2.3 — Supprimer l'écriture `data.pctBrasse` dans `submitPerfSheet`

Dans la fonction `submitPerfSheet` (L4619), dans le bloc `if (disc === 'swim')` :

- Supprimer **L4627** : `const brasseEl = document.getElementById('perf-brasse');`
- Supprimer **L4631** : `if (brasseEl) { data.pctBrasse = parseInt(brasseEl.value) || 0; }`

Assure-toi que les lignes restantes du bloc `swim` restent syntaxiquement correctes après suppression.

#### 2.4 — Supprimer l'affichage `% br.` dans `formatMetricLabel`

**L3362** — dans la fonction `formatMetricLabel` (L3359) :

Supprimer la ligne :
```js
if (perf && perf.pctBrasse != null) label += ' · ' + perf.pctBrasse + '% br.';
```

La fonction doit rester valide. Après suppression, le bloc `swim` de `formatMetricLabel` retourne simplement `secondsToMmss(value) + ' /100m'`.

#### 2.5 — Supprimer l'affichage `% brasse` dans le résumé perf

**L4708** — dans la fonction qui construit le résumé de perf de session (bloc `if (disciplineKey === 'swim')`), supprimer la ligne :
```js
if (perf.pctBrasse !== undefined) parts.push(`<span class="sum-val">${perf.pctBrasse}</span><span class="sum-label">% brasse</span>`);
```

#### 2.6 — NE PAS supprimer la classe CSS `.brasse`

**L489** : `.brasse { background: rgba(74,222,128,0.15); color: var(--green); border: 1px solid rgba(74,222,128,0.3); }` — cette classe CSS est utilisée par le système `nage-tag` (**L3537** : `class="nage-tag ${set.nage}"`) pour afficher le type de nage sur les blocs de sets dans les fiches séance. Elle est indépendante du slider. Ne pas la supprimer.

---

### CHANTIER 3 — Bump de version

#### 3.1 — Badge header

**L1531** : `<small class="app-version">v7</small>` → remplacer `v7` par `v8`.

#### 3.2 — Cache service worker

**sw.js, L1** : `const CACHE = 'hiplan-v7';` → remplacer `hiplan-v7` par `hiplan-v8`.

---

## Ce qu'il ne faut PAS faire

- Ne pas modifier les clés `STORE` définies à **L2944-2953** — toute modification casse les données utilisateur en localStorage.
- Ne pas supprimer ni migrer les données `pctBrasse` existantes en localStorage. Les anciennes fiches perf qui contiennent ce champ doivent rester lisibles sans erreur — on arrête uniquement d'écrire et d'afficher ce champ.
- Ne pas recréer une fonction `updateBrasseSlider` sous un autre nom ou emplacement.
- Ne pas modifier l'ID d'une session existante (même si le contenu est entièrement réécrit — l'ID est la clé de toutes les données enregistrées : complétion, résultats, notes, RPE).
- Ne pas ajouter de fichiers supplémentaires (images, scripts, CSS externes).
- Ne pas introduire de framework ou bibliothèque externe.
- Ne pas dupliquer des déclarations `const` ou `let` pour `TOTAL_WEEKS`, `WEEK_PHASES`, `STORE`, ou toute variable déjà déclarée dans le fichier.
- Ne pas hardcoder "14", "15" ou un autre nombre de semaines en remplacement de `TOTAL_WEEKS` dans les fonctions — utiliser uniquement la constante.
- Ne pas modifier `PHASE_COLORS` (**L3375**) — les 4 couleurs de phase sont conservées.
- Ne pas supprimer la classe CSS `.brasse` (**L489**) — elle est utilisée par le système `nage-tag` indépendamment du slider.
- Ne pas modifier `mw7a` — la section "weekNum 7" du document replan indique explicitement "AUCUN CHANGEMENT" pour cette session.
- Ne pas interpréter les weekNums du replan comme des dates : weekNum 8 = 19-25 août 2026, dimanche de course = 23 août. La valeur `TOTAL_WEEKS = 10` et le weekNum de la course (8) sont deux choses distinctes.

---

## Format de sortie attendu

- Modifie `index.html` en place. Retourne le fichier modifié.
- Modifie `sw.js` en place. Retourne le fichier modifié.
- Ne crée aucun fichier annexe.
- Ne modifie aucun autre fichier du projet (`manifest.json`, `icon-192.png`, etc.).

---

## Vérifications post-implémentation

Effectue ces vérifications avant de livrer :

1. **Compte de sessions** : `weeklyPlan.flatMap(w => w.sessions).length` doit être calculable manuellement :
   - S1 (existant, inchangé) : compter les sessions actuelles
   - S2 : +1 (bw2a ajouté)
   - S4 : +1 (brw4a ajouté)
   - S8 : -2 (sw8b, mw8a supprimés)
   - S9 : -3 (brw9a, sw9b, mw9a supprimés)
   - S10 : -1 (rw10c supprimé)
   - S11 à S14 : intégralement supprimés (~25 sessions)
   Vérifier que le total correspond au compte attendu et que `validatePlan()` (**L2924**) ne logue aucun avertissement en console.

2. **Aucune référence résiduelle aux weekNums 11-14** : grep `weekNum.*11|weekNum.*12|weekNum.*13|weekNum.*14` dans `weeklyPlan` — doit retourner 0 résultat.

3. **Aucune référence résiduelle à pctBrasse côté saisie** : grep `perf-brasse|pctBrasse|updateBrasseSlider` — les seules occurrences tolérées sont en lecture tolérante (aucune ne doit subsister dans le code d'écriture ou d'affichage saisie).

4. **`WEEK_PHASES` sans référence aux weekNums 11-14** : grep `11|12|13|14` dans la déclaration `WEEK_PHASES` — doit retourner 0 résultat.

5. **`TOTAL_WEEKS` = 10** : grep `TOTAL_WEEKS` — toutes les occurrences doivent pointer vers la constante, aucun hardcode résiduel.

6. **App chargeable** : ouvrir `index.html` en navigateur, vérifier l'absence d'erreur console (syntaxe JS, variable non définie, fonction inexistante). `validatePlan()` s'exécute au boot (**L5210**) et logue les IDs dupliqués ou invalides — la console doit être propre.

7. **Note utilisateur post-déploiement** (action manuelle, pas de code) : après déploiement, l'utilisateur devra mettre à jour la date de fin de programme dans l'interface de réglage (`hi_tri_program_end` en localStorage) pour qu'elle corresponde au dernier jour de la semaine 10 du programme (8 septembre 2026, soit `2026-09-08`). Sans cette mise à jour, `getProgramStartDate()` calculera une date de début erronée basée sur l'ancienne date stockée et le nouveau `TOTAL_WEEKS = 10`.
