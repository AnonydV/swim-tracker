---
name: project-active-program
description: Programme 10 semaines actif — objectif 70.3 Vichy dim. 23 août 2026 (weekNum 7) — calage S1 = 6 juil.
metadata:
  type: project
---

Programme 10 semaines (weekNums 1-10), replanifié intégralement le 2026-07-06.

**Objectif unique actif**
- weekNum 7 : 70.3 Vichy (1,9 km nage / 90 km vélo / 21,1 km run) — dimanche 23 août 2026
- Semi-marathon 1h30 : ABANDONNÉ — à replanifier post-Vichy

**Calage confirmé par l'athlète le 2026-07-06**
- S1 = 6–12 juillet 2026 (lundi→dimanche)
- Aujourd'hui = J1 de S1
- TOTAL_WEEKS = 10 (7 semaines training + 3 récup)
- Date de fin programme : 2026-09-13 (dimanche 13 septembre)

**Correspondance weekNums / dates (définitif)**
- weekNum 1 : 6–12 juil. (en cours, J1 = 2026-07-06)
- weekNum 2 : 13–19 juil.
- weekNum 3 : 20–26 juil.
- weekNum 4 : 27 juil.–2 août
- weekNum 5 : 3–9 août
- weekNum 6 : 10–16 août
- weekNum 7 : 17–23 août — RACE WEEK (race dim. 23 août = dernier jour de S7)
- weekNum 8 : 24–30 août — récup post-Vichy S1
- weekNum 9 : 31 août–6 sept. — récup post-Vichy S2
- weekNum 10 : 7–13 sept. — transition libre

**Phases programme**
- S1–S2 : Base aérobie
- S3–S4 : Construction 70.3 (S4 = pic)
- S5 : Récupération (-35%)
- S6 : Affûtage
- S7 : Race week (activations J-3/J-2/J-1 + RACE dim. 23)
- S8–S10 : Récupération post-course

**WEEK_PHASES (nouvelle valeur JS)**
```javascript
const WEEK_PHASES = [
  { phase: 1, name: 'BASE AÉROBIE',      weeks: [1, 2] },
  { phase: 2, name: 'CONSTRUCTION 70.3', weeks: [3, 4] },
  { phase: 3, name: 'AFFÛTAGE & RACE',   weeks: [5, 6, 7] },
  { phase: 4, name: 'RÉCUPÉRATION',      weeks: [8, 9, 10] },
];
```

**Muscu : ABANDONNÉE (décision athlète 2026-07-06)**
Toutes sessions mw* supprimées du programme. mw1a, mw2a, mw3a, mw4a, mw5a, mw6a, mw7a.

**3 sorties lac (arbitrage v11)**
1. sw1c (weekNum 1, cette semaine) — sans combinaison, exposition courte
2. sw4c (weekNum 4) — avec combinaison, 1800 m
3. sw7a (weekNum 6) — sans combinaison, pré-course

**Grosse sortie vélo (arbitrage v11)**
- bw4a (weekNum 4) : 135 min Z2 + nutrition 60-80 g/h (demande athlète : réassurance)
- Compensation : rw4a réduit de 60→40 min Z2

**Sessions clés par semaine**
- weekNum 1 : rw1a, rw1b, sw1b, sw1c (lac)
- weekNum 2 : rw2a, rw2b, sw2a, sw2b, bw2a
- weekNum 3 : rw3a, rw3b, sw3a, sw3b, bw6a (déplacé depuis S6), brw4a (déplacé depuis S4)
- weekNum 4 : rw4a (réduit), rw6b (déplacé depuis S6 — seuil 5×5), sw4a, sw4c (lac), bw4a (135 min), brw6a (déplacé depuis S6)
- weekNum 5 : rw5a, rw5b, sw5a, sw5b, bw5a
- weekNum 6 : rw7a, bw7a, rw7b, brw7a, sw7a (lac sans combi), sw7b (optionnel)
- weekNum 7 : sw8a, bw8a, rw8a, rw8b (RACE)
- weekNum 8 : rw8c, rw9a, sw9a, bw9a, rw9b
- weekNum 9 : sw10a, bw10a, rw10a, rw10b
- weekNum 10 : sw10b, bw10b, rw10c

**Fichiers replan coach**
- `prompts/coach-replan-vichy-70-3.md` : replan initial v8 (base)
- `prompts/coach-amendements-v10.md` : 4 amendements (ton IM, battement 2T, brw6a puissance, rw8b Ironman)
- `prompts/coach-amendements-v11.md` : SUPERSÉDÉ par le replan v11
- `prompts/coach-replan-v11-7-semaines.md` : DOCUMENT DE RÉFÉRENCE ACTUEL (replan complet 7 semaines)

**Why:** Calage S1=6 juil. positionne la course au dernier jour de S7, pas en S8. L'athlète refuse de surcharger S7. Muscu abandonnée (décision ferme). Ces trois contraintes ont imposé un replan complet.

**How to apply:** Toujours référencer le coach-replan-v11-7-semaines.md pour l'état du programme. La race est en weekNum 7, J = dim. 23 août. Toute question sur "dans combien de semaines" se calcule depuis weekNum 1 = 6 juil.
