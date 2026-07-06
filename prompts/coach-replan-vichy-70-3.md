# Replan coach — 70.3 Vichy, 23 août 2026
Généré le 2026-07-06

---

## 1. PÉRIODISATION RECALÉE

### Calage dates / weekNums

Programme démarré le 2026-07-01 (mercredi). Semaine active au 2026-07-06 : **weekNum 1**.

| weekNum | Dates | Nouvelle phase | Charge |
|---------|-------|----------------|--------|
| 1 | 1–7 juil. | Base (en cours) | ~3h45 |
| 2 | 8–14 juil. | Construction 70.3 | ~4h30 |
| 3 | 15–21 juil. | Construction 70.3 | ~5h30 |
| 4 | 22–28 juil. | Construction + premier brick | ~6h00 |
| 5 | 29 juil.–4 août | Récupération (-35%) | ~3h45 |
| 6 | 5–11 août | Spécifique 70.3 — PIC | ~8h30 |
| 7 | 12–18 août | **AFFÛTAGE (-40%)** | ~5h00 |
| 8 | 19–25 août | **RACE WEEK** — Race dim. 23 août | ~4h (+ race) |
| 9 | 26 août–1 sept. | Récupération post-Vichy (S1) | ~2h00 |
| 10 | 2–8 sept. | Récupération post-Vichy (S2) | ~3h00 |
| 11–14 | post-course | NEUTRALISÉES — semi abandonné | — |

### Ce que devient l'objectif semi weekNum 14
L'objectif semi-marathon 1h30 en weekNum 14 est **abandonné**. Toutes les sessions des weekNums 11 à 14 sont supprimées. La semaine de charge maximale est désormais la **weekNum 6**. L'ambition 1h30 est reportée post-Vichy — un nouveau cycle running de 10–12 semaines sera à construire après la récupération de septembre.

### Allures de référence 70.3 Vichy
- **Run 70.3 (off bike)** : 4:35–4:45/km (cible conservatrice)
- **Threshold entraînement** : 4:00–4:10/km (inchangé — construit la base pour tout)
- **Z2 run** : 4:50–5:10/km
- **Z1 run** : > 5:30/km
- **Vélo race** : 175–185 W (83–88% FTP 210 W)
- **Sweetspot** : 168–189 W (80–90% FTP)

---

## 2. SESSIONS MODIFIÉES

Les sessions des weekNums 1–5 sont majoritairement conservées. Seuls les tips avec des références erronées (numéros de semaine, "semi en 1h30", "triathlon L") sont corrigés. Les weekNums 7–8 sont intégralement réécrits.

---

### weekNum 2 (8–14 juil.) — Construction 70.3

#### rw3b (weekNum 3) — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> 3 × 10 min tempo : séance clé de la semaine. Cette allure 4:20–4:30 va devenir ta zone de confort d'ici Vichy. Pour l'instant, ça doit piquer en fin de bloc — c'est bon signe.

#### rw4a (weekNum 4) — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> La sortie longue Z2 est non-négociable dans la phase de construction. C'est la base de ton endurance aérobie pour le 70.3 Vichy.

#### rw4b (weekNum 4) — interval tip + session tip
Champ modifié : **sets[1].tip** (le bloc intervalles) et **tip**

sets[1].tip nouvelle valeur :
> L'allure 4:00–4:10 est calibrée sur tes qualités de course actuelles, pas sur le 70.3 directement — mais c'est exactement le travail de seuil qui te permettra de tenir 4:35–4:45 km après km sur le run Vichy. Ne descends pas sous 4:00 : qualité prime sur vitesse.

tip nouvelle valeur :
> Première séance seuil du programme. 4 × 5 min est le volume d'entrée — il montera progressivement jusqu'en S6. Note tes impressions sur la tenue de l'allure : c'est ton indicateur de progression vers le run 70.3.

---

### weekNum 5 (29 juil.–4 août) — Récupération

#### rw5a — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> S5 = récupération obligatoire, volume -35% vs S4. Tu n'accumules rien cette semaine — tu intègres. C'est aussi une semaine d'entraînement.

#### bw5a — sets[1].tip seulement
Champ modifié : **sets[1].tip**

Nouvelle valeur :
> 50 min au lieu de 80 min (S4) : réduction de volume -37%. Profite de ce pédalage pour travailler la cadence si tu peines à tenir 85 rpm en conditions légères.

---

### weekNum 6 (5–11 août) — Spécifique 70.3 / PIC

#### rw6a — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> S6 marque l'entrée dans la phase Spécifique 70.3 — la semaine de charge maximale du programme. Volume au maximum, brick long au programme en fin de semaine. Cette sortie Z2 pose les fondations de la semaine.

#### rw6b — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> 5 × 5 min seuil à 90 s de récup : séance clé de la dernière semaine chargée avant l'affûtage. Si la récupération de S5 était bonne, tu dois tenir. Bonne séance seuil ici = tu es sur la trajectoire pour courir 4:35–4:45/km à Vichy après 90 km de vélo.

#### bw6a — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> 2 × 25 min sweet spot : séance vélo de charge maximale du programme. Si tu tiens la puissance en fin de 2e bloc, tu es en excellente forme pour le segment vélo de Vichy.

#### brw6a — RÉÉCRITURE COMPLÈTE (brick allongé : 40 min → 80 min vélo + 20 min run)

Champs modifiés : **name, typeLabel, dist, sets, tip**

```json
{
  "id": "brw6a",
  "name": "Brick Long — Simulation 70.3",
  "type": "brick",
  "typeLabel": "110 min · Brick long",
  "dist": 110,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "10 min",
      "desc": "Pédalage souple Z1 (<126 W), montée progressive vers 155 W.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "80 min vélo",
      "desc": "80 min à 168–189 W (sweetspot, 80–90% FTP). Cadence 85–90 rpm. Nutrition pendant le bloc : 60 g de glucides répartis sur l'heure. Les 5 dernières minutes : monte la cadence à 90–95 rpm avec puissance légèrement réduite (150–160 W) pour préparer la transition.",
      "tip": "80 min de sweetspot avant un run : c'est exactement le stress cumulatif que tu vivras à Vichy. Si la puissance chute sous 160 W à 60 min, c'est acceptable — continue."
    },
    {
      "type": "interval",
      "dist": "Transition T2",
      "desc": "Transition rapide : descendre du vélo, chaussures de course, chrono relancé. Objectif : transition < 90 s. Note le temps.",
      "tip": "La T2 se travaille à l'entraînement. Savoir dans quel ordre faire les choses réduit le stress le jour J."
    },
    {
      "type": "main",
      "dist": "20 min run",
      "desc": "20 min de course immédiatement après le vélo. Cible : allure 70.3 à 4:35–4:45/km. Les 4 premières minutes seront difficiles — tiens l'allure et ça revient à 5–6 min. Régularité, pas progression.",
      "tip": "4:35–4:45/km post-vélo : c'est ton allure de compétition 70.3. Maîtrise cet effort ici pour ne pas partir trop vite le jour J."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Marche 5 min, respiration nasale, récupération active.",
      "tip": ""
    }
  ],
  "tip": "Brick le plus long du programme. Si tu tiens 4:35–4:45/km sur ces 20 min après 80 min de sweetspot, tu es prêt pour Vichy. C'est la répétition générale : même durée vélo que la course (approximativement), même effort de transition, même gestion de l'allure run."
}
```

#### mw6a — tip seulement
Champ modifié : **tip**

Nouvelle valeur :
> Pic de charge muscu du programme. À partir de S7, la muscu passe en maintenance : charges stabilisées, volume réduit. Profite de cette séance pour chercher ta charge maximale propre sur la fente bulgare et le RDL.

---

### weekNum 7 (12–18 août) — AFFÛTAGE — RÉÉCRITURE COMPLÈTE

**Phase affûtage : volume -40% vs S6. Intensité maintenue sur courtes durées. Le corps super-compense pendant ces 7 jours.**

#### rw7a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "rw7a",
  "name": "Run Z2 — Affûtage Vichy",
  "type": "r-endurance",
  "typeLabel": "45 min · Z2 souple",
  "dist": 45,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "8 min",
      "desc": "Trot Z1 à >5:30/km, très progressif.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "32 min",
      "desc": "Course continue Z2 à 4:50–5:10/km. Volume réduit intentionnellement. La sensation de légèreté en fin de séance est le signal attendu — si tu finis en voulant en faire plus, c'est parfait.",
      "tip": "Semaine d'affûtage : si tu te sens bien et frais, c'est que le programme fonctionne. Résiste à l'envie d'aller plus vite ou plus loin."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Trot Z1, marche 2 min.",
      "tip": ""
    }
  ],
  "tip": "S7 = affûtage. Volume -40% vs S6. La forme monte pendant les jours de repos relatif — moins c'est mieux cette semaine sur les séances Z2."
}
```

#### sw7a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "sw7a",
  "name": "Natation — Ancrage OWS pré-Vichy : routine + automatismes",
  "type": "s-technique",
  "typeLabel": "40 min · Technique affûtage",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple. Routine de mise à l'eau avant de partir : immerge le visage, souffle les bulles lentement. Mémorise ce geste — tu le feras exactement ainsi avant le coup de feu à Vichy.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 75 m",
      "desc": "Rappel OWS — 4 × 75 m : 25 m sighting actif (toutes les 8 brassées, geste parfait — yeux au niveau de l'eau, redescente immédiate) + 50 m crawl avec bilatérale toutes les 3 brassées et battement 2T. Récupération 40 s (repos à l'appui). Objectif : ancrer les automatismes OWS, aucune charge.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 25 m",
      "desc": "Simulation de départ finale : 4 × 25 m. Départ debout. 10 m à allure vive → 3 expirations forcées → 15 m crawl calme. Récupération 45 s. Objectif : confirmer que le retour au calme est automatique en moins de 3 expirations.",
      "tip": "Si le retour au calme prend encore 5 expirations ou plus, pars en dehors de la masse à Vichy et prends ton rythme sur les 100 premiers mètres — c'est la bonne stratégie de toute façon."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "En affûtage, deux automatismes à mémoriser pour Vichy : (1) routine de mise à l'eau — immersion, bulles lentes, départ calme, (2) si le souffle s'emballe dans les premiers mètres — 3 expirations forcées sous l'eau en continuant à nager, ça suffit à recadrer la respiration."
}
```

#### bw7a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "bw7a",
  "name": "Vélo — Activation taper sweetspot + race pace",
  "type": "b-sweetspot",
  "typeLabel": "75 min · Activation sweetspot",
  "dist": 75,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "15 min",
      "desc": "15 min progressif de Z1 (<126 W) à Z2 (140–155 W). Cadence 85–90 rpm.",
      "tip": ""
    },
    {
      "type": "interval",
      "dist": "2 × 15 min",
      "desc": "2 blocs de 15 min à sweetspot 168–189 W (80–90% FTP). Récupération 5 min Z1 entre blocs. Cadence 85–90 rpm. Volume divisé par 4 vs S6 — les jambes doivent se sentir légères à la fin.",
      "tip": "15 min vs 25 min en S6 : si tu as l'impression de te retenir, c'est parfait. L'affûtage, c'est inconfortable psychologiquement et bénéfique physiologiquement."
    },
    {
      "type": "interval",
      "dist": "2 × 5 min",
      "desc": "2 blocs de 5 min à allure race vélo : 175–185 W (83–88% FTP). Récupération 3 min Z1. Activation des sensations de compétition sur courte durée.",
      "tip": "Ces 5 min à allure race sont un check de l'allumage musculaire, pas un effort. Si 180 W semble facile sur 5 min, c'est que la super-compensation de l'affûtage arrive."
    },
    {
      "type": "cool",
      "dist": "10 min",
      "desc": "Retour progressif à <126 W, pédalage très souple 5 min.",
      "tip": ""
    }
  ],
  "tip": "75 min vs 130 min en S6 : réduction de -42% sur le volume vélo. L'intensité reste présente sur courtes fenêtres pour garder les fibres rapides actives. Cette séance touche l'allure race sur 5 min — ancrage de la sensation avant J-8."
}
```

#### rw7b — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "rw7b",
  "name": "Run — Blocs allure 70.3 Vichy",
  "type": "r-threshold",
  "typeLabel": "50 min · Allure 70.3",
  "dist": 50,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "12 min",
      "desc": "10 min trot Z1, 2 min accélération progressive. 2 × 40 m strides.",
      "tip": ""
    },
    {
      "type": "interval",
      "dist": "4 × 5 min",
      "desc": "4 répétitions de 5 min à allure 70.3 run : 4:35–4:45/km. Récupération 2 min trot Z1 entre reps. C'est plus lent que les séances seuil des semaines précédentes — voulu : tu cibles l'effort de course, pas l'effort d'entraînement.",
      "tip": "4:35–4:45/km doit se sentir confortablement soutenu ici. Si l'allure semble facile à tenir sur les 4e et 5e min de chaque rep, c'est le signal que l'affûtage fonctionne."
    },
    {
      "type": "cool",
      "dist": "12 min",
      "desc": "Trot Z1 décroissant 10 min puis marche 2 min.",
      "tip": ""
    }
  ],
  "tip": "Dernière séance de qualité run avant la race. 4:35–4:45/km = allure 70.3, pas allure seuil. Si ça semble fluide et que tu pourrais tenir 30 min à cette allure, tu es prêt pour Vichy."
}
```

#### brw7a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "brw7a",
  "name": "Brick Taper — Confirmation allure 70.3",
  "type": "brick",
  "typeLabel": "60 min · Brick affûtage",
  "dist": 60,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "10 min",
      "desc": "Pédalage Z1 (<126 W), montée progressive vers 155 W.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "40 min vélo",
      "desc": "40 min : 20 min Z2 (126–155 W), puis 2 × 8 min à allure race 175–185 W avec 4 min Z1 entre blocs. Finir par 5 min cadence haute 90–95 rpm à 150 W.",
      "tip": "Dernier brick avant la course. 40 min avec activation à allure race — tu testes la machine sans l'épuiser."
    },
    {
      "type": "interval",
      "dist": "Transition T2",
      "desc": "T2 soignée : objectif < 60 s. Dernière répétition de la séquence — elle doit être parfaitement automatique.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "10 min run",
      "desc": "10 min à allure 70.3 : 4:35–4:45/km. Legs check final. Si les 2 premières minutes s'installent sans chaos, la machine est prête.",
      "tip": "10 min seulement. Si les jambes sont excellentes, résiste à la tentation d'aller plus loin — l'affûtage se protège."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Marche 5 min.",
      "tip": ""
    }
  ],
  "tip": "Dernier brick du cycle. Court, ciblé, pour confirmer les sensations. Pas de record, pas d'exploit — juste la validation que le corps sait faire la transition vélo→course à allure de compétition."
}
```

#### sw7b — RÉÉCRITURE COMPLÈTE (de 65 min OWS intensif → 30 min maintenance légère)

```json
{
  "id": "sw7b",
  "name": "Natation — Maintien aquatique léger",
  "type": "s-endurance",
  "typeLabel": "30 min · Maintenance légère",
  "dist": 30,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "150 m",
      "desc": "150 m crawl très souple. Aucune consigne technique.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "400 m",
      "desc": "400 m crawl continu à allure très confortable. Sighting relaxé toutes les 12–15 brassées (maintien de l'habitude sans charge mentale). Expiration aquatique maintenue. Battement léger et conscient. Pas de bilatérale imposée — rythme libre.",
      "tip": "400 m seulement : le volume n'a plus rien à apporter. Ce qui s'ancre cette semaine, c'est la confiance dans les automatismes acquis, pas la fatigue."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple, relâchement total.",
      "tip": ""
    }
  ],
  "tip": "Session optionnelle en semaine d'affûtage. Si les épaules ou les bras tirent, remplace par 20 min de marche et étirements doux. L'objectif est de maintenir le sens de l'eau, rien de plus."
}
```

#### mw7a — AUCUN CHANGEMENT
Le contenu existant (4 exercices, maintenance, charges stables) est déjà approprié pour une semaine d'affûtage.

---

### weekNum 8 (19–25 août) — RACE WEEK — RÉÉCRITURE COMPLÈTE

**Race : dimanche 23 août 2026. Calendrier de la semaine :**
- Mer 19, Jeu 20 : repos / déplacement Vichy
- Jeu 20 (J-3) : sw8a — activation nage
- Ven 21 (J-2) : bw8a — activation vélo
- Sam 22 (J-1) : rw8a — activation run
- Dim 23 : rw8b — RACE 70.3 Vichy
- Lun 24 (J+1) : brw8a — récup active

#### sw8a — RÉÉCRITURE COMPLÈTE (65 min OWS endurance → 30 min activation J-3)

```json
{
  "id": "sw8a",
  "name": "Natation — Activation J-3 : routine départ + automatismes race",
  "type": "s-technique",
  "typeLabel": "30 min · Activation J-3",
  "dist": 30,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl très souple. Avant de pousser : routine de mise à l'eau — immerge le visage, souffle les bulles lentement jusqu'à vider les poumons, sens le contact de l'eau, pars. C'est exactement ce que tu feras J-0 avant le coup de feu à Vichy.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 50 m",
      "desc": "Activation OWS — 4 × 50 m : 25 m sighting actif (toutes les 8 brassées — mémorisation du geste parfait : yeux au niveau de l'eau, redescente immédiate, reprise du rythme) + 25 m crawl à allure race avec expiration aquatique et battement depuis les hanches. Récupération 45 s (repos à l'appui). Objectif : ancrer le geste, aucune charge physique.",
      "tip": ""
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m : 2 simulations de départ (10 m vifs + retour au calme en 3 expirations + 15 m crawl contrôlé) + 2 à allure confort. Départs debout sans appui mur. Récupération 40 s. Dernière répétition du protocole anti-stress respiratoire.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple. Relâchement total.",
      "tip": ""
    }
  ],
  "tip": "Race week — trois rappels à mémoriser pour la nage de Vichy : (1) routine de mise à l'eau avant le départ — immersion du visage, bulles lentes, départ calme, (2) si le souffle s'emballe dans les premiers mètres : 3 expirations forcées sous l'eau en continuant à nager, (3) sighting : yeux au niveau de l'eau — pas la tête entière — toutes les 8 brassées."
}
```

#### bw8a — RÉÉCRITURE COMPLÈTE (100 min sweetspot → 35 min activation J-2)

```json
{
  "id": "bw8a",
  "name": "Vélo — Activation J-2",
  "type": "b-endurance",
  "typeLabel": "35 min · Activation J-2",
  "dist": 35,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "10 min",
      "desc": "Pédalage très souple <120 W, cadence libre.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "20 min",
      "desc": "20 min Z2 basse (126–145 W). 3 × 30 s à allure race (175–185 W) avec 2 min récup Z1 entre chaque pic. Réactivation des fibres uniquement — pas d'effort prolongé.",
      "tip": "3 pics de 30 s à allure race : tu vérifies que le moteur démarre bien. La puissance doit atteindre 180 W sans forcer — si ça semble difficile, ne cherche pas à forcer, c'est normal."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Pédalage <110 W, arrêt progressif.",
      "tip": ""
    }
  ],
  "tip": "J-2 : séance courte pour garder les jambes actives. Après ça, repos jusqu'à la course. Hydratation et nutrition sont tes vraies priorités de J-2 : glucides à chaque repas, 2,5 à 3 L d'eau dans la journée."
}
```

#### rw8a — RÉÉCRITURE COMPLÈTE (65 min Z2 → 20 min activation J-1)

```json
{
  "id": "rw8a",
  "name": "Run — Activation J-1",
  "type": "r-recovery",
  "typeLabel": "20 min · Activation J-1",
  "dist": 20,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "8 min",
      "desc": "Trot très léger Z1 à >5:30/km. Pas d'objectif d'allure. Respiration nasale si possible.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "8 min",
      "desc": "Trot Z1–Z2 très confortable. 3 × 20 s d'accélérations progressives vers ~4:35/km. Récupération 90 s marche entre chaque. Réveiller le système neuromusculaire, pas l'épuiser.",
      "tip": "20 s maximum. Si les jambes sont légères pendant ces accélérations, c'est le signal que l'affûtage a fonctionné."
    },
    {
      "type": "cool",
      "dist": "4 min",
      "desc": "Marche 4 min, respiration nasale.",
      "tip": ""
    }
  ],
  "tip": "J-1 : 20 min uniquement. Si tu ressors avec des jambes légères et envie d'en faire plus, c'est parfait — stop quand même. Ce soir : dîner glucidique, coucher tôt, visualisation du plan de course."
}
```

#### rw8b — RÉÉCRITURE COMPLÈTE (65 min seuil → RACE 70.3 Vichy)

```json
{
  "id": "rw8b",
  "name": "RACE — 70.3 Vichy",
  "type": "brick",
  "typeLabel": "Race · 70.3 Vichy",
  "dist": 315,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "15–20 min",
      "desc": "Échauffement pré-course dans la zone d'échauffement : 8 min trot léger Z1, mobilité dynamique (leg swings, cercles de hanches). Si accès à l'eau avant le départ : 200 m nage souple avec routine de mise à l'eau (immersion, bulles lentes). Respiration contrôlée, visualisation du plan de course.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "Nage 1900 m",
      "desc": "Nage 1900 m crawl. Positionne-toi à l'extérieur ou à l'arrière de la masse au départ pour éviter les contacts. Routine de mise à l'eau juste avant le coup de feu : immerge le visage, souffler les bulles lentement, pars. Les 200 premiers mètres : allure conservatrice même si l'adrénaline pousse fort — tête plate, rotation du buste, longueur de coulée. Sighting toutes les 8 brassées : yeux au niveau de l'eau, pas la tête entière.",
      "tip": "Si le souffle s'emballe dans les premiers mètres : 3 expirations forcées sous l'eau en continuant à nager — c'est suffisant pour recadrer la respiration. Tu as entraîné ce protocole pendant 7 semaines."
    },
    {
      "type": "interval",
      "dist": "Transition T1",
      "desc": "T1 : combinaison (zip), casque, lunettes, vélo. Séquence mémorisée. Calme et efficace — chaque seconde de panique ici coûte 5 s.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "Vélo 90 km",
      "desc": "Vélo 90 km. Cible de puissance : 175–185 W (83–88% FTP). Les 15 premiers km : ne dépasse pas 170 W même si tu te sens très bien — la chaleur et l'excitation de départ faussent la perception. Alimentation : 60–80 g de glucides par heure dès le 1er km. Hydratation : 500–750 ml par heure. Cadence : 85–90 rpm.",
      "tip": "Ne chasse pas les autres cyclistes. Gère ta puissance — chaque watt au-delà de 190 W sur le vélo se paie sur le run. La victoire se joue sur les 21 derniers km, pas sur le vélo."
    },
    {
      "type": "interval",
      "dist": "Transition T2",
      "desc": "T2 : rack vélo, casque off, chaussures de course. Objectif < 75 s. Séquence automatique — tu l'as pratiquée.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "Run 21,1 km",
      "desc": "Run 21,1 km. Allure cible : 4:35–4:45/km. Les 2 premiers km : cours à la sensation, les jambes s'adaptent au changement de mode. Km 1–5 : 4:45/km même si tu te sens bien. Km 5–18 : régularité à 4:35–4:45/km. Km 18–21,1 : si les jambes répondent, tout ce qui reste.",
      "tip": "Le run 70.3 est une longue négociation. Commence plus lentement que tu ne le voudrais — l'adrénaline et la chaleur faussent la perception de 15 à 20%. Un km 1 à 4:30 au lieu de 4:45 peut coûter 5 min sur les 5 derniers km."
    },
    {
      "type": "cool",
      "dist": "Post-race",
      "desc": "Post-course : marche 10 min minimum, respiration contrôlée. Hydratation immédiate : 500 ml eau + électrolytes dans les 10 premières minutes. Alimentation solide dans les 30 min. Pas de stretching intense dans les 2 premières heures.",
      "tip": ""
    }
  ],
  "tip": "C'est la course. 8 semaines de travail mènent ici. Plan de course : conservateur sur la nage et les 15 premiers km vélo, régulier sur le reste du vélo et les 18 premiers km run, tout ce qui reste sur les 3 derniers km. — Trois rappels nage pour ne pas les oublier sur la plage de départ : (1) immersion du visage + bulles lentes avant le coup de feu, (2) si le souffle s'emballe : 3 expirations forcées sous l'eau en continuant à nager, (3) sighting yeux à ras de l'eau toutes les 8 brassées. Confiance dans le corps — il sait quoi faire."
}
```

#### brw8a — RÉÉCRITURE COMPLÈTE (85 min brick → 25 min récup J+1)

```json
{
  "id": "brw8a",
  "name": "Run — Récupération active J+1",
  "type": "r-recovery",
  "typeLabel": "25 min · Récup active",
  "dist": 25,
  "unit": "min",
  "sets": [
    {
      "type": "main",
      "dist": "25 min",
      "desc": "Trot très léger Z1 à >6:00/km. Pas de chrono, pas d'objectif. Juste du mouvement pour relancer la circulation et éliminer les toxines. Si les jambes sont très lourdes ou douloureuses, remplace par 30 min de marche active.",
      "tip": ""
    }
  ],
  "tip": "J+1 post-Vichy : le trot léger ou la marche accélèrent la récupération. La semaine 9 commence la décélération — cette séance est la transition."
}
```

---

### weekNum 9 (26 août–1 sept.) — RÉCUPÉRATION POST-VICHY S1

#### rw9a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "rw9a",
  "name": "Run — Trot de récupération",
  "type": "r-recovery",
  "typeLabel": "25 min · Z1 récup",
  "dist": 25,
  "unit": "min",
  "sets": [
    {
      "type": "main",
      "dist": "25 min",
      "desc": "Trot Z1 à >6:00/km. Aucune structure, aucune allure cible. S'arrêter si douleur articulaire. Écoute exclusive du corps.",
      "tip": "Si les jambes sont encore lourdes à J+5 post-Vichy, c'est normal après un 70.3. Marche plutôt que trot si besoin."
    }
  ],
  "tip": "S9 = récupération non-négociable. Le corps vient de traverser 5h+ d'effort à Vichy. Cette semaine, toute séance se termine sans fatigue supplémentaire."
}
```

#### sw9a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "sw9a",
  "name": "Natation — Récup active post-Vichy",
  "type": "s-endurance",
  "typeLabel": "30 min · Récup",
  "dist": 30,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "100 m",
      "desc": "100 m crawl très souple. Aucune consigne technique. Sens l'eau décharger les articulations.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "400 m",
      "desc": "400 m nage très douce. Les 200 premiers mètres : crawl à allure de récupération, très relâché — bras qui glissent, jambes qui traînent légèrement, aucun effort. Les 200 suivants : nage à la sensation, rythme libre, allure uniquement guidée par le confort. Pas de technique imposée, pas de sighting.",
      "tip": "Si les épaules sont fatiguées après la course, réduis à 200 m total et nage sur le dos les 200 restants — position dorsale, aucune contrainte sur les épaules."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple, aucune pression.",
      "tip": ""
    }
  ],
  "tip": "La natation est le meilleur sport de récupération active post-triathlon — l'eau décharge les articulations sans stress mécanique. Cette séance n'est pas un entraînement : c'est de la réparation."
}
```

#### bw9a — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "bw9a",
  "name": "Vélo — Pédalage récup",
  "type": "b-endurance",
  "typeLabel": "35 min · Z1 vélo",
  "dist": 35,
  "unit": "min",
  "sets": [
    {
      "type": "main",
      "dist": "35 min",
      "desc": "35 min à <126 W (Z1 exclusivement), cadence libre et confortable, aucune résistance. Home-trainer recommandé.",
      "tip": "Aucun sweetspot, aucun Z2 cette semaine. Le pédalage léger en récup post-tri accélère la circulation sanguine musculaire sans stress mécanique."
    }
  ],
  "tip": "35 min à Z1 strict : si la FC monte à 140 bpm, réduis la résistance. Cette séance est une promenade déguisée en sport."
}
```

#### rw9b — RÉÉCRITURE COMPLÈTE

```json
{
  "id": "rw9b",
  "name": "Run — Retour en douceur",
  "type": "r-recovery",
  "typeLabel": "30 min · Z1–Z2 léger",
  "dist": 30,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "5 min",
      "desc": "Marche 5 min.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "20 min",
      "desc": "Course très légère Z1–Z2 basse à 5:20–5:40/km. Premier indicateur de récupération post-Vichy.",
      "tip": "Cette séance est un test de récupération autant qu'un entraînement. Note : est-ce que les jambes tournent normalement ?"
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Marche 5 min, respirations profondes.",
      "tip": ""
    }
  ],
  "tip": "Fin de semaine 9 : si tu sors de cette séance avec des jambes relativement légères, la récupération post-Vichy progresse bien. Le prochain cycle (objectif à définir) peut commencer à se dessiner."
}
```

---

### weekNum 10 (2–8 sept.) — RÉCUPÉRATION POST-VICHY S2 / REPRISE LÉGÈRE

#### sw10a — RÉÉCRITURE COMPLÈTE (activation J-3 → reprise nage douce)

```json
{
  "id": "sw10a",
  "name": "Natation — Reprise douce",
  "type": "s-endurance",
  "typeLabel": "40 min · Reprise",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "800 m",
      "desc": "800 m crawl continu à allure confortable. Bilatérale toutes les 3 brassées sur l'intégralité + expiration aquatique. Volume réduit = occasion de consolider les automatismes sans pression de durée.",
      "tip": "Maintenir la bilatérale et l'expiration aquatique : ces automatismes OWS seront la base du prochain cycle. Ne les laisse pas dépérir."
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m à allure soutenue, récupération 40 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "800 m + 4 × 25 m : format maintenance compact. La natation maintient la mobilité des épaules et les automatismes OWS acquis pendant la prépa Vichy."
}
```

#### bw10a — RÉÉCRITURE COMPLÈTE (activation J-2 → reprise vélo Z2)

```json
{
  "id": "bw10a",
  "name": "Vélo — Reprise Z2",
  "type": "b-endurance",
  "typeLabel": "50 min · Z2 reprise",
  "dist": 50,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "10 min",
      "desc": "Pédalage progressif Z1 → 140 W.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "35 min",
      "desc": "35 min à 126–160 W (Z2 basse). Cadence 85–90 rpm. Séance de reprise — pas de sweetspot cette semaine.",
      "tip": "Si les jambes sont encore lourdes, reste à 130 W et réduis à 25 min total. La récupération est encore active en S10."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Pédalage <120 W.",
      "tip": ""
    }
  ],
  "tip": "Vélo de reprise légère. Si tu sortis de S9 avec de bonnes jambes, Z2 à 150 W sera facile — signe que la récupération est bien avancée."
}
```

#### rw10a — RÉÉCRITURE COMPLÈTE (activation J-1 → reprise run Z2)

```json
{
  "id": "rw10a",
  "name": "Run Z2 — Reprise qualité",
  "type": "r-endurance",
  "typeLabel": "45 min · Z2",
  "dist": 45,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "8 min",
      "desc": "Trot Z1 à >5:30/km.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "32 min",
      "desc": "Course Z2 à 4:50–5:10/km. Premier vrai footing Z2 depuis Vichy.",
      "tip": "Si l'allure Z2 semble difficile, reste à 5:10/km. La forme revient vite post-récup — ne force pas."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Trot Z1 puis marche 2 min.",
      "tip": ""
    }
  ],
  "tip": "S10 marque la fin de la récupération et le début d'une période libre. C'est le moment de définir le prochain objectif et d'en informer le coach pour programmer le cycle suivant."
}
```

#### rw10b — RÉÉCRITURE COMPLÈTE (RACE Triathlon L → sortie longue reprise)

```json
{
  "id": "rw10b",
  "name": "Run Long Z2 — Reprise",
  "type": "r-endurance",
  "typeLabel": "55 min · Z2 long",
  "dist": 55,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "8 min",
      "desc": "Trot Z1 à >5:30/km.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "42 min",
      "desc": "Course continue Z2 à 4:50–5:10/km. Sortie longue de reprise — régularité et patience. Surface souple recommandée.",
      "tip": "Le long Z2 post-Vichy est une séance de récupération déguisée en entraînement. Si les jambes tirent, descends à 5:20/km sans hésiter."
    },
    {
      "type": "cool",
      "dist": "5 min",
      "desc": "Trot Z1 puis marche 3 min.",
      "tip": ""
    }
  ],
  "tip": "55 min de Z2 : fin de la période de récupération. À ce stade, le prochain objectif devrait être identifié — le coach prend en main le cycle suivant dès S11."
}
```

---

## 3. AJOUTS

### AJOUT 1 — bw2a (weekNum 2) : Premier contact vélo

**Justification :** Le plan original n'avait aucun vélo en weekNum 2 (premier vélo en S3). Pour une prépa 70.3 de 7 semaines, un contact vélo dès la 2e semaine est nécessaire pour construire le volume cycliste à temps.

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

**Tip à mettre à jour sur bw3a** (qui devient le 2e vélo, pas le premier) — champ tip :
> Deuxième sortie vélo du programme, premier travail structuré en Z2 soutenue. Si les jambes semblent plus légères qu'en S2, le vélo commence à s'installer. Pas de performance à chercher ici — allure Z2 propre et régulière.

---

### AJOUT 2 — brw4a (weekNum 4) : Premier brick court

**Justification :** Le plan original n'avait pas de brick avant weekNum 6. Pour une prépa 70.3 courte (7 semaines), introduire la transition vélo→run dès la semaine 4 est essentiel pour habituer le corps avant les bricks longs de S6.

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

---

## 4. SUPPRESSIONS

| ID | weekNum | Nom original | Justification |
|----|---------|-------------|---------------|
| sw8b | 8 | Natation — Alignement corps + OWS intervalles | Race week : trop lourd, aucune session technique intensive J-3 à J-5 |
| mw8a | 8 | Renforcement — Maintenance | Race week : aucune muscu dans les 5 jours précédant la course |
| brw9a | 9 | Brick — Dernière répétition pré-race | S9 = récup post-Vichy : brick incompatible avec la récupération |
| sw9b | 9 | Natation — Endurance OWS légère | S9 = récup post-Vichy : une seule session nage (récup active) suffit |
| mw9a | 9 | Renforcement — Activation pré-course | S9 = récup post-Vichy : aucune muscu en récup active |
| rw10c | 10 | Run — Récupération J+1 | Doublon avec rw10a et rw10b dans la semaine de reprise ; semaine chargée si on conserve les 3 run |
| **Tous les IDs de weekNum 11** | 11 | rw11a, sw11a, bw11a, rw11b | Semi abandonné — ces sessions post-triathlon avaient leur sens dans l'enchaînement tri→semi, plus pertinentes |
| **Tous les IDs de weekNum 12** | 12 | rw12a, sw12a, bw12a, rw12b, rw12c, rw12d, mw12a | Phase running semi abandonnée |
| **Tous les IDs de weekNum 13** | 13 | rw13a, sw13a, rw13b, rw13c, rw13d, bw13a, mw13a | Phase running semi abandonnée |
| **Tous les IDs de weekNum 14** | 14 | rw14a, rw14b, bw14a, rw14c, mw14a, rw14d | Objectif semi-marathon 1h30 abandonné — incluant la session RACE semi |

**Total sessions supprimées : 2 (race week) + 3 (récup post-Vichy S1) + 1 (récup S2) + toutes S11–S14 = environ 25 sessions.**

---

## 5. PÉRIODISATION EXPLIQUÉE À L'ATHLÈTE

### 7 semaines pour un 70.3 : ce que ça veut dire

Une prépa standard pour un 70.3 dure 12 à 16 semaines. Avec 7 semaines disponibles (programme démarré le 1er juillet), on est dans le registre de la prépa courte. C'est faisable — et tu n'arrives pas à zéro : ta base aérobie (semi 1h37, FTP 210W, nage maîtrisée) est le socle. Ce programme ne construit pas la condition physique de zéro, il la canalise vers les exigences spécifiques d'un 70.3.

**Ce que la prépa courte change :**
- Pas de semaine de volume extrême (pas de sortie vélo de 4h, pas de sortie run de 2h30)
- Le pic de charge (weekNum 6) est plus court que dans une prépa longue — mais il est là
- L'affûtage est réel : 2 semaines de descente de volume avant la course
- La natation, le travail de calme en eau libre et la routine de départ sont déjà bien avancés — c'est un avantage majeur

### Phase par phase

**S1–S2 (Base) :** On reprend les fondations — Z2 run, technique nage OWS, premier contact vélo. Le corps se souvient, les automatismes se réactivent.

**S3–S4 (Construction) :** Les volumes montent, le premier brick apparaît en S4. Le vélo et le run progressent en parallèle. La natation continue d'ancrer les automatismes OWS. C'est ici que la base du 70.3 se construit.

**S5 (Récupération) :** Obligatoire. Volume -35%. Le corps intègre et super-compense ce qu'il a absorbé en S3–S4. Ne saute pas cette semaine — c'est là que les gains s'installent.

**S6 (Pic / Spécifique 70.3) :** La semaine de charge maximale. Brick long de 110 min (80 min vélo + 20 min run à allure race), sweetspot vélo 2×25 min, seuil run 5×5 min. C'est dur — c'est voulu.

**S7 (Affûtage) :** Volume -40% sur tous les fronts, intensité maintenue sur courtes durées. Les jambes se vident apparemment et se rechargent réellement. Si tu te sens léger et impatient en fin de S7, c'est parfait. Les bricks, les seuils et les longues sorties appartiennent au passé — désormais on gère.

**S8 (Race week) :** Activation J-3 (nage), J-2 (vélo), J-1 (run), course dimanche 23 août. Rien de plus. La semaine n'est pas une semaine d'entraînement — c'est une semaine de préparation mentale, logistique, et de conservation d'énergie.

### Le 23 août : plan de course en 4 lignes

1. **Nage** : allure conservatrice sur les 200 premiers mètres, routine de départ (immersion + bulles), sighting toutes les 8 brassées.
2. **Vélo** : 175–185 W les 75 premiers km, légèrement au-dessus ensuite si tu as encore du jus. 60–80 g de glucides par heure dès le km 0.
3. **Run** : 4:45/km sur les 5 premiers km même si tu te sens bien. 4:35–4:45/km jusqu'au km 18. Tout le reste sur les 3 derniers km.
4. **Gestion** : la chaleur de Vichy (août) peut dérégler la perception d'effort de 15 à 20%. Cours à l'effort ressenti, pas à la montre, les 5 premiers km.

### Ce que devient l'ambition semi en 1h30

Elle n'est pas abandonnée — elle est reportée. Le cycle semi était trop rapproché de Vichy pour rester cohérent. Après la récupération post-Vichy (2 semaines, S9–S10), un nouveau cycle de 10 à 12 semaines pourra être construit pour cibler un semi à l'automne 2026 (octobre ou novembre). Les 7 semaines de prépa Vichy, le travail de seuil et le volume run accumulés renforcent cette ambition — ils ne la retardent pas.

---

*Document à destination du prompt-engineer pour brief dev. Ne pas modifier index.html directement.*
