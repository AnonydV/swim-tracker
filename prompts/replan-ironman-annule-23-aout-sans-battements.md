# Prompt - Modifier le programme apres Ironman annule, objectif 23 aout

Tu es coach triathlon longue distance et prompt-engineer pour modifier le tracker HIPLAN.

## Contexte athlete

L'athlete avait deja une preparation Ironman complete dans les jambes.
L'epreuve initiale devait avoir lieu le 28 juin 2026, mais elle a ete annulee 2 jours avant la course.

Il transfere maintenant son dossard vers une nouvelle course le 23 aout 2026.

Il ne faut donc pas construire une preparation comme si l'athlete repartait de zero. Le corps a deja absorbe une grosse preparation longue distance. L'objectif est de prolonger, entretenir, specifiser et affuter sans recreer une surcharge inutile.

## Objectif principal

Adapter le programme actuel jusqu'au 23 aout 2026 pour arriver frais, confiant et specifique course.

Le plan doit etre coherent avec un athlete qui:
- sort d'une preparation Ironman interrompue juste avant course;
- a probablement une grosse base aerobie;
- doit eviter de refaire un deuxieme pic trop violent;
- a besoin de garder du rythme, du specifique triathlon et de l'affutage;
- doit preserver la fraicheur mentale apres la frustration de l'annulation.

## Dates a respecter

- Course initiale annulee: 28 juin 2026.
- Annulation: environ 2 jours avant l'epreuve.
- Nouvelle course: 23 aout 2026.
- Le programme doit aller jusqu'a cette date.
- La semaine du 23 aout doit etre une race week, avec course le dimanche 23 aout 2026.

## Philosophie de programmation

Ne pas faire une preparation "from scratch".

Construire plutot:
1. une phase de decompression / re-stabilisation apres l'annulation;
2. une phase de maintien actif avec rappel d'intensite;
3. une phase specifique triathlon courte;
4. une phase d'affutage propre;
5. une race week tres legere.

La charge doit etre intelligente:
- pas de surcharge excessive;
- pas de volume heroique inutile;
- pas de longues sorties destructrices trop proches de la course;
- conserver une sortie longue velo ou brick specifique, mais placee suffisamment loin de la race week;
- garder des rappels d'allure course;
- proteger les jambes pour arriver frais.

## Natation - consignes importantes

Garder les grandes lignes du travail natation deja prevu:
- aisance en crawl;
- endurance continue;
- respiration maitrisee;
- gestion du calme en eau libre;
- sighting;
- trajectoire;
- routine de depart;
- simulation de stress de depart;
- capacite a retrouver le souffle rapidement;
- automatisation eau libre pour le jour J.

En revanche, retirer le focus specifique sur les battements de pied.

Concretement:
- supprimer les blocs dedies aux battements de cote;
- supprimer les blocs dedies au battement en streamline;
- supprimer les consignes longues sur "battre depuis les hanches";
- supprimer le focus technique "jambes actives" comme objectif principal;
- ne pas faire de travail jambes isole.

Remplacer ce focus par:
- position horizontale relachee;
- hanches hautes sans crispation;
- jambes economes;
- battement naturel leger;
- nage longue, stable et efficace;
- respiration fluide;
- sighting propre;
- calme mental en eau libre.

Important:
- Le battement peut rester mentionne uniquement comme une consigne secondaire de stabilisation, par exemple "jambes legeres" ou "battement naturel".
- Ne pas construire de seances autour des battements.
- Ne pas utiliser de planche.
- Ne pas transformer la natation en bloc technique jambes.

## Priorites natation conservees

Les seances natation doivent surtout renforcer:
- expiration aquatique complete;
- respiration bilaterale si deja maitrisee, sans l'imposer partout si cela degrade le calme;
- sighting toutes les 8 a 12 brassees selon contexte;
- depart calme;
- retour au calme apres acceleration;
- nage continue a allure confortable;
- confiance en eau libre.

## Velo

Adapter le velo a un athlete deja prepare:
- maintenir une base endurance solide;
- inclure du tempo / sweet spot / allure course;
- faire au moins un gros rappel specifique suffisamment loin du 23 aout;
- eviter de refaire une accumulation type Ironman complete;
- integrer la nutrition de course sur les sorties longues;
- conserver des rappels de cadence et de puissance si le plan les utilise deja.

Si des zones de puissance existent deja dans le programme, les reutiliser.
Ne pas inventer de nouvelles zones contradictoires.

## Course a pied

La course a pied doit:
- maintenir l'endurance;
- garder des rappels d'allure course apres velo;
- eviter les seances trop traumatisantes;
- privilegier la regularite;
- inclure quelques enchainements velo-course;
- reduire progressivement la charge avant le 23 aout.

Ne pas maintenir un objectif secondaire qui entrerait en conflit avec la course du 23 aout.

## Bricks

Inclure des bricks, mais avec parcimonie:
- un ou deux bricks specifiques utiles;
- un brick principal place avant l'affutage;
- un brick court de confirmation en phase taper;
- aucun brick destructeur en race week.

Les bricks doivent servir a:
- retrouver les sensations de transition;
- caler l'allure course a pied apres velo;
- tester nutrition et gestion de l'effort;
- rassurer l'athlete sans le fatiguer inutilement.

## Affutage

Prevoir un affutage clair avant le 23 aout:
- baisse du volume;
- maintien de petites touches d'intensite;
- beaucoup de fraicheur;
- natation courte orientee sensations;
- velo court avec rappel allure course;
- course courte avec quelques lignes droites ou blocs tres courts;
- pas de musculation lourde dans les derniers jours.

Race week:
- tres peu de volume;
- activation natation J-3 ou J-4;
- activation velo J-2;
- activation course J-1;
- course le dimanche 23 aout 2026.

## Travail attendu dans le code

Modifier le programme dans `index.html`, en respectant l'architecture existante.

Contraintes techniques:
- garder le format actuel de `weeklyPlan`;
- conserver les champs existants des sessions: `id`, `name`, `type`, `typeLabel`, `dist`, `unit`, `sets`, `tip`;
- ne pas casser les fonctions existantes;
- ne pas renommer les fonctions globales;
- ne pas introduire de nouvelle architecture;
- verifier que les IDs restent uniques;
- ne pas laisser de references contradictoires a l'ancienne course du 28 juin comme objectif futur;
- ne pas laisser de focus "battements de pied" dans les titres, tips ou descriptions de natation.

## Controles a effectuer

Apres modification:
- rechercher toutes les occurrences de `battement`, `battements`, `jambes`, `kick`, `planche`;
- verifier que les mentions restantes sont secondaires et non des blocs de travail dedies;
- rechercher les dates `28 juin`, `23 aout`, `Ironman`;
- verifier que le 23 aout est bien l'objectif final;
- verifier que la race week est coherente;
- verifier que la charge descend avant la course;
- verifier que la natation garde les grandes lignes eau libre sans focus jambes.

## Ton des tips

Le ton doit etre:
- rassurant;
- lucide;
- oriente athlete deja prepare;
- sans culpabiliser l'annulation;
- centre sur la fraicheur, la confiance et la continuite.

Exemple d'intention:

> Tu n'es pas en train de recommencer une preparation. Tu prolonges une base deja construite et tu la transformes en fraicheur specifique pour le 23 aout.

## Livrable attendu

Produire un programme modifie jusqu'au 23 aout 2026, coherent avec cette situation:
- preparation Ironman deja faite;
- course annulee le 28 juin;
- dossard transfere au 23 aout;
- natation conservee dans ses grandes lignes eau libre;
- suppression du focus specifique sur les battements de pied.
