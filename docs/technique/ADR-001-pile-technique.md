# ADR-001 — Pile technique du site ECCOTA-EPF

## Statut

Accepté — 2026-08-19. Confirmé par le client GassTech le 2026-08-19 (cPanel, PHP, français
seul, back-office d'administration des réalisations).

## Contexte

Le cahier des charges demande un site vitrine avec un espace d'administration permettant à
ECCOTA-EPF d'ajouter, modifier et supprimer des réalisations avec photos, sans intervention
technique. Le budget est de 3 000 000 GNF, le délai de 2 à 3 semaines, l'hébergement et le
domaine sont inclus dans l'offre pour la première année. L'objectif premier est la
crédibilité auprès de donneurs d'ordre et la présence sur les moteurs de recherche.

Trois voies existaient dans les projets GassTech antérieurs :

1. **HTML statique généré** (`Groupe-babia`) — publication simple, mais aucune écriture
   possible depuis une interface : incompatible avec l'espace d'administration demandé.
2. **Export statique Next.js** (`IdealIP`, `gasstech-web`) — même limite, plus une chaîne
   d'outils Node à maintenir pour un site que le client devra faire vivre des années.
3. **SPA React + API PHP** (`LizzireneDeco`) — techniquement capable, mais dimensionné pour
   une boutique avec panier et commandes. Sur une vitrine, le rendu côté navigateur dégrade
   le référencement, qui est ici l'objectif principal, pour un coût de développement
   supérieur.

## Décision

**PHP 8.1 rendu côté serveur, sans framework, sans Composer, sans aucune dépendance, avec
MySQL, sur hébergement mutualisé cPanel.**

Le HTML est produit entièrement côté serveur à chaque requête. Aucune étape de build : les
fichiers écrits sont les fichiers déployés.

## Conséquences

**Gains**

- HTML complet dès la première réponse : c'est le meilleur cas possible pour l'indexation.
- Un seul langage, une seule couche : le coût d'un espace d'administration devient
  raisonnable dans le budget.
- Fonctionne sur n'importe quel mutualisé cPanel, y compris chez un hébergeur guinéen.
- Aucune dépendance à mettre à jour, aucune chaîne d'outils à reconstituer dans trois ans.
- Reprenable par un autre prestataire sans connaissance d'un framework particulier.

**Coûts**

- Il faut écrire à la main ce qu'un framework fournirait : routage, validation, CSRF,
  authentification, envoi de fichiers. C'est un volume connu et cadré par les lots 0 et 3.
- Pas de communauté ni d'écosystème de composants : chaque brique est notre responsabilité.
- Pas de prévisualisation possible sur GitHub Pages, contrairement à Groupe-babia.
  L'hébergement doit donc être acheté dès la première semaine.

**Risques**

- Une erreur d'implémentation sur CSRF, l'envoi de fichiers ou l'authentification n'est
  rattrapée par aucun framework. Le lot 6 est consacré à cette vérification et n'est pas
  optionnel.
- Écrire en PHP 8.5 local et déployer sur un mutualisé en 8.1 casserait la mise en ligne.
  Contrainte : **viser 8.1**, syntaxe 8.0 en cas de doute.

**Alternatives refusées**

- **WordPress** : répondrait au besoin d'administration en quelques jours. Refusé pour trois
  raisons — surface d'attaque et charge de mise à jour permanente sur un site que personne
  ne surveillera après le mois d'assistance ; dépendance à des extensions tierces pour les
  réalisations ; et un poids de page difficile à ramener sous les objectifs de performance
  sur connexion mobile guinéenne. À reconsidérer si le client demande plus tard un blog et
  une édition de contenu libre.
- **Laravel ou Symfony** : qualité supérieure sur le papier, mais installation par Composer,
  document root spécifique et tâches planifiées mal supportées sur mutualisé d'entrée de
  gamme, pour un projet de 7 pages.
- **Site statique + CMS externe** (Netlify CMS, Decap) : ajoute une dépendance à un service
  tiers et un compte Git dans les mains du client. Contraire au besoin d'autonomie durable.
