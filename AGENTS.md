# AGENTS.md - ECCOTA-EPF

Ce projet suit le template Web/Mobile GassTech.

## Avant de modifier

Lire dans cet ordre :

1. `docs/PROJECT_CONTEXT.md`
2. `docs/WORKLOG.md`
3. la tache active
4. les fichiers directement concernes

## Regles de travail

- Ne pas depasser le perimetre demande.
- Ne pas commit, push, supprimer ou migrer des donnees sans demande explicite.
- Ne pas ajouter de dependance sans raison claire.
- Dire le niveau reel atteint : code, compile, teste, livre.
- Preserver les donnees utilisateur.
- Noter les decisions durables dans `docs/PROJECT_CONTEXT.md`.
- Noter l'avancement dans `docs/WORKLOG.md`.

## Verification minimale

- Web : build, parcours principal, mobile et desktop.
- Mobile : build/install si possible, parcours principal, migration de donnees si concernee.
- Fullstack : frontend, backend, contrat API et cas erreur.

## Cloture

Terminer par un rapport court avec :

- resume ;
- fichiers touches ;
- commandes lancees ;
- verification reelle ;
- limites ;
- prochaine etape ;
- 3 questions de gestion de projet.


## Regles propres a ECCOTA-EPF

Le projet se construit en deux phases. Voir `docs/technique/ARCHITECTURE.md` section 1.

### Phase 1 — site statique Bootstrap (lots 0 a 3)

- Bootstrap 5.3 copie dans `assets/vendor/bootstrap/`. Aucun CDN, aucun npm, aucune
  bibliotheque supplementaire.
- **Chemins relatifs uniquement.** GitHub Pages sert le site depuis un sous-chemin : tout
  `href="/..."` sera casse.
- **En-tete et pied de page identiques au caractere pres sur toutes les pages.** Toute
  divergence se paiera au lot 4, quand ils seront extraits en gabarits.
- Aucune couleur ni typographie Bootstrap d'origine visible dans le rendu.
- Aucune image sans ligne dans `docs/design-ux/SOURCES_IMAGES.md`.
- Tout contenu provisoire porte `data-provisoire` et figure dans
  `docs/design-ux/CONTENUS_PROVISOIRES.md`.
- Ne jamais reprendre le logo d'une autre entreprise, meme provisoirement.
- Ne jamais inventer un chiffre presente comme un fait de l'entreprise.

### Phase 2 — dynamique PHP (lots 4 a 8)

- Cible **PHP 8.1**, meme si la machine locale est plus recente. Syntaxe 8.0 en cas de doute.
- Le lot 4 ne modifie pas le rendu : son critere d'acceptation est un test de non-regression
  HTML contre les pages de la phase 1.
- Aucune requete SQL hors des depots. Aucune sortie non echappee hors de `e()`.
- Le contrat des depots est fige par `docs/technique/MODELE_DONNEES.md` section 2.
- `app/` et `app/config.php` ne doivent jamais etre accessibles en HTTP.
- `public/uploads/` contient des donnees client sans autre copie que la sauvegarde : ne
  jamais le supprimer, le vider ni le synchroniser en mode miroir.
- Toute modification de schema passe par une migration numerotee dans `database/migrations/`.

### Dans les deux phases

- Aucun secret dans le depot.
- Un lot se termine par le rapport court decrit ci-dessus, en indiquant le niveau reel
  atteint : code, compile, teste, ou livre.
