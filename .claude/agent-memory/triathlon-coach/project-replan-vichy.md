---
name: project-replan-vichy
description: Replan 70.3 Vichy 23 août 2026 — sessions modifiées, ajouts, suppressions, périodisation
metadata:
  type: project
---

Replan généré le 2026-07-06. Fichier complet : `prompts/coach-replan-vichy-70-3.md`.

**Amendements v10 générés le 2026-07-06 :** Fichier `prompts/coach-amendements-v10.md`. 15 champs modifiés (0 ID renommé, 0 session ajoutée/supprimée). Contexte nouveau : athlète sortait d'une prépa Ironman complète pour course 28 juin 2026, annulée 2 jours avant le départ — dossard transféré au 70.3 Vichy 23 août. 4 amendements :
1. **Ton S1–S5** : rw3a tip ("Construction" → "entretien actif"), brw4a tip ("découvrir" → "retrouver/rappel"). Les autres tips S1–S5 étaient déjà corrects en v9.
2. **brw6a intensité** : 168–189 W sweetspot plein → 168–178 W tempo confort (sets[1].desc + sets[1].tip + tip session).
3. **Cue 2T natation** : réintroduite comme cue positionnelle 1 phrase dans les 8 blocs d'endurance continue (sw1b, sw2b, sw3b, sw4b, sw5b, sw6a, sw6b, sw7b) — sans set dédié.
4. **rw8b RACE** : avantage base Ironman ajouté (sets[3].desc + tip) — marge 180–190 W vélo km 15+ si bonnes sensations, ligne confiance en tête du tip race.

**Déclencheur :** Changement d'objectif confirmé le 2026-07-05. Semi 1h30 (weekNum 14) abandonné. Focus 100% 70.3 Vichy (23 août 2026, weekNum 8).

**Sessions inchangées (weekNums 1–5) :** Contenu conservé. Seuls quelques tips corrigés (références "semi en 1h30", numéros de semaines erronés, "triathlon L").

**Tips à corriger dans weekNums 1–5 :**
- rw3b : "d'ici S10" → "d'ici Vichy"
- rw4a : "triathlon L et le semi" → "70.3 Vichy"
- rw4b : "calibrée sur l'objectif 1h30" → "calibrée sur tes qualités de course actuelles"
- rw5a : "S6 = récupération vs S5" → "S5 = récupération vs S4"
- bw5a : "80 min (S5)" → "80 min (S4)"
- rw6a : "S7 marque l'entrée... (S8-S10)" → updated pour 70.3
- rw6b : "semi en 1h30" → "4:35–4:45/km à Vichy"
- bw6a : "depuis S5" → "depuis S4"

**Sessions intégralement réécrites :**
- brw6a : 65 min → 110 min brick long (80 min vélo + 20 min run à 4:35–4:45/km) — devient le brick long de référence
- rw7a, sw7a, bw7a, rw7b, brw7a, sw7b : weekNum 7 complet → affûtage (-40%)
- sw8a, bw8a, rw8a, rw8b (→ RACE 70.3 Vichy), brw8a : weekNum 8 → race week
- rw9a, sw9a, bw9a, rw9b : weekNum 9 → récup post-Vichy S1
- sw10a, bw10a, rw10a, rw10b : weekNum 10 → récup post-Vichy S2 / reprise légère

**Ajouts :**
- bw2a (weekNum 2) : premier contact vélo 60 min Z2
- brw4a (weekNum 4) : premier brick 50 min (30 min vélo + 12 min run)

**Suppressions :**
- sw8b, mw8a (race week)
- brw9a, sw9b, mw9a (récup post-Vichy S1)
- rw10c (doublon récup)
- Tous weekNums 11–14 (semi abandonné) : rw11a, sw11a, bw11a, rw11b, rw12a, sw12a, bw12a, rw12b, rw12c, rw12d, mw12a, rw13a, sw13a, rw13b, rw13c, rw13d, bw13a, mw13a, rw14a, rw14b, bw14a, rw14c, mw14a, rw14d

**3 rappels natation race day (dans tip de rw8b et sw8a) :**
1. Routine de mise à l'eau avant le départ : immersion visage + bulles lentes
2. Si souffle s'emballe : 3 expirations forcées sous l'eau en continuant à nager
3. Sighting : yeux au niveau de l'eau (pas la tête entière), toutes les 8 brassées

**Why:** 7 semaines disponibles (weekNum 1 = 1 juil., weekNum 8 = 19–25 août, race = dim. 23 août). Prépa courte viable sur base aérobie existante.

**How to apply:** Le fichier replan est prêt pour le prompt-engineer (brief dev). Ne pas modifier index.html directement.

**Mode course généré le 2026-07-07 :** `prompts/coach-mode-course.md` — 3 livrables (fiche jour J 5 blocs, checklist 4 sections, protocole nutrition). Cibles consolidées depuis rw8b + bw4a + brw6a : vélo 175–185 W, run 4:35–4:45/km, nutrition 60–80 g/h. Section "À figer en S6" incluse.
