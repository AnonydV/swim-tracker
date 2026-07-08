---
name: project-replan-v11
description: Replan structurel v11 appliqué le 2026-07-06 — course en S7 (23 août), muscu supprimée, WEEK_PHASES recalées, 3 sorties lac
metadata:
  type: project
---

Replan v11 appliqué le 2026-07-06 sur index.html (v11) et sw.js (hiplan-v11).

**Décisions majeures :**
- Course (rw8b) déplacée de weekNum 8 → weekNum 7 (dimanche 23 août 2026)
- Toutes les sessions mw* supprimées (muscu abandonnée définitivement)
- TOTAL_WEEKS reste 10 ; date de fin programme : 2026-09-13
- WEEK_PHASES : [1,2] BASE | [3,4] CONSTRUCTION | [5,6,7] AFFÛTAGE & RACE | [8,9,10] RÉCUPÉRATION
- 3 sorties lac : sw1c (S1 sans combi), sw4c (S4 avec combi 1800 m), sw7a (S6 sans combi)

**Structure finale (48 sessions) :**
- wN1: rw1a, rw1b, sw1b, sw1c (4)
- wN2: rw2a, rw2b, sw2a, sw2b, bw2a (5)
- wN3: rw3a, rw3b, sw3a, sw3b, bw6a, brw4a (6)
- wN4: rw4a, rw6b, sw4a, sw4c, bw4a, brw6a (6)
- wN5: rw5a, rw5b, sw5a, sw5b, bw5a (5)
- wN6: rw7a, bw7a, rw7b, brw7a, sw7a, sw7b (6)
- wN7: sw8a, bw8a, rw8a, rw8b (4) — RACE WEEK
- wN8: rw8c, rw9a, sw9a, bw9a, rw9b (5)
- wN9: sw10a, bw10a, rw10a, rw10b (4)
- wN10: sw10b, bw10b, rw10c (3)

**Déplacements clés (IDs conservés, weekNum changé) :**
- brw4a wN4→wN3, bw6a wN6→wN3, rw6b wN6→wN4, brw6a wN6→wN4
- rw7a/bw7a/rw7b/brw7a/sw7a/sw7b wN7→wN6
- sw8a/bw8a/rw8a/rw8b wN8→wN7
- rw8c reste wN8 (était déjà là)
- rw9a/sw9a/bw9a/rw9b wN9→wN8
- sw10a/bw10a/rw10a/rw10b wN10→wN9

**Why:** Athlète sort d'une annulation Ironman J-2 ; course 70.3 Vichy = 23 août 2026 ; muscu abandonnée décision ferme athlète.

**How to apply:** Ne jamais recréer de sessions mw* dans le plan. La RACE est en weekNum 7, pas 8. Les 3 sorties lac sw1c/sw4c/sw7a sont des IDs stables localStorage.
