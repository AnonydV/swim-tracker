---
name: project-tracker-structure
description: Architecture et état du tracker HIPLAN (index.html) — structure des plans, fonctionnalités, lacunes identifiées
metadata:
  type: project
---

Le tracker est une SPA HTML/JS (index.html) dans C:\Users\vicba\OneDrive\Documents\HIPLAN\.

**Why:** Application de suivi du plan d'entraînement Half Ironman, stockage localStorage, utilisable en PWA.

**How to apply:** Toute génération de plan doit respecter le format JSON des plans existants (swimPlan, bikePlan, semiRunPlan, strengthPlan) pour intégration directe sans reformattage.

## Structure des plans actifs (15 semaines)

- `swimPlan` : 15 semaines, 30 séances, bassin 50m — progression 1800m → 2500m (S10 pic) → allègement
- `bikePlan` : 15 semaines, 30 séances — Z2 fondamental S1-5, Sweet Spot S6-10, Z1-Z2 récup S11-15
- `semiRunPlan` : 15 semaines, ~47 séances — objectif semi 1h30, allure cible 4'16/km
- `strengthPlan` : 3 templates seulement (A/B/C), exercices non détaillés — lacune majeure

## Variables mortes à supprimer (dead code)

- `plan` : ancien plan natation 13 semaines S1-S13 — non utilisé dans les stats ni le rendu
- `runPlan` : plan run alternatif 13 semaines — non utilisé (remplacé par semiRunPlan)

## Phases du programme (WEEK_PHASES)

1. BASE AÉROBIE (S1-5)
2. CONSTRUCTION (S6-10)
3. SPÉCIFIQUE (S11-13)
4. AFFÛTAGE (S14-15)

## Fonctionnalités existantes

- Vue semaine par défaut (colonnes par discipline)
- Marquer séance done / skip / uncheck
- Notes libres par séance (sauvegardées en localStorage)
- Champ résultat : uniquement pour r-quality et r-race (run seulement)
- Progression globale % (barre de header)
- Stats : séances faites, total, skippées, km nage cumulés, min vélo cumulés, km run cumulés
- Load chart run-only (Charge Run — 15 semaines, 4 phases colorées)
- Calendrier : la semaine active se calcule depuis la date de fin du programme
- Export / Import JSON
- Copie de toutes les notes

## Lacunes fonctionnelles identifiées (audit 2026-07-01)

1. Champ résultat inexistant pour natation, vélo, muscu
2. Pas de séance brick vélo+run dans aucun plan
3. Plan musculation (strengthPlan) sans exercices détaillés
4. Load chart mono-discipline (run seulement) — pas de vue multi-sport
5. Pas de RPE ni charge hebdomadaire en heures
6. Unités incomparables dans la barre stats (m nage / min vélo / km run)
