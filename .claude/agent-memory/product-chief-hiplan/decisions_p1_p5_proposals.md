---
name: decisions-p1-p5-proposals
description: "Verdicts produit sur les 5 propositions brainstorm juillet 2026 (P1 zones, P2 écart, P3 snapshots, P4 countdown, P5 mode séance) + roadmap intégrée"
metadata:
  type: project
---

# Verdicts sur les 5 propositions brainstorm (2026-07-03)

Arbitrage rendu par le Product Chief après vérif du code réel (index.html ~4400 l).

- **P1 — Zones centralisées `userZones` + placeholders {Z2run}** : **GO socle, PAS quick win.** Vérifié : **157 occurrences** d'allures/watts EN DUR dans les descriptions prose. Le coût caché = migrer ces 157 cibles vers placeholders sur 15 semaines → effort réel **moyen-fort** (pas moyen). Valeur non quotidienne (zones changent qq fois/saison) mais fort levier de maintenance. **Prérequis technique de P2.**
- **P2 — Badge écart prévu/réalisé à la saisie** : **GO conditionnel, dépend de P1.** "Effort faible" vrai UNIQUEMENT si cibles structurées. En l'état (cibles en prose type "4:50–5:10/km"), parser = fragile → NO-GO. Doit venir APRÈS P1. Usage vraiment quotidien (chaque saisie), synergie N1.
- **P3 — Snapshots rotatifs localStorage** : **GO ferme, quick win.** Ne pas lui appliquer le test usage-hebdo : c'est de l'assurance contre perte totale (nettoyage navigateur = historique saison perdu, seul filet actuel = export manuel). Déclencheur clôture semaine existe déjà (`weeklyRecapShown`), clés STORE centralisées, panneau restore existe. Anneau de 3.
- **P4 — Countdown course + jalon phase header** : **GO mais = FINIR U5, pas une feature neuve.** Fusionner avec U5 (phase affichée, progression pas encore). Briques déjà là (`programEnd`, `TOTAL_WEEKS`, semaine active). Un seul lot, jamais spécifier séparément.
- **P5 — Mode "pendant la séance" plein écran** : **NO-GO en l'état, à REFRAMER.** Challenge : pendant l'effort on ne regarde pas le tel (nat impossible, vélo dangereux, run illisible). Seule discipline où tel-pendant-effort est réel = **muscu** (timer repos, exo suivant). Reframe → "mode muscu guidé" fusionné avec alternative N6. Abandonner le plein-écran multi-discipline.

**Why:** Décidé après lecture du code (allures en dur confirmées, cibles non structurées, aucun backup auto).
**How to apply:** Chaîne séquentielle P1→P2 (pas 2 features indépendantes). P4+U5 = 1 item. P5 rejoint le parking "muscu" avec alternative N6.

## État livré vérifié au code (2026-07-05, app v6)
Vérif index.html directe : livrés = N1-N5, P3 snapshots, P4+U5, ET **tous les quick wins** A1 (validatePlan), A2 (getDiscipline+prefix), A3 (export version:1), A4 (wrapper unique getCalendarActiveWeekNum), U2 (nav 48px), U3 (bouton semaine active), U4 (toast max-width). Le backlog quick wins est vidé.
**Restent réellement : P1, P2, A5** + parkés (P5, N6-alt, N7). `userZones` n'existe pas encore (0 occurrence). Cibles allures/watts en dur dans la prose desc/tip : ~200 mentions.
**Bug actif confirmé** : `updateBikeDiff()` colore vert si diff>=0 sinon rouge — sémantique fausse, aucune notion de fourchette. Micro-fix (orange/bleu + delta) découplable de P2, proposé à l'utilisateur. Cible vélo alimentée par regex fragile (`wMatch`) sur la prose → P1 la supprime.

## Roadmap intégrée (max 5, révisée 2026-07-05)
1. Fix couleur vélo (micro-correction découplée de P2, faible effort, corrige signal actif)
2. P1 MVP (objet userZones + sheet ⚙ + carte référence)
3. P1 extension (migration prose → placeholders, effort fort, étalé)
4. P2 comparateur générique run/nat/vélo à fourchette (post-P1)
5. A5 délégation par tranches (opportuniste)

P5 reframé parké avec N6-alt. N7 = bilan post-course seulement.
Question ouverte toujours à trancher : fréquence de changement des zones d'ici la course → arbitre P1 complet vs P1 MVP-carte-seule.

## Question ouverte à trancher avec l'utilisateur
Fréquence réelle de changement des zones cette saison ? Si 1-2× d'ici la course → P1 vaut l'investissement. Si quasi jamais → P1 peut descendre derrière un P2 fait "en dur" temporaire.

Lié : contexte backlog N1-N7 et modèle de données dans l'auto-mémoire projet (project_backlog.md, product_state_datamodel.md).
