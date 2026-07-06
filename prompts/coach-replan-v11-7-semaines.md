# Replan v11 — 70.3 Vichy — Structure 7 semaines
Généré le 2026-07-06

## Calage définitif

- **S1 = 6–12 juillet 2026** (lundi→dimanche). Aujourd'hui = J1 de S1.
- **Course = dimanche 23 août 2026 = dernier jour de S7** (weekNum 7).
- **Muscu abandonnée** : toutes les sessions mw* supprimées. Décision athlète ferme.
- **TOTAL_WEEKS : 10** (7 semaines training + 3 semaines récupération post-course)
- **Date de fin à saisir dans l'app : 2026-09-13** (dimanche 13 septembre, dernier jour de S10)

---

## Constantes JS à modifier dans index.html

### TOTAL_WEEKS
```javascript
// Inchangé (10 → 10)
const TOTAL_WEEKS = 10;
```

### WEEK_PHASES
```javascript
// Remplacer l'existant par :
const WEEK_PHASES = [
  { phase: 1, name: 'BASE AÉROBIE',      weeks: [1, 2] },
  { phase: 2, name: 'CONSTRUCTION 70.3', weeks: [3, 4] },
  { phase: 3, name: 'AFFÛTAGE & RACE',   weeks: [5, 6, 7] },
  { phase: 4, name: 'RÉCUPÉRATION',      weeks: [8, 9, 10] },
];
```

### weeklyPlan — champ phase par weekNum
| weekNum | phase |
|---------|-------|
| 1 | "base" |
| 2 | "base" |
| 3 | "construction" |
| 4 | "specifique" |
| 5 | "recovery" |
| 6 | "specifique" |
| 7 | "race" |
| 8 | "recovery" |
| 9 | "recovery" |
| 10 | "recovery" |

---

## SUPPRESSIONS

Sessions à retirer du weeklyPlan (supprimer de leur tableau sessions[]).

**Muscu (toutes) :** mw1a, mw2a, mw3a, mw4a, mw5a, mw6a, mw7a

**Natation :**
- sw1a (weekNum 1) — remplacée par sw1c (lac S1)
- sw4b (weekNum 4) — remplacée par sw4c (lac S4)
- sw6b (weekNum 6) — contenu déplacé dans sw4c ; session supprimée
- sw6a (weekNum 6) — absorbée par sw4a en weekNum 4
- sw2c — session créée dans les amendements v11 mais rendue caduque par ce replan ; ne pas créer

**Vélo :**
- bw3a (weekNum 3) — remplacée par bw6a déplacée en weekNum 3

**Course :**
- rw4b (weekNum 4) — base Ironman permet de sauter l'intro 4×5 seuil
- rw6a (weekNum 6) — absorbée par rw4a en weekNum 4

**Post-course (anciens numéros) :**
- rw10c (old weekNum 10) — était déjà supprimée dans le replan v8 ; confirmer absence

**Note localStorage :** aucune session de v9 n'a encore d'état checked (S1 J1). Zéro risque de conflit.

---

## AJOUTS

Sessions nouvelles — fournir contenu complet au dev.

---

### weekNum 1 — sw1c (NOUVEAU)

```
weekNum  : 1
id       : "sw1c"
name     : "Natation — Première sortie eau libre"
type     : "s-technique"
typeLabel: "40 min · Lac, sans combi, exposition"
dist     : 40
unit     : "min"
```

**sets[0] — warm**
```
type : "warm"
dist : "10 min"
desc : "Entrée dans l'eau progressive : wader jusqu'à la ceinture, puis jusqu'aux épaules. Immerge le visage 3 fois en soufflant les bulles lentement. Reste 30 secondes face vers le fond : eau sombre, fond invisible, pas de ligne — observe sans résister. C'est le cadre réel. Puis 100 m de crawl très souple en restant proche du bord."
tip  : ""
```

**sets[1] — main**
```
type : "main"
dist : "3 × 100 m"
desc : "3 × 100 m crawl continu. Récupération 45 s (dos au bord ou nage sur place). Sur chaque 100 m : sighting toutes les 8 brassées sur un repère fixe à l'horizon (bouée, arbre, construction), expiration aquatique complète, battement 2 temps naturel — les jambes stabilisent l'alignement, elles ne propulsent pas. Allure libre, aucune consigne de vitesse. Observe : tu déries ? Le souffle change ? Le fond invisible perturbe le rythme ?"
tip  : "L'objectif n'est pas la performance — c'est de collecter de l'information réelle sur tes déclencheurs en eau libre. Tout ce que tu ressens ici est utile."
```

**sets[2] — interval**
```
type : "interval"
dist : "2 × 25 m"
desc : "Simulation de départ en eau libre : 2 × 25 m. Départ debout depuis le bord ou depuis de l'eau à hauteur de poitrine. 10 m à allure vive (reproduction de l'emballement du départ) → 3 expirations forcées sous l'eau en continuant à nager → 15 m crawl calme. Récupération 60 s. Objectif : vérifier que le protocole de retour au calme fonctionne hors de la piscine."
tip  : "Seulement 2 répétitions — c'est une séance d'exposition, pas d'entraînement. Si le retour au calme arrive avant les 15 m restants, c'est parfait."
```

**sets[3] — cool**
```
type : "cool"
dist : "100 m"
desc : "100 m crawl très souple en restant proche du bord. Sortie progressive. Bilan mental avant de quitter l'eau : (1) la nage était-elle différente de la piscine ? (2) le souffle était-il plus difficile à réguler ? (3) le sighting a-t-il fonctionné sans ligne noire de repère ?"
tip  : ""
```

**tip session :**
> Première sortie eau libre du programme — priorité à l'exposition, pas à la performance. L'objectif est de rencontrer les vrais déclencheurs sensoriels (eau sombre, fond invisible, absence de ligne) dans un contexte où tu contrôles tout : durée, distance, proximité du bord. Si l'emballement respiratoire arrive, tu sais maintenant comment le dissoudre. Si la nage semble normale, tu as une information précieuse. Dans tous les cas, tu sors de cette séance avec du réel sur ce qui t'attend le 23 août.

---

### weekNum 4 — sw4c (NOUVEAU)

```
weekNum  : 4
id       : "sw4c"
name     : "Natation — Sortie eau libre longue (combinaison)"
type     : "s-endurance"
typeLabel: "65 min · Lac, combinaison, 1800 m"
dist     : 65
unit     : "min"
```

**sets[0] — warm**
```
type : "warm"
dist : "200 m"
desc : "Mise en place wetsuit avant entrée dans l'eau (prévoir 10 min). Entrée progressive : immerge le visage, souffle les bulles, prends 30 s pour ressentir la flottabilité de la combinaison — les hanches remontent passivement. 200 m crawl souple pour calibrer la nouvelle position. Note : la combi ralentit légèrement le retour du bras aérien — raccourcis un peu le rythme de bras, ne force pas l'amplitude."
tip  : ""
```

**sets[1] — main**
```
type : "main"
dist : "1800 m"
desc : "1800 m crawl continu. Décompose en 3 × 600 m, pause 30 s (repos sur l'eau ou au bord) entre chaque bloc. Protocole OWS par bloc :\n• 600 m 1 : respiration dominante, sighting toutes les 10 brassées sur un repère fixe à l'horizon, expiration aquatique complète. Bloc de calibrage — ni trop vite, ni trop lent.\n• 600 m 2 : bilatérale toutes les 3 brassées, sighting maintenu, nage longue et relâchée. Teste la gestion respiratoire avec la combi sur durée.\n• 600 m 3 : rythme naturel, sighting toutes les 8 brassées (fréquence de course), gestion de l'allure prioritaire. C'est ton bloc de référence race-pace.\nSur l'intégralité : battement 2 temps naturel — les jambes stabilisent l'alignement, elles ne propulsent pas. Hanches hautes, orteils pointés vers l'arrière. Avec la combinaison, la flottabilité amplifie l'effet du 2T."
tip  : "Si la bilatérale sur le 2e bloc perturbe le souffle plus qu'en piscine, reviens à ton côté dominant. L'objectif est la confiance en eau ouverte sur la durée, pas une contrainte technique supplémentaire."
```

**sets[2] — cool**
```
type : "cool"
dist : "100 m"
desc : "100 m crawl très souple, puis sortie progressive. Retrait du wetsuit : humidifie les chevilles et les poignets avant d'enlever, ne tire pas la fermeture à la va-vite."
tip  : ""
```

**tip session :**
> 1800 m en eau libre avec combinaison — le cap psychologique de la préparation. Tu as nagé en piscine, tu as fait une première sortie eau libre courte en S1 : aujourd'hui tu valides la vraie distance dans les conditions probables de la course. Cette sortie livre deux informations clés : ton allure réelle avec combi en eau libre et la confirmation que la gestion respiratoire OWS tient sur la distance. Si Vichy autorise la combinaison (eau ≤24.5°C), c'est exactement ce que tu vivras le 23 août.

---

### weekNum 10 — sessions libres post-récupération

**sw10b (NOUVEAU)**
```
weekNum  : 10
id       : "sw10b"
name     : "Natation — Maintien technique"
type     : "s-endurance"
typeLabel: "45 min · Reprise qualité"
dist     : 45
unit     : "min"
sets:
  [0] warm  : 200 m crawl souple
  [1] main  : 1000 m crawl continu à allure confortable. Bilatérale toutes les 3 brassées sur la moitié du parcours, expiration aquatique maintenue, sighting toutes les 12 brassées.
  [2] interval : 4 × 25 m à allure soutenue, récupération 40 s.
  [3] cool  : 100 m très souple.
tip session : "S10 : l'entraînement reprend sans objectif de charge. Cette séance maintient les automatismes OWS acquis — bilatérale, sighting, expiration. Le prochain objectif définira la structure du cycle suivant."
```

**bw10b (NOUVEAU)**
```
weekNum  : 10
id       : "bw10b"
name     : "Vélo — Z2 consolidation"
type     : "b-endurance"
typeLabel: "60 min · Z2"
dist     : 60
unit     : "min"
sets:
  [0] warm  : 10 min progressif Z1 → 140 W
  [1] main  : 45 min à 126–168 W (Z2 complète, 60–80% FTP). Cadence 85–90 rpm.
  [2] cool  : 5 min retour <120 W
tip session : "Vélo de reprise consolidée. Si les 45 min à Z2 se passent sans fatigue, la récupération post-course est complète. Signal de disponibilité pour le prochain cycle."
```

**rw10c (NOUVEAU)**
```
weekNum  : 10
id       : "rw10c"
name     : "Run Z2 — Clôture du programme"
type     : "r-endurance"
typeLabel: "50 min · Z2"
dist     : 50
unit     : "min"
sets:
  [0] warm  : 8 min trot Z1
  [1] main  : 37 min course continue Z2 à 4:50–5:10/km. Régularité, aucune structure.
  [2] cool  : 5 min trot Z1 + marche 2 min
tip session : "Dernière séance du programme. Communique au coach tes sensations depuis S8 : tu arrives à ce point avec 3 semaines de récupération bien menées. Le prochain cycle peut être planifié."
```

---

## DÉPLACEMENTS + MODIFICATIONS

Sessions déplacées vers un nouveau weekNum. Contenu complet fourni pour les sessions modifiées ; ancre + champs modifiés pour les sessions déplacées avec retouches mineures ; note "contenu inchangé" pour les pures remises en place.

---

### weekNum 3 — bw6a (DÉPLACÉ depuis weekNum 6)

```
weekNum  : 3
id       : "bw6a"
name     : "Vélo — Sweet Spot long"
type     : "b-sweetspot"
typeLabel: "85 min · Sweet spot"
dist     : 85
unit     : "min"
```

**sets[0] — warm (inchangé v9)**
```
type : "warm"
dist : "15 min"
desc : "15 min progressif de Z1 à Z2. Cadence 85–90 rpm."
tip  : ""
```

**sets[1] — interval (inchangé v9)**
```
type : "interval"
dist : "2 × 25 min"
desc : "2 blocs de 25 min à sweet spot 168–189 W (80–90% FTP). Récupération 5 min Z1 entre blocs. Cadence 85–90 rpm."
tip  : "25 min de sweet spot : montée en puissance avant le pic de S4. Tu entretiens la capacité à maintenir l'effort dans la durée sans recréer une surcharge Ironman."
```

**sets[2] — cool (inchangé v9)**
```
type : "cool"
dist : "10 min"
desc : "Retour progressif à <126 W, pédalage souple 5 min."
tip  : ""
```

**tip session (MODIFIÉ) :**
> 2 × 25 min sweetspot : montée en puissance du vélo avant la semaine de pic S4. Si tu tiens la puissance proprement en fin de 2e bloc, le long ride Z2 et le brick de S4 sont dans tes capacités. Pas de charge maximale ici — progression propre.

---

### weekNum 3 — brw4a (DÉPLACÉ depuis weekNum 4)

Contenu v10 (tip déjà mis à jour "rappel de transition"). Tip inchangé, aucune référence au weekNum.

```
weekNum  : 3
id       : "brw4a"
name     : "Brick — Premier enchaînement"
type     : "brick"
typeLabel: "50 min · Brick intro"
dist     : 50
unit     : "min"
```

**sets (identiques à l'état v10 — cf. coach-amendements-v10.md, brw4a)**

**Note séquençage S3 :** brw4a et bw6a ne doivent pas être dos à dos. Recommandation : bw6a milieu de semaine, brw4a en fin de semaine (au moins J+2 après bw6a).

---

### weekNum 4 — rw4a (MODIFICATION EN PLACE)

*Déjà en weekNum 4, contenu modifié depuis v11.*

**Ancre :** `name: "Footing Z2 — Long"` / `dist: 60`

**Champs modifiés :**
- name → "Footing Z2 — Volume ajusté"
- typeLabel → "40 min · Z2"
- dist → 40
- sets[1].dist → "25 min"
- sets[1].desc → "Course continue Z2 à 4:50–5:10/km. Allure régulière, effort constant. Surface souple recommandée. Volume réduit (40 min au lieu de 60 min) — compensation directe de la sortie longue vélo bw4a en S4."
- tip → "Séance raccourcie de 60 à 40 min : la contrepartie explicite de bw4a (2h15 Z2). 25 min de Z2 propre — le stimulus aérobie est maintenu, la charge globale de S4 reste maîtrisée."

---

### weekNum 4 — bw4a (MODIFICATION EN PLACE)

*Déjà en weekNum 4, contenu intégralement modifié depuis v11.*

**Ancre :** `name: "Vélo — Sweet Spot"` / `type: "b-sweetspot"` / `dist: 80`

**Contenu complet :**

```
id       : "bw4a"
name     : "Vélo — Sortie longue Z2 + nutrition"
type     : "b-endurance"
typeLabel: "135 min · Z2 long"
dist     : 135
unit     : "min"
```

**sets[0] — warm**
```
type : "warm"
dist : "15 min"
desc : "Pédalage progressif de Z1 (<126 W) vers Z2 basse (130–140 W) sur 15 min. Cadence libre, jambes qui se réveillent."
tip  : ""
```

**sets[1] — main**
```
type : "main"
dist : "105 min"
desc : "105 min à 126–160 W (Z2 vélo, 60–76% FTP). Cadence cible 85–90 rpm. Effort conversationnel — si tu dois choisir entre rester dans les watts et ne plus pouvoir parler, réduis les watts. Protocole nutrition obligatoire : 60–80 g de glucides par heure (1 gel toutes les 25–30 min ou équivalent), 500 ml de liquide minimum par heure. C'est la répétition du protocole de course sur une durée proche de la réalité de Vichy."
tip  : "À 70 min, fais un bilan actif : position des mains et du dos, confort de selle, fluidité de pédalage. Ajuste si nécessaire — il vaut mieux identifier les problèmes ici que le 23 août."
```

**sets[2] — cool**
```
type : "cool"
dist : "15 min"
desc : "Retour progressif à <126 W sur 15 min. Pédalage très souple, jambes qui récupèrent."
tip  : ""
```

**tip session :**
> Sortie longue Z2 — ton filet de sécurité psychologique avant la race week. 2h15 à allure conversationnelle : position validée sur durée réelle, protocole nutrition testé (60–80 g/h — répétition obligatoire du protocole de course), tolérance selle confirmée. Ta base Ironman garantit que le vélo est dans tes capacités — cette séance transforme la certitude physiologique en certitude mentale. Séquence S4 recommandée : bw4a au milieu de semaine, à J-2 minimum avant brw6a (brick long).

---

### weekNum 4 — rw6b (DÉPLACÉ depuis weekNum 6 + MODIFIÉ)

```
weekNum  : 4
id       : "rw6b"
name     : "Run Seuil — Séance pic"
type     : "r-threshold"
typeLabel: "60 min · Seuil"
dist     : 60
unit     : "min"
```

**sets[0] — warm (inchangé v9)**
```
type : "warm"
dist : "15 min"
desc : "12 min trot Z1, puis 3 min accélération vers Z3. Éducatifs : 4 × 30 m montées de genoux + 2 × 60 m accélérations progressives."
tip  : ""
```

**sets[1] — interval (MODIFIÉ)**
```
type : "interval"
dist : "5 × 5 min"
desc : "5 répétitions de 5 min à allure seuil 4:00–4:10/km. Récupération 90 s trot Z1 entre reps. Première séance seuil du programme — volume d'emblée au maximum car la base Ironman permet de sauter l'introduction progressive."
tip  : "Récupération 90 s : tu ne récupères pas totalement entre les reps — c'est voulu. Décision à prendre avant la séance, pas pendant : si à la sortie de la 3e rep tu n'es plus dans 4:05–4:10/km, tu t'arrêtes à 4 reps. Pas d'improvisation, pas d'ego. Dans la semaine de pic, 4 reps propres valent plus que 5 reps dégradées. La 4e rep qui finit dans 4:05–4:10 valide la séance."
```

**sets[2] — cool (inchangé v9)**
```
type : "cool"
dist : "10 min"
desc : "Trot Z1 décroissant 8 min puis marche 2 min."
tip  : ""
```

**tip session :**
> 5 × 5 min seuil à 90 s de récup : séance de qualité la plus exigeante du programme run, placée dans la semaine de pic. Si tu arrives en S4 sans résidu de fatigue de S3, tu dois tenir. Bonne séance seuil ici = tu es sur la trajectoire pour courir 4:35–4:45/km le 23 août après 90 km de vélo. S'arrêter à 4 reps propres si le garde-fou s'active : c'est la bonne décision, pas un échec.

---

### weekNum 4 — brw6a (DÉPLACÉ depuis weekNum 6)

Contenu v10 (168–178 W tempo confort). Aucune référence au weekNum dans les tips existants — valides en weekNum 4.

```
weekNum  : 4
id       : "brw6a"
name     : "Brick Long — Simulation 70.3"
type     : "brick"
typeLabel: "110 min · Brick long"
dist     : 110
unit     : "min"
```

**sets (identiques à l'état v10 — cf. coach-amendements-v10.md, brw6a)**

Résumé des valeurs v10 :
- sets[1].desc : "80 min à 168–178 W (tempo confort, 80–85% FTP)..."
- sets[1].tip : "80 min de tempo confort avant un run : rappel de spécificité 70.3..."
- tip session : "Brick principal du programme — rappel de spécificité 70.3..."

**Vérification séquençage S4 :** brw6a et rw6b sont les 2 séances les plus exigeantes de S4. Ne pas les placer dos à dos. Recommandation : rw6b en début de semaine (J1–J2), brw6a en milieu-fin de semaine (J4–J5), bw4a entre les deux (J3).

---

### weekNum 6 — rw7a (DÉPLACÉ depuis weekNum 7)

Contenu inchangé, tip avec référence de semaine mise à jour.

```
weekNum  : 6
id       : "rw7a"
name     : "Run Z2 — Affûtage"
```

**Champ modifié :**
- tip : "S6 = affûtage. Volume fortement réduit vs S4. La forme monte pendant les jours de repos relatif — moins c'est mieux cette semaine sur les séances Z2."

*(reste du contenu inchangé par rapport à l'état v9)*

---

### weekNum 6 — bw7a (DÉPLACÉ depuis weekNum 7)

Contenu inchangé, tip mis à jour.

```
weekNum  : 6
id       : "bw7a"
name     : "Vélo — Activation taper sweetspot + race pace"
```

**Champ modifié :**
- tip : "Volume vélo fortement réduit vs S4 (135 min + 110 min brick). L'intensité reste présente sur courtes fenêtres pour garder les fibres rapides actives. Cette séance touche l'allure race sur 5 min — ancrage de la sensation avant J-9 à J-7."

*(reste du contenu inchangé par rapport à l'état v9)*

---

### weekNum 6 — rw7b (DÉPLACÉ depuis weekNum 7)

Contenu inchangé — aucune référence de semaine dans les tips.

```
weekNum  : 6
id       : "rw7b"
```

*(contenu identique à l'état v9)*

---

### weekNum 6 — brw7a (DÉPLACÉ depuis weekNum 7)

Contenu inchangé — aucune référence de semaine dans les tips.

```
weekNum  : 6
id       : "brw7a"
```

*(contenu identique à l'état v9)*

---

### weekNum 6 — sw7a (DÉPLACÉ depuis weekNum 7 + MODIFIÉ : lac sans combinaison)

```
weekNum  : 6
id       : "sw7a"
name     : "Natation — Sortie eau libre pré-course (sans combinaison)"
type     : "s-technique"
typeLabel: "40 min · Lac, sans combi, pré-course"
dist     : 40
unit     : "min"
```

**sets[0] — warm**
```
type : "warm"
dist : "200 m"
desc : "Entrée dans l'eau sans combinaison : wader progressivement jusqu'aux épaules. Routine de mise à l'eau : visage immergé 3 fois, bulles lentes. Note immédiatement la position des hanches sans la combi — elles peuvent s'enfoncer légèrement. Active le battement 2 temps dès les premiers mètres : orteils pointés vers l'arrière, hanches hautes. 200 m crawl souple pour trouver et stabiliser la position sans flottabilité assistée."
tip  : ""
```

**sets[1] — main**
```
type : "main"
dist : "4 × 75 m"
desc : "4 × 75 m OWS. Récupération 40 s (sur l'eau ou au bord). Sur chaque 75 m : 25 m sighting actif toutes les 8 brassées (yeux au niveau de l'eau, redescente immédiate) + 50 m crawl relâché, expiration aquatique complète, battement 2 temps naturel maintenu sans la flottabilité de la combi. Pas de bilatérale imposée — rythme libre. Objectif central : confirmer que les automatismes (2T, sighting, expirations) tiennent sans l'aide de la combinaison."
tip  : "Si les hanches coulent malgré le 2T actif : redresse légèrement la tête sur quelques brassées pour les faire remonter, puis reviens à la position normale — c'est la compensation temporaire."
```

**sets[2] — interval**
```
type : "interval"
dist : "3 × 25 m"
desc : "Simulation de départ finale sans combi : 3 × 25 m. Départ debout. 15 m à allure vive → 3 expirations forcées sous l'eau en continuant à nager → 10 m crawl calme. Récupération 50 s. C'est exactement le protocole du 23 août si la combinaison est interdite."
tip  : "Si le retour au calme prend encore plus de 3 expirations, pars en dehors de la masse le jour J et prends ton rythme sur les 100 premiers mètres. C'est la bonne stratégie de toute façon."
```

**sets[3] — cool**
```
type : "cool"
dist : "100 m"
desc : "100 m crawl très souple, sortie progressive. Bilan avant de sortir de l'eau : les hanches tenaient-elles avec le 2T actif ? Le sighting était-il naturel sans ligne noire ? Le retour au calme post-départ a-t-il fonctionné ?"
tip  : ""
```

**tip session :**
> Troisième et dernière sortie eau libre — scénario sans combinaison, le plus exigeant. Tu arrives ici avec sw1c (S1) et sw4c (S4) derrière toi. L'objectif : confirmer que les automatismes (2T, sighting, expirations forcées) tiennent sans l'aide de la flottabilité. Si tout tient, tu es paré pour les deux scénarios du 23 août. Si la combi est interdite le 23 août (eau >24.5°C), c'est exactement ce que tu vivras.

---

### weekNum 6 — sw7b (DÉPLACÉ depuis weekNum 7 + MODIFIÉ : optionnel explicite)

```
weekNum  : 6
id       : "sw7b"
name     : "Natation — Maintien aquatique léger (optionnel)"
typeLabel: "30 min · Optionnel"
```

**Champ modifié :**
- tip : "Session optionnelle en semaine d'affûtage — ne pas la faire si les épaules ou les bras tirent, si sw7a en eau libre était exigeante, ou si la fatigue est présente. Remplace par 20 min de marche et étirements doux. L'objectif si elle est faite : maintenir le sens de l'eau, rien de plus."

*(nom, typeLabel modifiés ; reste du contenu inchangé)*

---

### weekNum 7 — sw8a, bw8a, rw8a (DÉPLACÉS depuis weekNum 8)

Contenu identique à l'état v9. Aucune référence de semaine dans les tips. Pures remises en place.

```
weekNum : 7
ids     : sw8a, bw8a, rw8a
```

*(contenu identique à l'état v9)*

---

### weekNum 7 — rw8b (DÉPLACÉ depuis weekNum 8 + MODIFIÉ)

```
weekNum  : 7
id       : "rw8b"
name     : "RACE — 70.3 du 23 août"
type     : "brick"
typeLabel: "Race · 70.3"
dist     : 315
unit     : "min"
```

**sets (identiques à v9) :**
- sets[0] warm : inchangé
- sets[1] main Nage 1900 m : inchangé *sauf* sets[1].tip → ajouter "Tu as entraîné ce protocole pendant 7 semaines." (remplacer "8 semaines" par "7 semaines")
- sets[2] T1 : inchangé
- sets[3] main Vélo 90 km : **MODIFIÉ** (v10 — marge 180–190 W km 15+ si bonnes sensations ; contenu complet dans coach-amendements-v10.md)
- sets[4] T2 : inchangé
- sets[5] main Run 21,1 km : inchangé
- sets[6] cool Post-race : inchangé

**tip session (MODIFIÉ — v10 + v11 + correction "8→7 semaines") :**
> C'est la course. 7 semaines de travail mènent ici — mais en réalité, plusieurs mois de préparation Ironman sont dans les jambes. Tu arrives sur ce 70.3 avec la condition d'un athlète longue distance : la distance est dans tes capacités profondes, pas juste dans tes objectifs. Ce n'est pas de l'arrogance, c'est du réalisme. Plan de course : conservateur sur la nage et les 15 premiers km vélo, régulier sur le reste du vélo et les 18 premiers km run, tout ce qui reste sur les 3 derniers km. — Trois rappels nage pour ne pas les oublier sur la plage de départ : (1) immersion du visage + bulles lentes avant le coup de feu, (2) si le souffle s'emballe : 3 expirations forcées sous l'eau en continuant à nager, (3) sighting yeux à ras de l'eau toutes les 8 brassées. — Combinaison autorisée (eau ≤24.5°C) : la flottabilité remonte les hanches passivement — tu as pratiqué ça au lac en S4. La combi raccourcit légèrement le retour du bras aérien : rythme adapté, pas forcé. Position protégée, nage confiante. — Sans combinaison (eau >24.5°C) : scénario répété au lac en S6. Active le 2T dès les premiers mètres, hanches hautes, orteils pointés. L'expiration aquatique complète maintient la position sur 1900 m. Tu sais ce que ça fait — fais confiance à S6. Confiance dans le corps — il sait quoi faire.

---

### weekNum 8 — rw8c (DÉPLACÉ depuis weekNum 8 de l'ancien plan)

rw8c était dans old weekNum 8 (race week). Dans le nouveau plan, weekNum 7 = race week (dimanche 23 août). Le lendemain (lundi 24 août) appartient à new weekNum 8. rw8c (J+1) va donc en weekNum 8.

```
weekNum  : 8
id       : "rw8c"
```

**Champ modifié :**
- tip : "J+1 post-course : le trot léger ou la marche accélèrent la récupération. S8 commence la décélération — cette séance est la transition."

*(reste du contenu identique à l'état v9)*

---

### weekNum 8 — rw9a, sw9a, bw9a, rw9b (DÉPLACÉS depuis weekNum 9)

weekNum 9 de l'ancien plan = weekNum 8 du nouveau plan.

```
weekNum  : 8
ids      : rw9a, sw9a, bw9a, rw9b
```

**Champs modifiés (tips uniquement) :**
- rw9a tip : "S8 = récupération non-négociable. Le corps vient de traverser 5h+ d'effort. Cette semaine, toute séance se termine sans fatigue supplémentaire."
- rw9b tip : "Fin de S8 : si tu sors de cette séance avec des jambes relativement légères, la récupération post-course progresse bien. Le prochain cycle (objectif à définir) peut commencer à se dessiner."

*(reste du contenu identique à l'état v9)*

---

### weekNum 9 — sw10a, bw10a, rw10a, rw10b (DÉPLACÉS depuis weekNum 10)

weekNum 10 de l'ancien plan = weekNum 9 du nouveau plan.

```
weekNum  : 9
ids      : sw10a, bw10a, rw10a, rw10b
```

**Champs modifiés (tips uniquement) :**
- rw10a tip : "S9 marque la fin de la récupération et le début d'une période libre. C'est le moment de définir le prochain objectif et d'en informer le coach pour programmer le cycle suivant."
- rw10b tip : "55 min de Z2 : fin de la période de récupération. À ce stade, le prochain objectif devrait être identifié — le coach prend en main le cycle suivant dès S10."

*(reste du contenu identique à l'état v9)*

---

## RETOUCHES EN PLACE

Sessions qui restent dans leur weekNum — seuls quelques champs changent.

---

### weekNum 3 — rw3b — sets[1].tip

**Ancre :** `"c'est acceptable en S4"`

**Nouvelle valeur :**
> Le 3e bloc est le plus dur. Si tu es à 4:35 sur le 3e, c'est acceptable en S3. Si tu passes à 4:50, tu es sorti du tempo — raccourcis le bloc plutôt que de le bâcler.

---

### weekNum 5 — rw5a — sets[1].desc

**Ancre :** `"lourdes après S5"`

**Nouvelle valeur :**
> Course Z1 à >5:30/km, perception d'effort quasi nulle. Les jambes ont le droit d'être lourdes après S4.

---

## TABLEAU RÉCAPITULATIF — SESSIONS PAR WEEKNUM

### weekNum 1 (Base — Jul 6–12)
| ID | Statut | Note |
|----|--------|------|
| rw1a | inchangé | v9 + v10 tip (décompression IM) |
| rw1b | inchangé | v9 |
| sw1b | inchangé | v9 + 2T cue v10 |
| sw1c | NOUVEAU | lac, sans combi, 40 min |
| sw1a | SUPPRIMÉ | remplacé par sw1c |
| mw1a | SUPPRIMÉ | muscu abandonnée |

### weekNum 2 (Base — Jul 13–19)
| ID | Statut | Note |
|----|--------|------|
| rw2a | inchangé | v9 |
| rw2b | inchangé | v9 |
| sw2a | inchangé | v9 — pool OWS technique MAINTENU (lac en S1) |
| sw2b | inchangé | v9 + 2T cue v10 |
| bw2a | inchangé | v9 |
| mw2a | SUPPRIMÉ | muscu abandonnée |

### weekNum 3 (Construction — Jul 20–26)
| ID | Statut | Note |
|----|--------|------|
| rw3a | inchangé | v9 + v10 tip "entretien actif" |
| rw3b | retouche | sets[1].tip : "S4"→"S3" |
| sw3a | inchangé | v9 |
| sw3b | inchangé | v9 + 2T cue v10 |
| bw6a | DÉPLACÉ depuis wN6 | tip mis à jour pour S3 |
| brw4a | DÉPLACÉ depuis wN4 | tip v10 "rappel de transition" |
| bw3a | SUPPRIMÉ | remplacé par bw6a |
| mw3a | SUPPRIMÉ | muscu abandonnée |

### weekNum 4 (Spécifique/Pic — Jul 27–Aug 2)
| ID | Statut | Note |
|----|--------|------|
| rw4a | modifié en place | 60→40 min Z2 (compensation bw4a) |
| rw6b | DÉPLACÉ depuis wN6 + modifié | seuil 5×5 + garde-fou P7 + "Progression" réécrit |
| sw4a | inchangé | v9 |
| sw4c | NOUVEAU | lac 1800 m, combinaison |
| bw4a | modifié en place | long Z2 135 min + nutrition v11 |
| brw6a | DÉPLACÉ depuis wN6 | contenu v10 (168–178 W) |
| sw4b | SUPPRIMÉ | remplacé par sw4c |
| rw4b | SUPPRIMÉ | base IM permet saut intro seuil |
| mw4a | SUPPRIMÉ | muscu abandonnée |

### weekNum 5 (Récupération — Aug 3–9)
| ID | Statut | Note |
|----|--------|------|
| rw5a | retouche | sets[1].desc : "S5"→"S4" |
| rw5b | inchangé | v9 |
| sw5a | inchangé | v9 |
| sw5b | inchangé | v9 + 2T cue v10 |
| bw5a | inchangé | v9 |
| mw5a | SUPPRIMÉ | muscu abandonnée |

### weekNum 6 (Affûtage — Aug 10–16)
| ID | Statut | Note |
|----|--------|------|
| rw7a | DÉPLACÉ depuis wN7 | tip : "S7"→"S6" |
| bw7a | DÉPLACÉ depuis wN7 | tip : références volume mis à jour |
| rw7b | DÉPLACÉ depuis wN7 | inchangé |
| brw7a | DÉPLACÉ depuis wN7 | inchangé |
| sw7a | DÉPLACÉ depuis wN7 + MODIFIÉ | lac, sans combi, contenu complet ci-dessus |
| sw7b | DÉPLACÉ depuis wN7 + MODIFIÉ | optionnel explicite (name + typeLabel + tip) |
| mw7a | SUPPRIMÉ | muscu abandonnée |
| rw6a | SUPPRIMÉ depuis wN6 | absorbé par rw4a en wN4 |
| sw6a | SUPPRIMÉ depuis wN6 | absorbé par sw4a en wN4 |
| sw6b | SUPPRIMÉ depuis wN6 | remplacé par sw4c (lac) |

### weekNum 7 (Race — Aug 17–23, course dimanche 23)
| ID | Statut | Note |
|----|--------|------|
| sw8a | DÉPLACÉ depuis wN8 | inchangé |
| bw8a | DÉPLACÉ depuis wN8 | inchangé |
| rw8a | DÉPLACÉ depuis wN8 | inchangé |
| rw8b | DÉPLACÉ depuis wN8 + MODIFIÉ | "7 semaines" + Ironman v10 + wetsuit v11 |

### weekNum 8 (Récup post-course — Aug 24–30)
| ID | Statut | Note |
|----|--------|------|
| rw8c | DÉPLACÉ (wN8→wN8, J+1 lundi) | tip : "S9"→"S8" |
| rw9a | DÉPLACÉ depuis wN9 | tip : "S9"→"S8" |
| sw9a | DÉPLACÉ depuis wN9 | inchangé |
| bw9a | DÉPLACÉ depuis wN9 | inchangé |
| rw9b | DÉPLACÉ depuis wN9 | tip fin de semaine mis à jour |

### weekNum 9 (Récup/Reprise — Aug 31–Sep 6)
| ID | Statut | Note |
|----|--------|------|
| sw10a | DÉPLACÉ depuis wN10 | inchangé |
| bw10a | DÉPLACÉ depuis wN10 | inchangé |
| rw10a | DÉPLACÉ depuis wN10 | tip : "S10"→"S9" |
| rw10b | DÉPLACÉ depuis wN10 | tip : "S11"→"S10" |

### weekNum 10 (Transition libre — Sep 7–13)
| ID | Statut | Note |
|----|--------|------|
| sw10b | NOUVEAU | natation maintien 45 min |
| bw10b | NOUVEAU | vélo Z2 60 min |
| rw10c | NOUVEAU | run Z2 50 min |

---

## PÉRIODISATION EXPLIQUÉE À L'ATHLÈTE

**7 semaines de préparation, 3 semaines de retour (10 semaines total, fin programme : 13 septembre 2026)**

**S1 — 6 juillet : Décompression active + premier lac**
Tu sors d'une préparation Ironman complète et d'une annulation à deux jours de la course. Cette semaine ne construit pas — elle préserve et oriente. Le seul événement marquant est la première sortie en eau libre (sw1c), courte et sans pression : 300-400 m pour rencontrer tes vrais déclencheurs sensoriels hors piscine. Sans combinaison — tu affronte les conditions les plus difficiles d'emblée, à un moment où la charge est basse.

**S2 — 13 juillet : Base avec premier vélo**
Le programme vélo démarre (bw2a, 60 min Z2). Run : Z2 + premier tempo (2×10 min). Natation : technique OWS en piscine (sw2a) + endurance 800 m (sw2b). Volume léger, automatismes OWS qui s'installent.

**S3 — 20 juillet : Construction + premier sweetspot + premier brick**
Montée de charge : tempo run (3×10 min), vélo sweetspot (bw6a, 2×25 min), premier brick du cycle (brw4a, 50 min). Deux qualités run dans la même semaine avec ta base — maîtrisable. Le brick est l'événement clé de S3 : premier rappel de transition vélo→course.

**S4 — 27 juillet : Semaine de pic — tout le bloc en une semaine**
La semaine la plus exigeante du programme. Elle concentre : sortie longue vélo Z2 (bw4a, 2h15 avec protocole nutrition), seuil run 5×5 à 90 s de récup (rw6b), sortie lac 1800 m avec combinaison (sw4c), brick long 110 min (brw6a). Le Z2 run (rw4a) est volontairement raccourci (40 min) pour absorber la surcharge vélo. L'ordre recommandé dans la semaine : seuil run en début (J2), long ride milieu (J4), brick fin (J6). Le lac peut s'intercaler sur un créneau moins chargé. Deux informations que tu ramènes de cette semaine : (1) ton allure avec combi en eau libre sur 1800 m, (2) si 168–178 W sur 80 min te laisse des jambes pour courir 4:35–4:45/km.

**S5 — 3 août : Récupération obligatoire**
Volume –35% vs S4. Z1/Z2 uniquement. Aucune qualité, aucun seuil. La forme se construit pendant le repos.

**S6 — 10 août : Affûtage + dernière sortie lac**
Volumes réduits sur toutes les disciplines. Intensité maintenue sur courtes fenêtres : sweetspot 2×15 min + touches race pace 5 min vélo (bw7a), blocs allure 70.3 run (rw7b), brick court (brw7a). La séance événement est sw7a : sortie lac sans combinaison, scénario eau >24.5°C. Tu arrives ici avec 2 sorties eau libre derrière toi — c'est de la confirmation, pas de la découverte.

**S7 — 17 août : Race week — très légère**
Jeudi : sw8a (activation natation 30 min, J-3). Vendredi : bw8a (activation vélo 35 min, J-2). Samedi : rw8a (activation run 20 min, J-1). Dimanche 23 août : rw8b — la course.

**S8–S10 — 24 août au 13 septembre : Retour structuré**
S8 (24–30 août) : récupération non-négociable, 4–5 séances légères. S9 (31 août–6 sept) : reprise douce, premiers Z2 run. S10 (7–13 sept) : transition libre — le prochain objectif se définit ici.

---

## DATE DE FIN À SAISIR DANS L'APP

**2026-09-13** (dimanche 13 septembre 2026)

Cette date détermine le démarrage automatique de S1 au 6 juillet 2026 via le calcul : `endDate - (TOTAL_WEEKS × 7 - 1)`. Le dev doit vérifier que cette formule donne bien le lundi 6 juillet 2026.

Vérification : 2026-09-13 - 69 jours = 2026-07-06 ✓
