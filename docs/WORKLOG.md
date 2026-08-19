# Worklog — ECCOTA-EPF

## En cours

| Date | Sujet | Responsable | Niveau atteint | Prochaine étape |
| --- | --- | --- | --- | --- |
| 2026-08-19 | Lot 2 — images et référencement provisoires | Codex | Testé | Lot 2B — contenus réels à réception des éléments client |

## À faire

**Phase 1 — statique Bootstrap**

- Lot 0 — Socle Bootstrap, thème, page d'accueil (`docs/taches/LOT-0-SOCLE-BOOTSTRAP.md`)
- Lot 1 — Les 8 pages publiques restantes
- Lot 2 — Contenus, images sourcées, référencement
- Lot 3 — Publication GitHub Pages et recette client

**Phase 2 — dynamique PHP**

- Lot 4 — Bascule PHP et base de données
- Lot 5 — Espace d'administration
- Lot 6 — Formulaire de contact serveur
- Lot 7 — Durcissement sécurité et sauvegardes
- Lot 8 — Mise en ligne, recette, formation

**Hors lots, à mener en parallèle**

- envoyer au client la liste écrite des contenus, photos et éléments légaux attendus ;
- récupérer le logo officiel dans le meilleur format disponible ;
- arrêter le nom de domaine ; l'hébergement mutualisé n'est nécessaire qu'au lot 4 ;
- confirmer par écrit au client que l'espace d'administration arrive en phase 2.

## Fait

- 2026-08-19 — Lecture du template Web/Mobile GassTech et des précédents `Groupe-babia`,
  `LizzireneDeco` et `IdealIP`.
- 2026-08-19 — Squelette projet généré depuis `modele-projet/`.
- 2026-08-19 — `ADR-001` : PHP 8.1 rendu serveur, sans framework, MySQL, mutualisé cPanel.
- 2026-08-19 — `ADR-002` : Bootstrap 5.3 et livraison statique en phase 1, PHP décalé en
  phase 2. Images libres et logo provisoire en attendant les éléments du client.
- 2026-08-19 — `ARCHITECTURE.md` réécrit en deux phases, `MODELE_DONNEES.md`,
  `ENVIRONNEMENTS.md`, `PROJECT_CONTEXT.md`, cahier des charges structuré,
  `SOURCES_IMAGES.md`, `CONTENUS_PROVISOIRES.md` et les 9 fiches de lots.
- 2026-08-19 — Lot 0 réalisé : arborescence statique, Bootstrap 5.3.8 local, thème,
  polices locales, logotype provisoire, accueil complet, 404, bouton WhatsApp provisoire,
  script `scripts/verifier-liens.js`, sources images et contenus provisoires documentés.
- 2026-08-19 — Lot 0B réalisé : contenu publié accentué, textes éditoriaux réécrits,
  contact direct, métadonnées des réalisations, zone d'intervention, conformité
  administrative et pied de page à quatre colonnes.

## Journal

- 2026-08-19 — **Lot 0 livré par Codex, niveau testé.** Socle Bootstrap 5.3.8 copié dans le
  dépôt, thème personnalisé (ardoise + ocre, Archivo et Source Sans 3), logotype provisoire
  SVG, images WebP en trois largeurs sourcées, `index.html` et `404.html`, bouton WhatsApp,
  `verifier-liens.js`. Vérifications réelles : liens OK, aucun CDN, aucun chemin absolu,
  aucune couleur Bootstrap d'origine, 320 px sans débordement, 62 Ko gzip hors images.
- 2026-08-19 — **Revue du lot 0.** Direction visuelle retenue. Deux défauts relevés :
  aucun accent dans le contenu publié, et des titres qui commentent l'avancement du projet au
  lieu de s'adresser au visiteur. Corrigés au lot 0B, avant le lot 1, parce que l'en-tête et
  le pied de page seront recopiés sur 9 pages.
- 2026-08-19 — **Benchmark UX/UI** de cougnaud.com et det-ingenierie.com :
  `docs/design-ux/BENCHMARK_COUGNAUD_DET.md`. Apports P0 au lot 0B, P1 aux lots 1 et 2, quatre
  champs ajoutés à la table `realisations`.
- 2026-08-19 — **Lot 0B terminé par Codex, niveau testé.** `index.html` et `404.html` corrigés
  en français accentué ; aucun texte de production dans le contenu publié. Ajouts P0 du
  benchmark intégrés sans modifier le hero, la palette ni les polices. Vérifications réelles :
  liens et JavaScript OK, 320/768/1440 px sans débordement, aucune requête externe, menu
  mobile fonctionnel, 67 Ko gzip hors images, header/menu/footer identiques au caractère près.
- 2026-08-19 — **Lot 0B livré par Codex, niveau testé, revu et validé.** Contrôle indépendant :
  199 accents sur l'accueil, aucun mot suspect dans le texte publié, en-tête et pied de page
  aux empreintes identiques entre les deux pages, palette et polices inchangées, sections
  zone d'intervention et conformité en place. Deux défauts relevés pour le lot 1 :
  débordement de `.stat-value` à 1440 px, et bande de conformité trop dominante pour un
  contenu absent.
- 2026-08-19 — **Décision : aucune mention de provisoire visible sur le site.** Règle
  « vide = masqué ». Le suivi reste interne (`data-provisoire`, `CONTENUS_PROVISOIRES.md`) et
  le blocage du lot 8 est conservé. Documents mis à jour : `ARCHITECTURE.md` section 6,
  `CONTENUS_PROVISOIRES.md`, fiches des lots 0B, 1, 2 et 8, benchmark.
- 2026-08-19 — Contrôle d'accents des fiches corrigé : il balayait le fichier entier et
  produisait de faux positifs sur les slugs. Limité au texte publié et aux attributs lisibles.
- 2026-08-19 — **Mode recette adopté**, après retour client interne. Les marqueurs de contenu
  manquant sont conservés — ils disent au client ce qu'il doit fournir, à l'endroit exact —
  mais conditionnés à `<body data-mode="recette">`. Sans l'attribut, « vide = masqué ». Aucun
  marqueur écrit en dur : l'interrupteur pilote tout. Vérifié au lot 8. Pendant client créé :
  `docs/cadrage/ELEMENTS_A_FOURNIR.md`.
- 2026-08-19 — **Décision du lot 1 : suivi provisoire invisible dans tous les modes.** La
  règle précédente de marqueurs en recette est remplacée : `data-provisoire` reste un suivi
  interne sans rendu, et tout bloc réellement vide est masqué.
- 2026-08-19 — **Lot 1 terminé par Codex, niveau testé.** Huit rubriques publiques et six
  fiches de réalisation ajoutées, avec filtres, galeries Bootstrap accessibles, formulaire
  `mailto:` et repli WhatsApp. Les 15 fichiers HTML ont été contrôlés à 320, 768, 1024 et
  1440 px ; aucun débordement, lien cassé, chargement externe ou marqueur de production
  visible. Trente captures de dix types de page sont archivées dans
  `docs/design-ux/captures/lot-1/`.
- 2026-08-19 — **Lot 1 livré et correctif validé.** 15 pages, une empreinte d'en-tête après
  neutralisation de l'état actif, une de pied de page, entrée active correcte sur chacune des
  15 pages, contrastes 5,69:1 et 14,93:1. Défaut d'origine — `aria-current` sur « Accueil »
  partout — causé par deux critères contradictoires de la fiche, depuis corrigée.
- 2026-08-19 — Lot 2 recentré sur images et référencement, réalisable sans le client. Création
  du lot 2B pour l'intégration des contenus réels, seul lot de la phase 1 qui dépende d'une
  livraison client.
- 2026-08-19 — Précision : les slugs restent renommables jusqu'au lot 8, et **doivent** être
  renommés au lot 2B d'après les chantiers réels.
- 2026-08-19 — **Lot 2 terminé par Codex, niveau testé.** Métadonnées SEO provisoires sur les
  15 pages, canonical, Open Graph, Twitter Card, JSON-LD `Organization`, fils d'Ariane,
  `BreadcrumbList`, `CreativeWork` pour les fiches de réalisation, `robots.txt` et
  `sitemap.xml` généré hors `404.html`. Images vérifiées : 27 fichiers documentés, aucun
  fichier au-dessus de 250 Ko, héros d'accueil optimisé. Lighthouse mobile via serveur local
  gzip : accueil 98/96/100/100, services 97/96/100/100, réalisation 98/96/100/100.
- 2026-08-19 — **Lot 2 livré et validé.** Titles, descriptions et canonical uniques sur les
  15 pages, JSON-LD en `@graph` avec `@id` — meilleur que la spécification —, sitemap à
  14 URLs, robots, images toutes sous 250 Ko. Lighthouse mobile 98/96/100/100.
  Réserve relevée : l'URL de base est codée en dur 174 fois dans les HTML. Correctif
  `SITE_URL` demandé avant le lot 2B.
- 2026-08-19 — **Cadrage précisé : ce qui est construit est une maquette de validation.** Le
  lot 3 devient un jalon bloquant ; le domaine, les contenus réels et la phase 2 n'arrivent
  qu'après le feu vert du client. Lot 2B déplacé après le lot 3.
- 2026-08-19 — **Correctif `SITE_URL` livré et validé.** Constante unique dans
  `scripts/config.js`, partagée par les trois scripts ; `generer-pages-lot1.js` réécrit le
  bloc SEO des 15 pages, `index.html` compris. Vérifié sur copie isolée : bascule vers un
  domaine de test → zéro reste de `github.io` ; retour à l'URL de recette → 17 fichiers
  identiques au bit près ; générateur idempotent ; `verifier-domaine.js` détecte bien un
  canonical étranger injecté. Outil repris comme critère du lot 8.
