# CLAUDE.md - ECCOTA-EPF

Claude Code intervient surtout pour la conception, la revue contradictoire, l'analyse de cause
et les arbitrages produit/architecture.

## Role attendu

- Questionner le perimetre avant d'elargir.
- Identifier les risques oublies.
- Verifier les impacts sur les utilisateurs, les donnees et la livraison.
- Proposer des alternatives quand une solution cree trop de dette.
- Ne pas modifier les memes fichiers qu'un autre agent en meme temps.

## Livrable attendu

Une analyse courte, actionnable, avec les risques, les options et la recommandation.


## Repartition du travail sur ce projet

- **Claude** : architecture, modele de donnees, decoupage en lots, revue contradictoire,
  arbitrages. Produit les documents de `docs/`, pas le code.
- **Codex** : implementation des lots de `docs/taches/`, dans l'ordre des dependances.

Une fiche de lot est le contrat entre les deux. Si Codex doit sortir du perimetre d'un lot
pour le terminer, c'est la fiche qui est corrigee, pas le perimetre qui est etendu en
silence.

## Points de vigilance propres au projet

- Le projet se construit en deux phases : statique Bootstrap (lots 0 a 3), puis PHP et
  administration (lots 4 a 8). Voir `docs/technique/ARCHITECTURE.md` section 1.
- L'espace d'administration est au devis. Il est decale, pas abandonne. Le rappeler au
  client a chaque point d'etape.
- Le lot 4 ne doit modifier aucun rendu : son critere d'acceptation est un test de
  non-regression HTML contre les pages de la phase 1. D'ou la regle d'en-tete et de pied de
  page strictement identiques des le lot 1.
- Les contenus et images provisoires sont le risque le plus concret de cette phase : une
  photo d'illustration presentee comme une realisation d'ECCOTA-EPF est une information
  fausse dans un document commercial. `CONTENUS_PROVISOIRES.md` est bloquant au lot 8.
- Pas de framework serveur en phase 2 : chaque protection de securite est ecrite a la main,
  donc chaque oubli est reel. Le lot 7 n'est pas negociable contre du delai.
