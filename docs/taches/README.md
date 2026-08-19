# Tâches

Un fichier par lot. Chaque fiche suit `docs/templates/TASK.md` : objectif, périmètre inclus,
périmètre exclu, contraintes, critères d'acceptation, vérification attendue.

## Phase 1 — site statique Bootstrap

Livrable : le site public complet, validé par le client, en ligne sur GitHub Pages.

```text
Lot 0   Socle Bootstrap et thème + page d'accueil
  └─ Lot 0B  Accents, réécriture des textes, apports P0 du benchmark
       └─ Lot 1   Les 8 pages publiques restantes
            └─ Lot 2   Images et référencement            (sur contenus provisoires)
                 └─ Lot 3   Publication de la maquette et VALIDATION CLIENT

                    ═══ FEU VERT CLIENT ═══  jalon bloquant

                      └─ Lot 2B  Intégration des contenus réels
                           └─ Achat du domaine et de l'hébergement
                                └─ Phase 2
```

**Ce que nous construisons aujourd'hui est une maquette.** Elle sert à obtenir l'accord du
client sur le design, la structure et le ton. Rien de ce qu'elle contient n'est définitif :
textes, photos, coordonnées, réalisations et données administratives sont provisoires et
seront remplacés au lot 2B, après le feu vert.

Conséquences à ne pas perdre de vue :

- **le nom de domaine n'est pas encore arrêté** — il est choisi après validation, ce qui rend
  la centralisation de `SITE_URL` indispensable plutôt que confortable ;
- **aucun contenu de la maquette ne doit être pris pour un engagement** : le message qui
  accompagne le lien de recette doit le dire, puisque le site, lui, ne l'affiche pas ;
- **le lot 2B ne démarre pas avant le feu vert** : intégrer de vrais contenus dans une
  maquette qui peut encore être refondue serait du travail à refaire.

## Phase 2 — dynamique PHP

Livrable : l'autonomie du client. C'est au devis, ce n'est pas optionnel.

```text
Lot 4  Bascule PHP et base de données   (rendu identique, test de non-régression)
  ├─ Lot 5  Espace d'administration
  └─ Lot 6  Formulaire de contact serveur   (parallélisable avec le lot 5)
       └─ Lot 7  Durcissement sécurité et sauvegardes
            └─ Lot 8  Mise en ligne, recette, formation
```

Le lot 0B passe **avant** le lot 1 : l'en-tête et le pied de page qu'il fige seront recopiés
sur 9 pages, et le lot 4 exige qu'ils soient identiques au caractère près.

Le benchmark UX/UI qui l'alimente est dans `docs/design-ux/BENCHMARK_COUGNAUD_DET.md`. Ses
apports P1 sont répartis sur les lots 1 et 2.

Le lot 2B est le seul qui dépende d'une livraison client. Tous les autres lots de la phase 1
se font sur contenus provisoires : le planning ne doit jamais attendre le client pour avancer.

## Règles

- Un lot n'est pas terminé tant que ses critères d'acceptation ne passent pas.
- Le périmètre exclu d'un lot est aussi contraignant que son périmètre inclus.
- Toute amélioration non demandée introduite en cours de lot rend la vérification
  inutilisable. C'est particulièrement vrai au lot 4, dont le test compare le HTML produit
  au HTML de la phase 1.
- Chaque lot se termine par le rapport court de `AGENTS.md`, en indiquant le niveau réel
  atteint : code, compile, testé ou livré.
