# Révision programme natation — HIPLAN
# Généré le 2026-07-05 (v2 — remplace la révision du 2026-07-03)

---

## CONTEXTE DE CETTE RÉVISION

Point d'étape athlète le 2026-07-05 (semaine 1 active, programme démarré le 2026-07-01).

**Trois feedbacks à intégrer :**

1. **Crawl 3 temps maîtrisé** — suppression de toute mention de brasse dans les séances (la brasse comme filet de sécurité n'est plus nécessaire). Aucune exception, y compris les retours au calme et les récupérations inter-séries.

2. **Gestion du calme en eau libre** — l'athlète arrive à court de souffle dès les premiers mètres en eau libre (stress de départ, emballement respiratoire). Nouvelle priorité : apprendre à gérer la respiration sous pression dès la S1, par escalade progressive jusqu'à la race week.

3. **Jambes sous-utilisées** — battements quasi absents. Travail de jambes régulier introduit sans planche (pas de kickboard disponible) : battement de côté, battement en streamline, battement 2T conscient intégré dans les séances.

**Ce qui change par rapport à la révision du 2026-07-03 :**
- Tous les "brasse" de récupération remplacés par "repos à l'appui" ou "crawl très souple"
- Blocs d'expiration aquatique et de simulation stress départ ajoutés (S1 → S9)
- Battement de côté et battement 2T intégrés dans 7 sessions au lieu de 2
- sw11a révisé pour la première fois (was "NON MODIFIÉ" en v1)

**Semaine active au 2026-07-05 :** weekNum 1.
Aucune semaine passée : toutes les sessions sw1a → sw13a sont à réviser.

---

## IDS MODIFIÉS

sw1a, sw1b, sw2a, sw2b, sw3a, sw3b, sw4a, sw4b, sw5a, sw5b, sw6a, sw6b, sw7a, sw7b, sw8a, sw8b, sw9a, sw9b, sw10a, sw11a, sw12a, sw13a

**sw14** : aucune séance natation dans cette semaine (taper semi).

---

## NOTE SUR LA SUBSTITUTION DE LA BRASSE

| Ancienne formulation | Nouvelle formulation |
|---|---|
| "Récupération X s brasse" | "Récupération X s (repos à l'appui du bord)" |
| "X m brasse récupération" (cool) | "X m crawl très souple" |
| "150 m brasse récupération" (cool) | "100 m crawl très souple" |
| "200 m brasse récupération douce" (cool) | "150 m crawl très souple" |
| "Pause brasse X s optionnelle/facultative" | "Pause X s (repos à l'appui, facultatif)" |
| "Insère 25 m brasse toutes les 200 m" | supprimé |

---

## NOTE SUR LE TRAVAIL DE JAMBES SANS PLANCHE

Trois formats utilisés selon la session :

**Battement de côté** : un bras tendu devant, l'autre le long du corps, tête en position de rotation (oreille sur l'épaule, visage immergé). Battre les jambes depuis les hanches, amplitude 20–25 cm maxi, chevilles souples, orteils légèrement pointés. Inspirer en montant le visage sur le côté comme en crawl. Alterner le côté de référence toutes les longueurs.

**Battement en streamline** : départ au bord, deux bras tendus au-dessus de la tête (position de plongeon), tête entre les bras. Avancer sur 10–15 m en ne battant que des jambes, corps horizontal, chevilles souples. Reprendre pied ou faire demi-tour.

**Battement 2T conscient** : crawl normal avec 1 seul battement par cycle complet de bras (gauche + droit = un cycle). Les jambes stabilisent l'alignement, elles ne propulsent pas. Hanches hautes, orteils pointés vers l'arrière.

---

## SESSIONS RÉVISÉES

---

### Semaine 1 — sw1a — "Natation — Sighting intro + alignement corps" → "Natation — Expiration aquatique + battement de côté + sighting"

```json
{
  "id": "sw1a",
  "name": "Natation — Expiration aquatique + battement + sighting",
  "type": "s-technique",
  "typeLabel": "40 min · Technique OWS",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple. Avant de pousser : immerge le visage 3 secondes, souffle lentement des bulles sous l'eau jusqu'à vider les poumons — c'est ta routine de mise à l'eau. Focus position : hanches hautes, orteils pointés vers l'arrière.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 50 m",
      "desc": "Expiration aquatique : 4 × 50 m crawl. Consigne unique : souffler TOUTES les bulles sous l'eau AVANT de tourner la tête pour inspirer. Pas de retenue du souffle entre l'expiration et l'inspiration — le cycle doit être fluide. Récupération 30 s (repos à l'appui du bord). Objectif : ancrer le réflexe d'expiration complète, fondation anti-stress respiratoire en eau libre.",
      "tip": "En eau libre, le stress de départ provoque souvent une retenue de souffle inconsciente. Le CO2 s'accumule, la panique s'installe. Souffler avant d'inspirer, c'est le premier automatisme à acquérir."
    },
    {
      "type": "interval",
      "dist": "4 × 50 m",
      "desc": "Battement de côté : 4 × 50 m alternés. 25 m en position latérale droite : bras droit tendu devant, bras gauche le long du corps, oreille gauche posée sur l'épaule (visage dans l'eau). Battre les jambes depuis les hanches, amplitude 20–25 cm maxi, chevilles souples. Inspirer en tournant le visage vers le haut. 25 m crawl en conservant la sensation du battement depuis les hanches. Alterner le côté de référence d'une répétition à l'autre. Récupération 35 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "100 m",
      "desc": "100 m crawl en intégrant les deux sensations : expiration complète avant chaque inspiration + battement depuis les hanches. 1 sighting toutes les 10 brassées (yeux au niveau de l'eau, pas la tête entière). Allure confortable.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple, allure libre. Relâchement total.",
      "tip": ""
    }
  ],
  "tip": "Trois automatismes démarrent aujourd'hui : (1) expiration complète sous l'eau avant d'inspirer — fondation anti-panique, (2) battement depuis les hanches avec cheville souple — pas d'énergie gaspillée aux genoux, (3) sighting yeux au niveau de l'eau — pas la tête entière. Ces trois choses prennent 3 à 4 semaines pour s'ancrer complètement."
}
```

---

### Semaine 1 — sw1b — "Natation — Endurance + bilatérale intro" (titre inchangé)

```json
{
  "id": "sw1b",
  "name": "Natation — Endurance + bilatérale intro",
  "type": "s-endurance",
  "typeLabel": "45 min · Endurance",
  "dist": 45,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple, accélération progressive sur les 50 derniers mètres.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "600 m",
      "desc": "600 m crawl continu à allure régulière. Respiration bilatérale imposée : toutes les 3 brassées (inspiration à gauche puis à droite en alternance). Sur l'intégralité du bloc : expiration complète sous l'eau avant chaque inspiration — souffler les bulles pendant la phase de propulsion, tourner la tête uniquement pour inspirer. Sighting toutes les 12 brassées sur les 200 derniers mètres.",
      "tip": "La bilatérale semble inconfortable au début — c'est normal. L'automatisme s'installe en 3 à 4 semaines. En eau libre, elle te permet de respirer du côté opposé aux vagues et de garder ton cap."
    },
    {
      "type": "interval",
      "dist": "4 × 50 m",
      "desc": "4 × 50 m crawl légèrement soutenu. Sur chaque 50 m : 1 sighting entre les 20 m et les 30 m (regard horizontal, reprendre le rythme immédiatement). Les 10 derniers mètres de chaque 50 m : conscience des jambes — elles doivent battre depuis les hanches, amplitude réduite, chevilles souples. Récupération 20 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple, aucune consigne technique.",
      "tip": ""
    }
  ],
  "tip": "600 m avec bilatérale imposée et expiration aquatique : durée minimale pour commencer à ancrer les deux automatismes simultanément. Ne cherche pas à maintenir l'allure — la coordination respiratoire prime sur la vitesse cette semaine."
}
```

---

### Semaine 2 — sw2a — "Natation — Trajectoire sans repère + sighting" → "Natation — Trajectoire + simulation stress de départ"

```json
{
  "id": "sw2a",
  "name": "Natation — Trajectoire + simulation stress de départ",
  "type": "s-technique",
  "typeLabel": "45 min · Technique OWS",
  "dist": 45,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple, focus position axiale : hanches hautes, orteils pointés.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "6 × 25 m",
      "desc": "Nage sans ligne : 6 × 25 m crawl sans regarder la ligne noire au fond. Fixe un point sur le mur d'en face. Entre chaque 25 m, note si tu as dévié dans ton couloir. Récupération 30 s debout. Objectif : mesurer ton asymétrie naturelle de trajectoire.",
      "tip": "Si tu déries systématiquement du même côté, c'est ton asymétrie de propulsion. Le sighting régulier en course compensera — c'est ton information personnelle de calibrage."
    },
    {
      "type": "interval",
      "dist": "4 × 50 m",
      "desc": "Simulation stress de départ : 4 × 50 m. Départ debout sans appui mur (simulation eau libre). Les 10 premiers mètres : allure vive pour simuler l'accélération de début de course et l'emballement respiratoire qui l'accompagne. Dès les 10 m atteints : prendre conscience du souffle — souffler 2–3 bulles sous l'eau, ralentir progressivement vers l'allure normale. 40 m crawl à allure soutenue mais contrôlée avec expiration aquatique et 1 sighting à 25 m. Récupération 40 s (repos à l'appui).",
      "tip": "L'emballement respiratoire à la mise à l'eau est un réflexe de stress. Le travail d'aujourd'hui : reproduire ce stress sur 10 m, puis le dissoudre intentionnellement. C'est ce que tu feras exactement en course."
    },
    {
      "type": "main",
      "dist": "100 m",
      "desc": "100 m crawl continu, respiration bilatérale toutes les 3 brassées. Sighting toutes les 10 brassées.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Le sprint de 10 m + retour au calme est l'exercice le plus important de la semaine. Ton objectif en course : être capable de retrouver le rythme respiratoire en moins de 20 mètres après le départ. Ça commence ici."
}
```

---

### Semaine 2 — sw2b — "Natation — Volume continu + bilatérale structurée" (titre inchangé)

```json
{
  "id": "sw2b",
  "name": "Natation — Volume continu + bilatérale structurée",
  "type": "s-endurance",
  "typeLabel": "50 min · Endurance",
  "dist": 50,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl progressif, très souple. Routine de mise à l'eau avant de partir : immerge le visage 3 secondes, souffle des bulles lentement.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "800 m",
      "desc": "800 m crawl continu à allure régulière. Structure par blocs de 200 m : blocs 1 et 3 → respiration sur ton côté dominant toutes les 2 brassées + expiration aquatique complète. Blocs 2 et 4 → bilatérale toutes les 3 brassées + expiration aquatique complète. Sur les blocs bilatéraux : l'expiration forcée compense l'inconfort de la bilatérale — souffler bulles pendant la propulsion, inspirer brièvement en rotation.",
      "tip": "L'expiration aquatique sur les blocs bilatéraux te permet de respirer moins souvent sans ressentir d'urgence respiratoire. C'est précisément ce dont tu auras besoin dans les 100 premiers mètres de la nage en triathlon."
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m sprint modéré. Départ debout sans appui mur. Immédiatement après chaque sprint (en touchant le mur) : 2 expirations forcées sous l'eau avant de repartir. Récupération totale 45 s. Objectif : habituer le corps à récupérer la respiration après une accélération courte.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "800 m avec bilatérale par blocs et expiration aquatique : les blocs bilatéraux vont te sembler nettement plus confortables quand l'expiration est complète. Note la différence de sensation — c'est ton indicateur de progression."
}
```

---

### Semaine 3 — sw3a — "Natation — Virage eau libre + bilatérale imposée" → "Natation — Virage eau libre + battement de côté + bilatérale"

```json
{
  "id": "sw3a",
  "name": "Natation — Virage eau libre + battement de côté + bilatérale",
  "type": "s-technique",
  "typeLabel": "45 min · Technique OWS",
  "dist": 45,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl progressif. Sighting toutes les 12 brassées sur les 100 derniers mètres.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 75 m",
      "desc": "Virage eau libre : 4 × 75 m. 25 m crawl normal → s'arrêter 2 m avant le mur SANS le toucher → faire un demi-tour en eau libre (rotation latérale du corps, repousser depuis l'eau avec les jambes, pas depuis le mur) → 50 m crawl avec sighting toutes les 10 brassées. Récupération 35 s (repos à l'appui). Le virage : sens l'impulsion des jambes pendant la rotation — c'est la même force qu'en battement de côté.",
      "tip": "En triathlon, le virage aux bouées coûte 3 à 5 secondes. En pratiquant le virage sans appui, tu réduis cette perte et tu habitues les jambes à produire de la propulsion en dehors du crawl linéaire."
    },
    {
      "type": "interval",
      "dist": "4 × 50 m",
      "desc": "Combo battement + bilatérale : 4 × 50 m. 25 m battement de côté (alterner bras droit devant / bras gauche devant d'une répétition à l'autre) — battre depuis les hanches, amplitude 20–25 cm, chevilles souples, respiration en rotation. 25 m crawl avec bilatérale imposée toutes les 3 brassées, battement conscient depuis les hanches. Récupération 35 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Le battement de côté sur les 25 m impairs sert à ressentir l'origine du mouvement (hanches) puis à le transférer immédiatement dans le crawl bilatéral. Ce transfert battement→nage est l'essentiel de la séance."
}
```

---

### Semaine 3 — sw3b — "Natation — Cap 1000 m + protocole OWS" (titre inchangé)

```json
{
  "id": "sw3b",
  "name": "Natation — Cap 1000 m + protocole OWS",
  "type": "s-endurance",
  "typeLabel": "55 min · Endurance",
  "dist": 55,
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
      "dist": "1000 m",
      "desc": "1000 m crawl continu à allure régulière. Décompose en 4 × 250 m. Protocole OWS : sighting toutes les 10 brassées sur l'intégralité + expiration aquatique complète à chaque inspiration. Structure respiratoire : 250 m 1 et 3 → côté dominant. 250 m 2 et 4 → bilatérale toutes les 3 brassées. Pause facultative 25 s (repos à l'appui) entre chaque 250 m.",
      "tip": "Premier 1000 m avec protocole OWS complet et expiration aquatique intégrée. Si la bilatérale te ralentit sur les blocs pairs, note l'écart — il doit se réduire chaque semaine."
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "Simulation stress de départ : 4 × 25 m. Départ debout sans appui mur. 8 m à allure vive (stress de départ simulé) → 3 expirations forcées sous l'eau en continuant à nager → 17 m crawl relâché. Récupération 40 s. Objectif : raccourcir chaque semaine le nombre de mètres nécessaires pour retrouver le souffle après une accélération.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Note le temps de ton 1000 m. C'est ton premier chrono de référence avec protocole OWS et expiration aquatique intégrés. L'allure baissera au fil des semaines à mesure que les automatismes s'ancrent."
}
```

---

### Semaine 4 — sw4a — "Natation — OWS : sighting, désorientation, trajectoire" → "Natation — OWS : désorientation + simulation complète stress départ"

```json
{
  "id": "sw4a",
  "name": "Natation — OWS : désorientation + simulation stress départ",
  "type": "s-technique",
  "typeLabel": "55 min · Technique OWS",
  "dist": 55,
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
      "dist": "4 × 100 m",
      "desc": "OWS combiné — 4 × 100 m : 25 m sighting fréquent (toutes les 6 brassées) + 25 m yeux fermés (nage 25 m les yeux fermés, ouvre les yeux uniquement en touchant le mur ou si tu quittes clairement le couloir, note ta déviation) + 50 m crawl normal à allure soutenue avec sighting toutes les 10 brassées. Sur toute la longueur : expiration aquatique complète. Récupération 45 s (repos à l'appui).",
      "tip": "Les 25 m yeux fermés révèlent ton asymétrie naturelle. Si tu sors de plus d'un couloir, ton sighting devra être toutes les 8 brassées en course, pas 10 ou 12."
    },
    {
      "type": "interval",
      "dist": "4 × 50 m",
      "desc": "Simulation stress de départ complète : 4 × 50 m. Départ debout sans appui mur. 15 m à allure maximale (adrénaline de course simulée) → immédiatement : 3 expirations forcées sous l'eau en continuant à nager → 35 m crawl à allure soutenue mais contrôlée avec expiration aquatique et 1 sighting à mi-longueur. Récupération 40 s (repos à l'appui). Objectif : retrouver le rythme respiratoire en 3 expirations ou moins.",
      "tip": "L'objectif de progressivité : en S2 tu y arrivais en 10 m, en S4 en 15 m d'effort. D'ici S7, tu dois pouvoir faire 25 m vite et revenir au calme en 2 expirations."
    },
    {
      "type": "cool",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "La simulation complète de stress de départ sur 15 m + retour au calme en 3 expirations : c'est le protocole de gestion de l'emballement respiratoire. Entraîné en piscine, il s'applique automatiquement en eau libre."
}
```

---

### Semaine 4 — sw4b — "Natation — Volume + navigation active" (titre inchangé)

```json
{
  "id": "sw4b",
  "name": "Natation — Volume + navigation active",
  "type": "s-endurance",
  "typeLabel": "60 min · Endurance + vitesse",
  "dist": 60,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl progressif. Avant de partir : routine de mise à l'eau — immerge le visage 3 secondes, bulles lentes.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "1200 m",
      "desc": "1200 m crawl continu à allure régulière. Décompose en 3 × 400 m. Sur les 400 m 2 et 3 : ne regarde pas la ligne noire au fond — utilise uniquement le sighting (toutes les 10 brassées) pour rester dans le couloir. Pause 30 s (repos à l'appui) facultative entre chaque 400 m. Sur l'intégralité : expiration aquatique complète, battement conscient depuis les hanches.",
      "tip": "Si tu sors de ton couloir en naviguant uniquement au sighting, raccourcis l'intervalle à toutes les 8 brassées. Si tu restes dans le couloir sans effort, allonge à 12 — tu trouves ton intervalle optimal."
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m sprint court. Départs debout sans appui mur. Récupération 50 s (repos à l'appui). Sur les 25 m : battement actif depuis les hanches, les jambes participent à l'accélération.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "1200 m avec 800 m de navigation active sans ligne au fond : tu simules les conditions réelles de l'eau libre. En triathlon L, il n'y a pas de ligne noire — seulement les bouées et le sighting."
}
```

---

### Semaine 5 — sw5a — "Natation — OWS léger + alignement corps" (titre inchangé)

```json
{
  "id": "sw5a",
  "name": "Natation — OWS léger + alignement corps",
  "type": "s-technique",
  "typeLabel": "35 min · Technique souple",
  "dist": 35,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 50 m",
      "desc": "OWS check léger : 2 × 50 m avec sighting toutes les 8 brassées (qualité du geste uniquement), 2 × 50 m avec bilatérale toutes les 3 brassées + expiration aquatique. Récupération 40 s (repos à l'appui). Qualité uniquement, aucun effort.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "200 m",
      "desc": "200 m crawl continu. Focus alignement : hanches hautes, orteils pointés, battement depuis les hanches à amplitude minimale. Allure très confortable. Vérification que les jambes participent même à allure légère.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Semaine de récupération : ancre les sensations OWS et l'expiration aquatique acquises, n'en apprends pas de nouvelles. Si le sighting et la bilatérale semblent naturels cette semaine, l'automatisme commence à tenir."
}
```

---

### Semaine 5 — sw5b — "Natation — Volume réduit + sighting maintenu" (titre inchangé)

```json
{
  "id": "sw5b",
  "name": "Natation — Volume réduit + sighting maintenu",
  "type": "s-endurance",
  "typeLabel": "40 min · Endurance allégée",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "150 m",
      "desc": "150 m crawl souple.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "800 m",
      "desc": "800 m crawl continu à allure très confortable. Sighting relaxé toutes les 12 à 15 brassées (moins qu'en course, objectif : maintenir l'habitude sans charge mentale). Expiration aquatique maintenue. Battement léger conscient.",
      "tip": "800 m faciles avec sighting et expiration intégrés : les automatismes se maintiennent même à faible intensité. C'est précisément ce qu'on cherche en semaine de récup."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "800 m vs 1200 m la semaine précédente : volume réduit intentionnellement. La semaine de récup est aussi une fenêtre pour consolider les automatismes sans pression de performance."
}
```

---

### Semaine 6 — sw6a — "Natation — Endurance + intervalles OWS" → "Natation — Endurance + intervalles OWS + battement actif"

```json
{
  "id": "sw6a",
  "name": "Natation — Endurance + intervalles OWS + battement actif",
  "type": "s-endurance",
  "typeLabel": "55 min · Endurance + intervalles",
  "dist": 55,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple. Sur les 50 derniers mètres : bilatérale toutes les 3 brassées + battement de côté sur les 25 premiers mètres (bras droit tendu, rouler sur le côté, 10 brassées, puis reprendre le crawl).",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "600 m",
      "desc": "600 m crawl continu à allure régulière. Sighting toutes les 12 brassées. Expiration aquatique complète. Battement depuis les hanches conscient sur l'intégralité.",
      "tip": ""
    },
    {
      "type": "interval",
      "dist": "6 × 50 m",
      "desc": "6 × 50 m crawl à allure soutenue. Départs debout sans appui mur. Sighting aux 15 m et aux 35 m de chaque longueur. Sur les 15 derniers mètres de chaque 50 m : battement actif et conscient depuis les hanches — les jambes doivent aider à maintenir la vitesse. Récupération 30 s (repos à l'appui).",
      "tip": "Le battement actif sur les 15 derniers mètres de chaque 50 m : si les jambes coulent en fin de longueur faute de battement, tu perds de l'allure. Ce focus final te fait prendre conscience de leur rôle stabilisateur."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Format endurance + intervalles avec OWS et battement intégrés. La fatigue en fin de 50 m est exactement le moment où les jambes décrochent — c'est là que tu les travailles aujourd'hui."
}
```

---

### Semaine 6 — sw6b — "Natation — Long 1500 m protocole OWS" (titre inchangé)

```json
{
  "id": "sw6b",
  "name": "Natation — Long 1500 m protocole OWS",
  "type": "s-endurance",
  "typeLabel": "65 min · Endurance longue",
  "dist": 65,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl progressif. Routine de mise à l'eau avant de partir.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "1500 m",
      "desc": "1500 m crawl continu à allure régulière. Décompose en 3 × 500 m. Protocole par bloc :\n• 500 m 1 : respiration dominante, sighting toutes les 10 brassées, expiration aquatique complète.\n• 500 m 2 : bilatérale toutes les 3 brassées, sighting toutes les 10 brassées, battement conscient depuis les hanches.\n• 500 m 3 : retour à ton rythme naturel, sighting maintenu, gestion de l'allure prioritaire.\nPause 30 s (repos à l'appui) entre chaque 500 m.",
      "tip": "Si la bilatérale te ralentit sur le bloc 2, c'est précisément pourquoi on la travaille maintenant, à quelques semaines de la course. Elle sera acquise avant le départ."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Premier 1500 m avec protocole OWS complet par blocs. Si tu tiens cette distance avec bilatérale sur 500 m, sighting régulier et expiration aquatique, la nage du triathlon L (1900 m) n'a plus rien d'insurmontable."
}
```

---

### Semaine 7 — sw7a — "Natation — Race distance OWS simulation" → "Natation — 1800 m race simulation + routine départ"

```json
{
  "id": "sw7a",
  "name": "Natation — 1800 m race simulation + routine départ",
  "type": "s-endurance",
  "typeLabel": "75 min · Endurance longue",
  "dist": 75,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "300 m",
      "desc": "300 m crawl progressif : 100 m très souple + 100 m intermédiaire + 100 m allure séance. Sur ce dernier 100 m : 1 sighting à mi-longueur. Routine de mise à l'eau avant de pousser : immerge le visage 5 secondes, souffler les bulles lentement jusqu'à vider les poumons — c'est ton signal de départ.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "1800 m",
      "desc": "1800 m crawl continu à allure régulière. Décompose en 3 × 600 m. Protocole OWS complet :\n• Sighting toutes les 10 brassées sur l'intégralité.\n• 600 m 1 et 3 : respiration dominante, expiration aquatique complète.\n• 600 m 2 : bilatérale toutes les 3 brassées, battement depuis les hanches conscient.\n• Avant chaque 600 m : routine de mise à l'eau (3 s immersion, bulles). Reprise avec départ debout sans appui mur.\nPause 25 s (repos à l'appui) entre chaque 600 m.",
      "tip": "1800 m = 95% de la distance race. La routine de mise à l'eau avant chaque 600 m simule le moment de départ et sa gestion du stress. Tu entraînes le geste mental autant que le geste physique."
    },
    {
      "type": "interval",
      "dist": "6 × 50 m",
      "desc": "6 × 50 m crawl légèrement soutenu. Départs debout sans appui mur. Sur les 50 m impairs (1, 3, 5) : sighting toutes les 8 brassées, bilatérale. Sur les 50 m pairs (2, 4, 6) : 10 m yeux fermés en milieu de longueur, correction de cap, battement actif sur les 15 derniers mètres. Récupération 25 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Semaine pic. 1800 m avec protocole OWS complet et routine de mise à l'eau : si le sighting et la bilatérale sont devenus des automatismes, concentre-toi sur la régularité de l'allure. Si tu oublies encore le sighting à 600 m, concentre-toi uniquement sur ça — l'allure viendra après."
}
```

---

### Semaine 7 — sw7b — "Natation — OWS simulation : 8 × 50 m" (titre inchangé)

```json
{
  "id": "sw7b",
  "name": "Natation — OWS simulation : 8 × 50 m",
  "type": "s-endurance",
  "typeLabel": "65 min · Endurance + vitesse",
  "dist": 65,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl progressif avec sighting toutes les 10 brassées.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "800 m",
      "desc": "800 m crawl continu à allure confortable. Respiration bilatérale sur les 400 premiers mètres, rythme libre ensuite. Sighting toutes les 12 brassées. Battement depuis les hanches sur l'intégralité — check en milieu de longueur : est-ce que les jambes bougent ?",
      "tip": ""
    },
    {
      "type": "interval",
      "dist": "8 × 50 m",
      "desc": "8 × 50 m crawl OWS simulation. Départs debout sans appui mur. Récupération 25 s (repos à l'appui). Structure par lot :\n• 50 m 1–2 : sighting toutes les 8 brassées, bilatérale, expiration aquatique.\n• 50 m 3–4 : 10 m yeux fermés au départ, ouverture des yeux, correction de cap, poursuite à allure soutenue avec battement actif.\n• 50 m 5–6 : allure race soutenue, 1 sighting à mi-longueur, respiration dominante, battement actif sur les 15 derniers mètres.\n• 50 m 7–8 : simulation de départ vif (10 m) + retour au calme (3 expirations + 40 m contrôlé) + sortie debout au mur sans appui.",
      "tip": "Les 50 m 7–8 sont la simulation la plus réaliste de ce que tu vivras en course : départ vif, panique respiratoire possible, retour au calme intentionnel. L'objectif est que ce retour au calme prenne moins de 3 expirations."
    },
    {
      "type": "cool",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "2e séance natation de la semaine pic. Les 8 × 50 m couvrent l'intégralité des situations eau libre — sighting, désorientation, vitesse, gestion du stress de départ. Elle complète sw7a orientée endurance."
}
```

---

### Semaine 8 — sw8a — "Natation — Endurance OWS 1600 m" (titre inchangé)

```json
{
  "id": "sw8a",
  "name": "Natation — Endurance OWS 1600 m",
  "type": "s-endurance",
  "typeLabel": "65 min · Endurance",
  "dist": 65,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "300 m",
      "desc": "300 m crawl progressif. Routine de mise à l'eau avant de partir.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "1600 m",
      "desc": "1600 m crawl continu à allure régulière. Décompose en 4 × 400 m. Protocole OWS intégré :\n• Sighting toutes les 10 brassées sur l'intégralité.\n• 400 m 1 et 3 : respiration dominante, expiration aquatique, battement conscient.\n• 400 m 2 et 4 : bilatérale toutes les 3 brassées, battement depuis les hanches, sighting maintenu.\n• Reprise de chaque 400 m avec départ debout sans appui mur et routine de mise à l'eau (3 s immersion).\nPause 20 s (repos à l'appui) optionnelle entre chaque 400 m.",
      "tip": "La routine de mise à l'eau avant chaque 400 m : elle doit devenir un réflexe de calme, pas une contrainte. En course, tu l'exécuteras naturellement avant le départ."
    },
    {
      "type": "interval",
      "dist": "4 × 50 m",
      "desc": "4 × 50 m crawl à allure race. Départs debout sans appui mur. Simulation stress de départ sur les 50 m 1 et 3 : 15 m vifs + retour au calme. Sur les 50 m 2 et 4 : 10 m yeux fermés à mi-longueur, correction de cap, battement actif final. Récupération 30 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "1800 m en S8, 1600 m ici : légère réduction de volume. L'allure des 1er et 4e blocs de 400 m doit être identique malgré les variations de respiration — c'est ton indicateur de maîtrise OWS."
}
```

---

### Semaine 8 — sw8b — "Natation — Alignement corps + OWS intervalles" (titre inchangé)

```json
{
  "id": "sw8b",
  "name": "Natation — Alignement corps + OWS intervalles",
  "type": "s-technique",
  "typeLabel": "60 min · Technique + vitesse",
  "dist": 60,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple. Focus : hanches hautes à la surface, orteils pointés vers l'arrière, rotation axiale conservée.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 100 m",
      "desc": "Battement 2 temps conscient — 4 × 100 m : 25 m battement de côté (côté gauche sur les 100 m impairs, côté droit sur les 100 m pairs) — battre depuis les hanches, amplitude 20 cm maxi, cheville souple, 10–12 brassées par 25 m. + 75 m crawl nage normale avec 1 seul battement par cycle de bras complet (battement 2 temps) : les jambes stabilisent, elles ne propulsent pas. Hanches hautes, orteils pointés. Récupération 40 s (repos à l'appui).",
      "tip": "Sur les 75 m de nage : si les jambes coulent malgré le battement 2T, serre légèrement les fessiers et pointe les orteils davantage. En triathlon avec combinaison, la combinaison assistera — ici tu construis l'alignement sans aide."
    },
    {
      "type": "interval",
      "dist": "6 × 50 m",
      "desc": "6 × 50 m OWS complet. Départs debout sans appui mur. Sighting toutes les 8 brassées. Bilatérale imposée. Expiration aquatique. Allure race soutenue. Battement actif sur les 15 derniers mètres. Récupération 25 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "150 m",
      "desc": "150 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Séance technique au service du triathlète : le battement 2 temps préserve les jambes pour le vélo et la course, le battement de côté ancre l'origine du mouvement dans les hanches. Ces 2 éléments combinés, bien maîtrisés, améliorent ta position dans l'eau et réduisent la traînée sur 1900 m."
}
```

---

### Semaine 9 — sw9a — "Natation — Rappel OWS + ancrage pré-course" → "Natation — Ancrage prérace : routine départ + calme"

```json
{
  "id": "sw9a",
  "name": "Natation — Ancrage prérace : routine départ + calme",
  "type": "s-technique",
  "typeLabel": "40 min · Technique",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl souple. Routine de mise à l'eau avant de partir : immerge le visage, souffle les bulles lentement. Mémorise ce geste — tu le feras exactement ainsi avant le départ de la course.",
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
      "tip": "Si le retour au calme prend encore 5 expirations ou plus, rachète-toi du côté conservateur en course : pars en dehors de la masse, prends ton rythme sur les 100 premiers mètres."
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "En affûtage, deux choses à mémoriser pour la course : (1) routine de mise à l'eau — immersion, bulles lentes, départ calme, (2) si le souffle s'emballe — 3 expirations forcées sous l'eau en continuant à nager, ça suffit à recadrer la respiration."
}
```

---

### Semaine 9 — sw9b — "Natation — Endurance OWS légère" (titre inchangé)

```json
{
  "id": "sw9b",
  "name": "Natation — Endurance OWS légère",
  "type": "s-endurance",
  "typeLabel": "40 min · Endurance",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "150 m",
      "desc": "150 m crawl souple.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "800 m",
      "desc": "800 m crawl continu à allure confortable et détendue. Protocole OWS final : sighting toutes les 12 brassées, bilatérale sur les 400 premiers mètres, expiration aquatique complète sur l'intégralité. Reprise de chaque 200 m avec départ sans appui mur. Volume divisé par 2 vs S8 — maintien des automatismes, aucun effort.",
      "tip": "800 m vs 1600 m en S8 : tu n'as plus rien à gagner en volume. Si le protocole OWS se fait sans effort mental, l'automatisme est ancré pour la course."
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m crawl à allure race. Départs debout sans appui mur. 1 sighting à mi-longueur. Récupération 40 s. Rappel de la vivacité.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Dernière séance endurance natation avant la race week. Si les sensations aquatiques sont fluides avec le protocole OWS et que la routine de départ est naturelle, fais confiance à ta nage le jour J."
}
```

---

### Semaine 10 — sw10a — "Natation — Activation OWS J-3" → "Natation — Activation J-3 : routine départ + automatismes race"

```json
{
  "id": "sw10a",
  "name": "Natation — Activation J-3 : routine départ + automatismes race",
  "type": "s-technique",
  "typeLabel": "30 min · Activation",
  "dist": 30,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "200 m",
      "desc": "200 m crawl très souple. Avant de pousser : routine de mise à l'eau — immerge le visage, souffle les bulles lentement jusqu'à vider les poumons, sens le contact de l'eau, pars. C'est exactement ce que tu feras J-0 avant le coup de feu.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "4 × 50 m",
      "desc": "Activation OWS — 4 × 50 m : 25 m sighting actif (toutes les 8 brassées — mémorisation du geste parfait) + 25 m crawl à allure race avec expiration aquatique et battement depuis les hanches. Récupération 45 s. Objectif : ancrer le geste, aucune charge physique.",
      "tip": ""
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m : 2 simulations de départ (10 m vifs + retour au calme en 3 expirations + 15 m crawl contrôlé) + 2 à allure confort. Départs debout. Récupération 40 s. Rappel du protocole anti-stress.",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple. Relâchement total.",
      "tip": ""
    }
  ],
  "tip": "Race week — trois rappels tactiques : (1) routine de mise à l'eau avant le départ, immersion + bulles lentes, (2) si le souffle s'emballe dans les premiers mètres : 3 expirations forcées sous l'eau en continuant à nager, (3) sighting : yeux au niveau de l'eau, pas la tête entière, toutes les 8 brassées."
}
```

---

### Semaine 11 — sw11a — "Natation — Récup active" (PREMIÈRE MODIFICATION — was NON MODIFIÉ en v1)

**Note coaching :** sw11a est la récupération post-triathlon. La précédente version (non modifiée) utilisait la brasse comme style de nage de récupération. Elle est maintenant retirée — le crawl très souple et une liberté de rythme offrent la même décharge articulaire sans référence à la brasse.

```json
{
  "id": "sw11a",
  "name": "Natation — Récup active post-triathlon",
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
      "desc": "400 m nage très douce. Les 200 premiers mètres : crawl à allure de récupération, très relâché — bras qui glissent, jambes qui traînent légèrement, aucun effort. Les 200 suivants : nage à la sensation, rythme libre, allure uniquement guidée par le confort. Pas de technique imposée, pas de sighting, pas de bilatérale.",
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

---

### Semaine 12 — sw12a — "Natation — Maintenance" (titre inchangé)

```json
{
  "id": "sw12a",
  "name": "Natation — Maintenance",
  "type": "s-endurance",
  "typeLabel": "40 min · Maintenance",
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
      "tip": "La bilatérale en mode maintenance : tu ne progresseras plus en natation avant le semi, mais maintenir l'automatisme aquatique améliore la mobilité des épaules et servira au prochain triathlon."
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
  "tip": "800 m + 4 × 25 m format maintenance compact. La natation maintient la mobilité des épaules et les automatismes OWS. 40 min chrono et tu es dehors."
}
```

---

### Semaine 13 — sw13a — "Natation — Maintenance légère" (titre inchangé)

```json
{
  "id": "sw13a",
  "name": "Natation — Maintenance légère",
  "type": "s-endurance",
  "typeLabel": "40 min · Maintenance",
  "dist": 40,
  "unit": "min",
  "sets": [
    {
      "type": "warm",
      "dist": "150 m",
      "desc": "150 m crawl souple.",
      "tip": ""
    },
    {
      "type": "main",
      "dist": "700 m",
      "desc": "700 m crawl continu à allure très confortable. Maintien du sighting (toutes les 15 brassées) et de la bilatérale acquis pendant la prépa triathlon. Expiration aquatique maintenue. Le running est la priorité de cette semaine — cette séance est de la maintenance.",
      "tip": "700 m vs 800 m la semaine précédente : volume légèrement réduit, automatismes OWS maintenus."
    },
    {
      "type": "interval",
      "dist": "4 × 25 m",
      "desc": "4 × 25 m vivacité, récupération 40 s (repos à l'appui).",
      "tip": ""
    },
    {
      "type": "cool",
      "dist": "100 m",
      "desc": "100 m crawl très souple.",
      "tip": ""
    }
  ],
  "tip": "Avant-dernière séance natation du programme. La semaine 14 (taper semi) n'a pas de séance natation — celle-ci clôture le travail aquatique. 40 min chrono."
}
```

---

## RÉSUMÉ DE LA PROGRESSION PAR COMPÉTENCE

### Gestion du calme et de la respiration en début d'effort

| Semaine | Session | Contenu |
|---|---|---|
| S1 | sw1a | Expiration aquatique intro : souffler les bulles AVANT d'inspirer |
| S1 | sw1b | Expiration aquatique sur 600 m continus |
| S2 | sw2a | Sprint 10 m + retour au calme intentionnel (première simulation) |
| S2 | sw2b | Expirations forcées après sprints courts |
| S3 | sw3b | Simulation 8 m vif + retour au calme sur 4 × 25 m |
| S4 | sw4a | Simulation complète 15 m vifs + 3 expirations + 35 m calme |
| S4 | sw4b | Battement actif pendant accélérations |
| S5 | sw5a | Ancrage léger — maintien de l'expiration aquatique |
| S6 | sw6a | Battement actif en fin de longueur sous pression |
| S7 | sw7a | Routine de mise à l'eau systématique avant chaque 600 m |
| S7 | sw7b | Simulation stress départ sur 50 m 7–8 : départ vif + 3 expirations |
| S8 | sw8a | Routine de mise à l'eau + simulation stress dans les 4 × 50 m |
| S9 | sw9a | Confirmation que le retour au calme prend moins de 3 expirations |
| S10 | sw10a | Mémorisation du protocole race : routine + gestion si emballement |

### Travail de jambes (sans planche)

| Semaine | Session | Contenu |
|---|---|---|
| S1 | sw1a | Battement de côté 4 × 50 m (intro, alternance côtés) |
| S1 | sw1b | Check battement dans les intervalles (jambes depuis les hanches) |
| S3 | sw3a | Battement de côté intégré dans le bloc bilatérale |
| S4 | sw4b | Battement actif pendant les sprints |
| S6 | sw6a | Battement actif sur les 15 derniers mètres des 6 × 50 m |
| S7 | sw7a | Battement 2T sur 600 m 2 (bilatérale + battement combinés) |
| S7 | sw7b | Check battement en milieu de 800 m + battement actif final sur 50 m |
| S8 | sw8b | Battement de côté + battement 2T sur 4 × 100 m (bloc complet) |
| S9–S10 | sw9a, sw10a | Battement 2T maintenu dans les blocs OWS |

### Suppression de la brasse

Toutes les sessions sw1a → sw13a : zéro mention de "brasse" (style de nage). Remplacements :
- Récupérations → repos à l'appui du bord
- Cool-down → crawl très souple
- Pauses optionnelles → repos à l'appui

Note : "brassées" (= coups de bras en crawl) est conservé dans les formulations de type "sighting toutes les 8 brassées".

---

## JUSTIFICATION COACHING — POUR L'ATHLÈTE

Ces trois problématiques (stress respiratoire en eau libre, jambes passives, brasse comme béquille) sont liées : quand on manque de confiance en eau libre, on retient le souffle, les jambes décrochent, et on cherche instinctivement la brasse comme "zone de confort". Maintenant que le crawl 3 temps est maîtrisé, on s'attaque à la racine.

**Sur le calme respiratoire :** l'emballement respiratoire au départ n'est pas un problème de condition physique — c'est un réflexe de stress. La solution est de l'entraîner comme n'importe quel automatisme sportif : reproduire le stimulus (sprint court, adrénaline simulée) puis pratiquer la réponse souhaitée (expirations forcées + retour au calme). La progression est claire : 10 m vifs en S2, 15 m en S4, 25 m en S7. À la race week, le protocole doit déclencher en moins de 3 expirations.

**Sur les jambes :** le battement de côté sans planche est le meilleur drill pour enseigner l'origine du mouvement (hanches, pas genoux). Une fois que tu sens cette traction depuis les hanches en position latérale, elle se transfère naturellement dans le crawl. En triathlon longue distance, les jambes ne propulsent pas — elles stabilisent. Mais "quasi absentes" comme tu les décris, elles créent de la traînée en laissant couler les hanches. Le battement 2T conscient coûte très peu d'énergie et améliore significativement ta position dans l'eau.

**Sur la brasse :** la retirer des séances te force à développer la récupération active en crawl et les repos passifs à l'appui du bord — deux alternatives qui te rapprochent davantage des conditions réelles de course, où la brasse n'est pas une option.
