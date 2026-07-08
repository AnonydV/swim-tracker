---
name: decisions-race-window-brainstorm
description: "Brainstorm features fenêtre course Vichy 70.3 (juillet 2026, v11) : B1-B6 + top 3 recommandé (checklist, plan de course, bilan)"
metadata:
  type: project
---

# Brainstorm fenêtre course (2026-07-07, app v11)

Contexte : Vichy 70.3 le 23 août 2026, jour J en weekNum 7, pic S4, affûtage S6. Code vérifié : semaines post-course S8-S10 (récup→reprise) déjà bâties dans le plan ; jour J = séance avec T1/T2 en prose ; AUCUNE checklist ni plan de course consolidé n'existe ; perfResults par discipline + RPE + note ; header countdown+phase livré.

Idées proposées (nom, quand, effort monofichier) :
- **B1 — Plan de course consolidé** (pacing par segment nat/vélo/run + timeline nutrition + T1/T2). Impact fort / effort moyen. Livrer **semaine de course**, figer à l'affûtage S6. Problème : plan d'exécution éparpillé dans ~200 tips.
- **B2 — Checklist course** (sac T1/T2, veille J-1, matin J ; ticks localStorage réutilisables). Impact moyen-fort / effort **faible**. Livrer **semaine de course** (utile dès sorties lac combi).
- **B3 — Bilan de course structuré** (chrono par segment, RPE global, a marché/à corriger/surprise, nutrition ; version ciblée de l'ex-N7). Impact fort / effort faible-moyen. Livrer **post-course**.
- **B4 — Feu de forme quotidien** (readiness 1 tap superposé au load chart N3). Impact moyen / effort moyen. **À CHALLENGER** : risque doublon avec RPE par séance + fatigue de saisie → réserve, pas top.
- **B5 — Assignation jour par séance** ("c'est quoi aujourd'hui"). Valeur quotidienne forte MAIS renverse un choix de design délibéré (liste plate) ET touche le modèle de données. **Reporté post-course** : mauvais timing d'introduire un risque de régression à 7 sem. de la course.
- **B6 — Clôture de bloc + amorce prochain objectif** (synthèse bloc, réarmer muscu+semi parkés, poser prochaine date via programEnd existant). Impact moyen / effort moyen. Livrer **post-course**.

Écartés d'office : météo/temp lac (API, offline impossible), mode plein écran pendant effort (déjà NO-GO en P5), multi-athlète.

**Top 3 recommandé :** 1) B2 checklist (quick win rentable), 2) B1 plan de course (plus fort enjeu de l'année), 3) B3 bilan (filet à insight le moins cher). B1+B2 = "mode course" léger, livrables séparément, B2 d'abord.

**Why:** Fenêtre à forte convergence vers un événement unique ; l'app est encore "pré-Vichy" sans outillage jour J ni capture d'après-course.
**How to apply:** Prioriser B2 puis B1 avant le 23 août ; B3/B6 post-course ; ne pas ressortir B4/B5 sans argument nouveau fort (B5 rouvrable post-course seulement). Lié : [[decisions-p1-p5-proposals]].
