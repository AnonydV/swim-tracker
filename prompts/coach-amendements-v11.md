# Amendements v11 — 70.3 Vichy 23 août 2026
Généré le 2026-07-06

Base de travail : index.html v9 + amendements v10 combinés (v10 considéré comme appliqué).
Convention semaines : mercredi→mardi à confirmer — toutes les références sont relatives (S1, S2…), aucune date calendaire.
Périmètre : arbitrages athlète sur P1–P8 du débat contradictoire.

---

## I — AJOUTS

### weekNum 2 — sw2c (NOUVELLE SÉANCE)

Remplace sw2a (voir SUPPRESSIONS). À insérer dans le tableau sessions de weekNum 2 à la place de sw2a.

```
id       : "sw2c"
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

## II — SUPPRESSIONS

### weekNum 2 — sw2a

**Motif :** remplacée par sw2c (sortie eau libre, même créneau technique de S2). La simulation de stress de départ gagne à être faite dans l'environnement réel.

**Action :** retirer sw2a du tableau sessions de weekNum 2.

---

## III — MODIFICATIONS

---

### P1/P2 — Sorties eau libre

---

#### weekNum 6 — sw6b

**Valeur actuelle (ancrage) :** `name: "Natation — Long 1500 m protocole OWS"` / `typeLabel: "65 min · Endurance longue"`

**Nouvelle valeur — name :** Natation — Sortie eau libre longue (combinaison)

**Nouvelle valeur — typeLabel :** 65 min · Lac, combinaison, 1800 m

**Nouvelle valeur — sets[0].desc (warm) :**
> Mise en place wetsuit avant entrée dans l'eau (prévoir 10 min). Entrée progressive : immerge le visage, souffle les bulles, prends 30 s pour ressentir la flottabilité de la combinaison — les hanches remontent passivement. 200 m crawl souple pour calibrer la nouvelle position. Note : la combi ralentit légèrement le retour du bras aérien — raccourcis un peu le rythme de bras, ne force pas l'amplitude.

**Nouvelle valeur — sets[1].desc (main, 1800 m) :**
> 1800 m crawl continu. Décompose en 3 × 600 m, pause 30 s (repos sur l'eau ou au bord) entre chaque bloc. Protocole OWS par bloc :\n• 600 m 1 : respiration dominante, sighting toutes les 10 brassées sur un repère fixe à l'horizon, expiration aquatique complète. Bloc de calibrage — ni trop vite, ni trop lent.\n• 600 m 2 : bilatérale toutes les 3 brassées, sighting maintenu, nage longue et relâchée. Teste la gestion respiratoire avec la combi sur durée.\n• 600 m 3 : rythme naturel, sighting toutes les 8 brassées (fréquence de course), gestion de l'allure prioritaire. C'est ton bloc de référence race-pace.\nSur l'intégralité : battement 2 temps naturel — les jambes stabilisent l'alignement, elles ne propulsent pas. Hanches hautes, orteils pointés vers l'arrière. Avec la combinaison, la flottabilité amplifie l'effet du 2T — laisse-la travailler.

**Nouvelle valeur — sets[1].tip :**
> Si la bilatérale sur le 2e bloc perturbe le souffle plus qu'en piscine, reviens à ton côté dominant. L'objectif est la confiance en eau ouverte sur la durée, pas une contrainte technique supplémentaire.

**Nouvelle valeur — sets[2].desc (cool) :**
> 100 m crawl très souple, puis sortie progressive. Retrait du wetsuit : humidifie les chevilles et les poignets avant d'enlever, ne tire pas la fermeture à la va-vite.

**Nouvelle valeur — tip session :**
> 1800 m en eau libre avec combinaison — le cap psychologique de la préparation. Tu n'avais pas encore nagé aussi loin dans les conditions réelles de la course : maintenant si. Cette sortie livre deux informations clés : ton allure réelle avec combi en eau libre (différente de la piscine) et la confirmation que la gestion respiratoire OWS tient sur la distance. Si Vichy autorise la combinaison (eau ≤24.5°C), c'est exactement ce que tu vivras le 23 août.

---

#### weekNum 7 — sw7a

**Valeur actuelle (ancrage) :** `name: "Natation — Ancrage OWS pré-course : routine + automatismes"` / `typeLabel: "40 min · Technique affûtage"`

**Nouvelle valeur — name :** Natation — Sortie eau libre pré-course (sans combinaison)

**Nouvelle valeur — typeLabel :** 40 min · Lac, sans combi, pré-course

**Nouvelle valeur — sets[0].desc (warm) :**
> Entrée dans l'eau sans combinaison : wader progressivement jusqu'aux épaules. Routine de mise à l'eau : visage immergé 3 fois, bulles lentes. Note immédiatement la position des hanches sans la combi — elles peuvent s'enfoncer légèrement. Active le battement 2 temps dès les premiers mètres : orteils pointés vers l'arrière, hanches hautes. 200 m crawl souple pour trouver et stabiliser la position sans flottabilité assistée.

**Nouvelle valeur — sets[1].desc (main, 4×75 m) :**
> 4 × 75 m OWS. Récupération 40 s (sur l'eau ou au bord). Sur chaque 75 m : 25 m sighting actif toutes les 8 brassées (yeux au niveau de l'eau, redescente immédiate) + 50 m crawl relâché, expiration aquatique complète, battement 2 temps naturel maintenu sans la flottabilité de la combi. Pas de bilatérale imposée — rythme libre. Objectif central : confirmer que les automatismes (2T, sighting, expirations) tiennent sans l'aide de la combinaison.

**Nouvelle valeur — sets[2].desc (interval, simulation départ) :**
> Simulation de départ finale sans combi : 3 × 25 m. Départ debout. 15 m à allure vive → 3 expirations forcées sous l'eau en continuant à nager → 10 m crawl calme. Récupération 50 s. C'est exactement le protocole du 23 août si la combinaison est interdite.

**Nouvelle valeur — sets[2].tip :**
> Si le retour au calme prend plus de 3 expirations, pars en dehors de la masse le jour J et prends ton rythme sur les 100 premiers mètres. C'est la bonne stratégie même en conditions normales.

**Nouvelle valeur — sets[3].desc (cool) :**
> 100 m crawl très souple, sortie progressive. Bilan avant de sortir de l'eau : les hanches tenaient-elles avec le 2T actif ? Le sighting était-il naturel sans ligne noire ? Le retour au calme post-départ a-t-il fonctionné ?

**Nouvelle valeur — tip session :**
> Dernière sortie eau libre avant Vichy — scénario sans combinaison, le plus exigeant. Si les hanches coulent malgré le 2T actif : redresse légèrement la tête sur quelques brassées pour les faire remonter, puis reviens à la position normale — c'est la compensation temporaire. Si tout tient (position, souffle, sighting), tu es paré pour les deux scénarios du 23 août. Tu es reparti à S2 en eau libre les mains vides ; tu arrives ici avec deux sessions derrière toi et un protocole qui fonctionne.

---

### P3 — Sortie longue vélo S4 + compensation rw4a

---

#### weekNum 4 — bw4a

**Valeur actuelle (ancrage) :** `name: "Vélo — Sweet Spot"` / `typeLabel: "80 min · Sweet spot"` / `dist: 80` / `sets[1]: "2 × 20 min à sweet spot 168–189 W"`

**Nouvelle valeur — name :** Vélo — Sortie longue Z2 + nutrition

**Nouvelle valeur — type :** b-endurance

**Nouvelle valeur — typeLabel :** 135 min · Z2 long

**Nouvelle valeur — dist :** 135

**Nouvelle valeur — sets[0].desc (warm) :**
> Pédalage progressif de Z1 (<126 W) vers Z2 basse (130–140 W) sur 15 min. Cadence libre, jambes qui se réveillent.

**Nouvelle valeur — sets[0].dist :** 15 min

**Nouvelle valeur — sets[1] (main, 105 min) — remplace les 2 sets interval :**
```
type : "main"
dist : "105 min"
desc : "105 min à 126–160 W (Z2 vélo, 60–76% FTP). Cadence cible 85–90 rpm. Effort conversationnel — si tu dois choisir entre rester dans les watts et ne plus pouvoir parler, réduis les watts. Protocole nutrition obligatoire : 60–80 g de glucides par heure (1 gel toutes les 25–30 min ou équivalent), 500 ml de liquide minimum par heure. C'est la répétition du protocole de course sur une durée proche de la réalité de Vichy."
tip  : "À 70 min, fais un bilan actif : position des mains et du dos, confort de selle, fluidité de pédalage. Ajuste si nécessaire — il vaut mieux identifier les problèmes ici que le 23 août."
```

**Nouvelle valeur — sets[2] (cool) — remplace l'ancien sets[2] :**
```
type : "cool"
dist : "15 min"
desc : "Retour progressif à <126 W sur 15 min. Pédalage très souple, jambes qui récupèrent."
tip  : ""
```

**Note d'implémentation :** l'ancienne structure avait sets[0] warm + sets[1] interval (2×20 min) + sets[2] cool. La nouvelle structure est sets[0] warm + sets[1] main (105 min) + sets[2] cool — le sets[1] interval est remplacé par un sets[1] main.

**Nouvelle valeur — tip session :**
> Sortie longue Z2 — ton filet de sécurité psychologique avant la race week. 2h15 à allure conversationnelle : position validée sur durée réelle, protocole nutrition testé (le glucose à 60-80 g/h n'est pas acquis, teste-le vraiment), tolérance selle confirmée. Ta base Ironman garantit que le vélo est bien dans tes capacités — cette séance transforme la certitude physiologique en certitude mentale. Séquence recommandée en S4 : bw4a au milieu de semaine, à J-2 au minimum avant brw4a (brick).

---

#### weekNum 4 — rw4a

**Valeur actuelle (ancrage) :** `name: "Footing Z2 — Long"` / `typeLabel: "60 min · Z2"` / `dist: 60` / `sets[1].dist: "45 min"`

**Ce qui est réduit et pourquoi :** rw4a passe de 60 à 40 min Z2 pour compenser l'ajout des 55 min nettes de bw4a (80→135 min). C'est la seule session modifiée en échange de la sortie longue. Le seuil (rw4b), le brick (brw4a) et la natation restent intacts.

**Nouvelle valeur — name :** Footing Z2 — Volume ajusté

**Nouvelle valeur — typeLabel :** 40 min · Z2

**Nouvelle valeur — dist :** 40

**Nouvelle valeur — sets[1].dist :** 25 min

**Nouvelle valeur — sets[1].desc :**
> Course continue Z2 à 4:50–5:10/km. Allure régulière, effort constant. Surface souple recommandée. Volume réduit (40 min au lieu de 60 min) : compensation directe de la sortie longue vélo de S4 — la charge globale de la semaine reste maîtrisée.

**Nouvelle valeur — tip session :**
> Séance raccourcie de 60 à 40 min — la contrepartie explicite de bw4a (2h15). 25 min de Z2 propre et régulier : le stimulus aérobie est maintenu, la charge globale de S4 reste raisonnable. Aucune culpabilité sur le volume réduit.

---

### P4 — Pic de charge muscu déplacé en S4 / mw6a → maintenance

---

#### weekNum 4 — mw4a

**Valeur actuelle (ancrage) :** `name: "Renforcement — Stabilité et propulsion"` / `typeLabel: "30 min · Stabilité"` / `sets[1] exercise 1: "Step-up haltères sur marche stable"`

**Nouvelle valeur — name :** Renforcement — Force maximale + stabilité

**Nouvelle valeur — typeLabel :** 30 min · Force maximale

**Nouvelle valeur — sets[1].desc (main) :**
> 2 circuits · 45 s repos entre exercices · 90 s entre circuits\n1. Fente bulgare haltères (pied arrière sur chaise basse) — 2 × 8 reps / jambe (charge maximale propre : contrôle total, genou stable, descente 3 s. Monte progressivement sur les premières reps.)\n2. Romanian deadlift haltères — 2 × 10 reps (charge maximale contrôlée, dos neutre impératif — dès que le dos s'arrondit, c'est ta limite : stagne à cette charge)\n3. Gainage anti-rotation élastique (Pallof press) — 2 × 10 reps / côté (tenir 2 s bras tendus, résister à la rotation, debout)\n4. Planche avec élévation de bras alternée — 2 × 8 reps / côté (lent, stable, aucune rotation de bassin)\n5. External rotation élastique — 2 × 15 reps / côté (coude plaqué au corps à 90°, rotation externe de l'épaule)

**Nouvelle valeur — sets[1].tip :**
> Charge maximale ne veut pas dire technique compromise. Sur la fente bulgare, l'équilibre et la stabilité du genou passent avant la charge — monte progressivement. Sur le RDL, le dos neutre est non-négociable : dès que tu le perds, tu as ta limite réelle pour les semaines suivantes.

**Nouvelle valeur — tip session :**
> Pic de charge muscu du programme. À partir de S5, la muscu passe en maintenance : charges stabilisées, volume réduit. — Séquence recommandée en S4 : placer mw4a à J+2 après bw4a (sortie longue, DOMS vélo minimaux à ce stade) et à J-2 avant brw4a. Les DOMS de la fente bulgare et du RDL à charge maximale arrivent à 48–72h — les anticiper protège rw4b et brw4a.

---

#### weekNum 6 — mw6a

**Valeur actuelle (ancrage) :** `name: "Renforcement — Charge maximale"` / `typeLabel: "30 min · Force maximale"` / `tip: "Pic de charge muscu du programme. [...] Profite de cette séance pour chercher ta charge maximale propre"`

**Nouvelle valeur — name :** Renforcement — Maintenance

**Nouvelle valeur — typeLabel :** 30 min · Maintenance

**Nouvelle valeur — sets[0].desc (warm) :**
> Mobilité légère : cercles d'épaules 10 / sens, cercles de hanches 10 / sens, leg swings 8 / jambe.

**Nouvelle valeur — sets[1].desc (main) :**
> 2 circuits · 60 s repos entre exercices · 90 s entre circuits · charges stables (identiques à S5, pas de recherche de maximum)\n1. Squat haltères — 2 × 10 reps\n2. Romanian deadlift haltères — 2 × 8 reps\n3. Planche frontale — 2 × 30 s\n4. Pont fessier bilatéral — 2 × 12 reps\nObjectif : maintenir le stimulus neuromusculaire sans creuser la fatigue sur la semaine de charge maximale globale.

**Nouvelle valeur — sets[1].tip :**
> 4 exercices uniquement. S6 est déjà la semaine la plus chargée du programme — la muscu est l'accessoire. Charges identiques à S5, aucune progressivité.

**Nouvelle valeur — sets[2].desc (cool) :**
> Étirements statiques : ischio-jambiers 45 s / jambe, psoas en fente basse 45 s / côté, pectoraux 30 s.

**Nouvelle valeur — tip session :**
> S6 est la semaine de charge maximale : brick 110 min, seuil 5×5, sweetspot. La muscu est l'accessoire — 4 exercices à charges stables, terminé en 30 min. Le pic de force était en S4 ; ici on maintient le stimulus sans creuser.

---

### P5 — Scénarios wetsuit race week

---

#### weekNum 8 — rw8b — tip

**Valeur actuelle (ancrage, v10) :** `"...Trois rappels nage pour ne pas les oublier sur la plage de départ : (1)... (2)... (3)... Confiance dans le corps — il sait quoi faire."`

**Nouvelle valeur complète :**
> C'est la course. 8 semaines de travail mènent ici — mais en réalité, plusieurs mois de préparation Ironman sont dans les jambes. Tu arrives sur ce 70.3 avec la condition d'un athlète longue distance : la distance est dans tes capacités profondes, pas juste dans tes objectifs. Ce n'est pas de l'arrogance, c'est du réalisme. Plan de course : conservateur sur la nage et les 15 premiers km vélo, régulier sur le reste du vélo et les 18 premiers km run, tout ce qui reste sur les 3 derniers km. — Trois rappels nage pour ne pas les oublier sur la plage de départ : (1) immersion du visage + bulles lentes avant le coup de feu, (2) si le souffle s'emballe : 3 expirations forcées sous l'eau en continuant à nager, (3) sighting yeux à ras de l'eau toutes les 8 brassées. — Combinaison autorisée (eau ≤24.5°C) : la flottabilité remonte les hanches passivement — tu as pratiqué ça au lac en S6. La combi raccourcit légèrement le retour aérien du bras : rythme adapté, pas forcé. Position protégée, nage confiante. — Sans combinaison (eau >24.5°C) : scénario répété au lac en S7, le plus exigeant. Active le 2T dès les premiers mètres, hanches hautes, orteils pointés. L'expiration aquatique complète maintient la position sur 1900 m. Tu sais exactement ce que ça fait — fais confiance à S7. Confiance dans le corps — il sait quoi faire.

---

### P6 — Sessions optionnelles S7

---

#### weekNum 7 — mw7a

**Valeur actuelle (ancrage) :** `name: "Renforcement — Maintenance"` / `typeLabel: "30 min · Maintenance"` / `tip: "Semaine de pic total. Cette séance muscu est l'accessoire..."`

**Nouvelle valeur — name :** Renforcement — Maintenance (optionnel)

**Nouvelle valeur — typeLabel :** 30 min · Optionnel

**Nouvelle valeur — tip :**
> Session optionnelle en semaine d'affûtage — à faire uniquement si les jambes et le système nerveux sont frais après brw7a et rw7b. Si l'une ou l'autre de ces séances a été exigeante, skip mw7a et remplace par 20 min de marche + étirements doux. Le brick et le run allure 70.3 sont les priorités absolues de S7 — la muscu est l'accessoire.

---

#### weekNum 7 — sw7b

**Valeur actuelle (ancrage) :** `name: "Natation — Maintien aquatique léger"` / `typeLabel: "30 min · Maintenance légère"`

**Nouvelle valeur — name :** Natation — Maintien aquatique léger (optionnel)

**Nouvelle valeur — typeLabel :** 30 min · Optionnel

**Nouvelle valeur — tip :**
> Session optionnelle en semaine d'affûtage — ne pas la faire si les épaules ou les bras tirent, si la fatigue est là après sw7a en eau libre, ou si le programme de la semaine semble déjà chargé. Remplace par 20 min de marche et étirements doux. L'objectif si elle est faite : maintenir le sens de l'eau, rien de plus.

---

### P7 — Garde-fou ferme rw6b

---

#### weekNum 6 — rw6b — sets[1].tip

**Valeur actuelle (ancrage) :** `"...La 5e rep doit être complète même à 4:10. Si les 3 premières reps sont déjà au rouge, allonge la récup à 2 min : qualité prime sur quantité."`

**Nouvelle valeur complète :**
> Récupération 90 s : tu ne récupères pas totalement entre les reps — c'est voulu. Décision à prendre avant la séance, pas pendant : si à la sortie de la 3e rep tu n'es plus dans 4:05–4:10/km, tu t'arrêtes à 4 reps. Pas d'improvisation, pas d'ego en séance. À J-15, 4 reps propres valent plus que 5 reps dégradées. La 4e rep qui termine dans 4:05–4:10 valide la séance.

---

### P8 — Corrections numéros de semaine

---

#### weekNum 3 — rw3b — sets[1].tip

**Valeur actuelle (ancrage) :** `"...c'est acceptable en S4."`

**Nouvelle valeur complète :**
> Le 3e bloc est le plus dur. Si tu es à 4:35 sur le 3e, c'est acceptable en S3. Si tu passes à 4:50, tu es sorti du tempo — raccourcis le bloc plutôt que de le bâcler.

---

#### weekNum 5 — rw5a — sets[1].desc

**Valeur actuelle (ancrage) :** `"...Les jambes ont le droit d'être lourdes après S5."`

**Nouvelle valeur complète :**
> Course Z1 à >5:30/km, perception d'effort quasi nulle. Les jambes ont le droit d'être lourdes après S4.

---

#### weekNum 6 — rw6a — sets[1].tip

**Valeur actuelle (ancrage) :** `"...la récupération S6 n'était pas complète"`

**Nouvelle valeur complète :**
> Ce footing doit se sentir plus facile qu'en S4 à durée identique. Si ce n'est pas le cas, la récupération S5 n'était pas complète — signale-le avant la séance seuil.

---

#### weekNum 6 — rw6b — sets[1].desc

**Valeur actuelle (ancrage) :** `"...Progression vs S5 : 5 reps au lieu de 4, récup réduite à 90 s."`

**Nouvelle valeur complète :**
> 5 répétitions de 5 min à allure seuil 4:00–4:10/km. Récupération 90 s trot Z1 entre reps. Progression vs S4 : 5 reps au lieu de 4, récup réduite à 90 s.

*(Note : rw6b concentre deux modifications — sets[1].desc [P8] et sets[1].tip [P7]. Les deux sont à implémenter ensemble.)*

---

## IV — RÉCAPITULATIF DES MODIFICATIONS

| # | weekNum | ID | Champ | Amendement |
|---|---------|-----|-------|------------|
| AJOUT | 2 | sw2c | Session complète | Première sortie eau libre, sans combi |
| SUPPR. | 2 | sw2a | Session entière | Remplacée par sw2c |
| 1 | 6 | sw6b | name | Lac, combinaison |
| 2 | 6 | sw6b | typeLabel | Lac, combinaison, 1800 m |
| 3 | 6 | sw6b | sets[0].desc | Mise en place wetsuit + position |
| 4 | 6 | sw6b | sets[1].desc | 1800 m lac protocole OWS 3×600 m |
| 5 | 6 | sw6b | sets[1].tip | Bilatérale en eau libre |
| 6 | 6 | sw6b | sets[2].desc | Cool-down + retrait wetsuit |
| 7 | 6 | sw6b | tip | Cap psychologique, info allure réelle |
| 8 | 7 | sw7a | name | Lac, sans combi |
| 9 | 7 | sw7a | typeLabel | Lac, sans combi, pré-course |
| 10 | 7 | sw7a | sets[0].desc | Entrée sans combi, activation 2T |
| 11 | 7 | sw7a | sets[1].desc | 4×75 m OWS sans flottabilité assistée |
| 12 | 7 | sw7a | sets[2].desc | Simulation départ 3×25 m sans combi |
| 13 | 7 | sw7a | sets[2].tip | Si retour au calme >3 exp., stratégie départ |
| 14 | 7 | sw7a | sets[3].desc | Cool + bilan position sans combi |
| 15 | 7 | sw7a | tip | Confirmation automatismes sans combi |
| 16 | 4 | bw4a | name | Sortie longue Z2 + nutrition |
| 17 | 4 | bw4a | type | b-endurance |
| 18 | 4 | bw4a | typeLabel | 135 min · Z2 long |
| 19 | 4 | bw4a | dist | 135 |
| 20 | 4 | bw4a | sets[0].dist | 15 min |
| 21 | 4 | bw4a | sets[1] | Main 105 min Z2 + nutrition (remplace interval) |
| 22 | 4 | bw4a | sets[2] | Cool 15 min (remplace ancien cool) |
| 23 | 4 | bw4a | tip | Filet sécurité psychologique + séquence S4 |
| 24 | 4 | rw4a | name | Volume ajusté |
| 25 | 4 | rw4a | typeLabel | 40 min · Z2 |
| 26 | 4 | rw4a | dist | 40 |
| 27 | 4 | rw4a | sets[1].dist | 25 min |
| 28 | 4 | rw4a | sets[1].desc | +note compensation sortie longue |
| 29 | 4 | rw4a | tip | Contrepartie explicite de bw4a |
| 30 | 4 | mw4a | name | Force maximale + stabilité |
| 31 | 4 | mw4a | typeLabel | 30 min · Force maximale |
| 32 | 4 | mw4a | sets[1].desc | Fente bulgare max remplace step-up + RDL max |
| 33 | 4 | mw4a | sets[1].tip | Consigne charge max technique d'abord |
| 34 | 4 | mw4a | tip | Pic S4 + séquence DOMS vs brick |
| 35 | 6 | mw6a | name | Maintenance |
| 36 | 6 | mw6a | typeLabel | 30 min · Maintenance |
| 37 | 6 | mw6a | sets[0].desc | Warm mobilité légère (remplace dynamique) |
| 38 | 6 | mw6a | sets[1].desc | 4 exercices maintenance, charges stables |
| 39 | 6 | mw6a | sets[1].tip | Charges identiques S5 |
| 40 | 6 | mw6a | sets[2].desc | Cool étirements statiques |
| 41 | 6 | mw6a | tip | S6 = charge max globale, muscu accessoire |
| 42 | 8 | rw8b | tip | +paragraphes scénarios avec/sans combi |
| 43 | 7 | mw7a | name | +(optionnel) |
| 44 | 7 | mw7a | typeLabel | 30 min · Optionnel |
| 45 | 7 | mw7a | tip | Optionnel explicite, conditions de skip |
| 46 | 7 | sw7b | name | +(optionnel) |
| 47 | 7 | sw7b | typeLabel | 30 min · Optionnel |
| 48 | 7 | sw7b | tip | Optionnel explicite post sw7a eau libre |
| 49 | 6 | rw6b | sets[1].tip | Plafond ferme 4 reps si dérive à la 3e |
| 50 | 3 | rw3b | sets[1].tip | "en S4" → "en S3" |
| 51 | 5 | rw5a | sets[1].desc | "après S5" → "après S4" |
| 52 | 6 | rw6a | sets[1].tip | "récupération S6" → "récupération S5" |
| 53 | 6 | rw6b | sets[1].desc | "Progression vs S5" → "Progression vs S4" |

**Total : 1 ajout, 1 suppression, 53 champs modifiés sur 15 sessions.**

---

## V — MESSAGE POUR L'ATHLÈTE

**Les 3 sorties lac : quand, avec quoi, pour quoi**

**Sortie 1 — S2, sans combinaison.**
C'est cette semaine. Courte (~40 min, 300-400 m au total), aucune ambition de performance. L'objectif est simple : rencontrer les déclencheurs sensoriels de l'eau libre (eau sombre, fond invisible, pas de ligne noire) dans un contexte où tu contrôles tout. La simulation de départ sur 25 m (10 m vif → 3 expirations → calme) te dira si le protocole appris en piscine fonctionne dans le vrai milieu. Tout ce que tu observes ici est de l'information utile pour les semaines suivantes.

**Sortie 2 — S6, avec combinaison.**
La session longue. 1800 m avec wetsuit — tu testes la flottabilité, tu calibres ton allure réelle en eau libre avec la combi, tu confirmes que la gestion respiratoire tient sur la distance. C'est le cap psychologique de la préparation : après cette sortie, tu sais que tu peux nager 1800 m en eau libre dans les conditions probables de Vichy.

**Sortie 3 — S7, sans combinaison.**
La répétition du pire scénario. Si Vichy interdit la combinaison (eau >24.5°C, ce qui est possible fin août), c'est exactement ce que tu vivras le 23 août. Session courte (~40 min), focus sur les automatismes sans flottabilité : 2T, sighting, expirations forcées sur les départs simulés. Tu arrives ici avec 2 sorties eau libre derrière toi — c'est de la confirmation, pas de la découverte.

**Ce que tu cèdes en échange de la sortie longue vélo (S4)**

La seule modification est rw4a, raccourcie de 60 à 40 min Z2 (−20 min de footing facile). Le seuil (rw4b), le brick (brw4a), la natation (sw4a et sw4b) et la muscu (mw4a) restent intacts. La charge globale de S4 augmente de ~35 min nettes — essentiellement du Z2 vélo, le type d'effort qui coûte le moins en récupération. C'est un compromis raisonnable pour une séance qui répond à un vrai besoin de réassurance.

Une recommandation de séquence pour S4 : place bw4a (long ride 2h15) au milieu de semaine, mw4a (force maximale) à J+2 après bw4a, brw4a (brick) à J-2 après mw4a. Les DOMS du pic muscu arriveront à 48-72h — si tu respectes cet écart, ils n'impactent ni le seuil ni le brick.
