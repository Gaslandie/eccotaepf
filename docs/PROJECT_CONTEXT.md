# Project Context — ECCOTA-EPF

## Produit

- **Nom** : Site web vitrine ECCOTA-EPF
- **Propriétaire** : ECCOTA-EPF, entreprise guinéenne créée le 03 novembre 2015
- **Prestataire** : GassTech Solutions
- **Secteurs du client** : BTP et construction, ouvrages de génie civil, infrastructures
  sanitaires et scolaires, rénovation et entretien, fournitures diverses, transport,
  agriculture, élevage et activités agropastorales
- **Public** : donneurs d'ordre publics et privés, institutions, bailleurs, partenaires,
  prospects et candidats fournisseurs
- **Problème** : l'entreprise a dix ans d'activité et des marchés exécutés, mais aucune
  présence en ligne permettant de le prouver. La crédibilité se joue aujourd'hui uniquement
  en rendez-vous et sur documents papier.
- **Proposition de valeur** : un site institutionnel qui rend l'expérience acquise
  vérifiable en ligne, consultable à tout moment par un donneur d'ordre, et que l'entreprise
  met à jour elle-même à chaque nouveau marché livré.

## Dépôt et environnements

- Code : https://github.com/Gaslandie/eccotaepf.git
- Recette phase 1 : https://gaslandie.github.io/eccotaepf/ (sous-chemin `/eccotaepf/`)
- Production : domaine à arrêter, question ouverte n° 1

## Cadre commercial

- Devis : 3 000 000 GNF, 50 % à la commande, 50 % à la livraison
- Émis le 14/08/2026, validité 30 jours
- Délai annoncé : 2 à 3 semaines après validation, acompte et réception des contenus
- Inclus la première année : nom de domaine, hébergement, e-mails professionnels
- Inclus : formation à l'espace d'administration, assistance technique 1 mois après mise en ligne

## Décisions

| Date | Décision | Raison | Impact |
| --- | --- | --- | --- |
| 2026-08-19 | PHP 8.1 rendu serveur, sans framework, MySQL, mutualisé cPanel | Espace d'administration obligatoire + référencement prioritaire + budget | Voir `technique/ADR-001-pile-technique.md` |
| 2026-08-19 | Bootstrap 5.3 et livraison statique en phase 1, PHP en phase 2 | Montrer le site au client en quelques jours sur GitHub Pages, sans attendre l'achat d'un hébergement | Voir `technique/ADR-002-bootstrap-statique.md` |
| 2026-08-19 | Images libres de droits et logo provisoire en attendant les éléments du client | Ne pas bloquer la production sur la fourniture des photos | `SOURCES_IMAGES.md` et `CONTENUS_PROVISOIRES.md`, mise en ligne bloquée tant que la liste n'est pas vide |
| 2026-08-19 | Le suivi provisoire est exclusivement interne ; « vide = masqué » dans tous les rendus | Le site doit se présenter comme fini à tout moment, y compris en recette | `data-provisoire` reste non visuel ; aucun marqueur ni note de production dans le HTML publié |
| 2026-08-19 | Français uniquement | Budget et délai ; le modèle de données n'interdit pas une V2 bilingue | Pas de couche de traduction |
| 2026-08-19 | Les slugs restent renommables jusqu'au lot 8, pas jusqu'au lot 3 | La publication de recette est en `noindex` et ne circule qu'auprès du client ; figer trop tôt obligerait à publier des URLs de démonstration | Renommage obligatoire au lot 2B |
| 2026-08-19 | Une page de détail par réalisation | C'est le lien envoyable dans un dossier d'appel d'offres, et le principal gain de référencement | Slug figé après création |
| 2026-08-19 | Table `utilisateurs` dès le départ, un seul compte créé | Ajouter un compte plus tard sans migration | Pas de gestion de rôles |
| 2026-08-19 | `services` sert aussi de taxonomie aux réalisations | Un seul référentiel, filtre par domaine sans table supplémentaire | `realisations.service_id` |
| 2026-08-19 | **Ce qui est construit est une maquette de validation.** Le lot 3 est un jalon bloquant : contenus réels, domaine, hébergement et phase 2 n'arrivent qu'après le feu vert | Ne pas engager de contenu réel ni d'achat sur un design qui peut encore être refondu | Lot 2B déplacé après le lot 3 ; question n° 1 repoussée après validation |
| 2026-08-19 | Benchmark Cougnaud et DET intégré : contact direct, métadonnées de cartes, zone d'intervention, conformité administrative, témoignages | Aider un donneur d'ordre à se convaincre qu'ECCOTA-EPF peut exécuter le marché | Voir `design-ux/BENCHMARK_COUGNAUD_DET.md` ; 4 champs ajoutés à `realisations` |
| 2026-08-19 | Le contenu publié est accentué ; seuls slugs, fichiers et identifiants restent sans accent | La convention sans accent du template vise les documents internes, pas le texte vu par le visiteur | Lot 0B |
| 2026-08-19 | Le lot 4 ne modifie pas le rendu | Ne perdre aucun acquis visuel de la phase 1 | Critère d'acceptation : test de non-régression HTML sur les 10 pages |
| 2026-08-19 | Les messages de contact sont enregistrés en base avant l'envoi mail | Ne jamais perdre une demande commerciale si le SMTP tombe | Table `messages_contact` + écran d'administration |
| 2026-08-19 | Lot 0 : Bootstrap figé en 5.3.8, thème bleu-gris chantier et accent ocre, polices locales Archivo et Source Sans 3 | Donner une identité BTP institutionnelle sans rendu Bootstrap par défaut | Version notée dans `README.md`, fichiers locaux dans `assets/` |
| 2026-08-19 | Lot 0B : en-tête avec téléphone et pied de page à quatre colonnes figés pour toute la phase statique | Éviter les divergences lors de leur recopie sur les pages du lot 1 et de leur extraction au lot 4 | Les blocs `header`, menu mobile et `footer` de `index.html` et `404.html` sont identiques au caractère près |
| 2026-08-19 | Lot 1 : six slugs de réalisation figés et pages statiques générées depuis une source de données locale | Aligner les fiches sur le futur modèle PHP et garantir la répétabilité des blocs partagés | `scripts/generer-pages-lot1.js` produit les pages publiques et normalise les chemins des pages imbriquées |
| 2026-08-19 | Lot 2 : métadonnées SEO provisoires sur l'URL GitHub Pages de recette | Le domaine définitif n'est pas encore arrêté et les contenus réels arrivent au lot 2B | Canonical, Open Graph, Twitter Card, JSON-LD, `robots.txt` et `sitemap.xml` devront être alignés au domaine final avant le lot 8 |

## Non-objectifs

- Pas de version anglaise dans cette version.
- Pas de boutique, de panier, de paiement ni de devis en ligne.
- Pas de compte visiteur : l'authentification ne concerne que l'administration.
- Pas de blog ni de fil d'actualités.
- Pas d'application mobile.
- Pas de framework, pas de Composer, pas de npm.

## Questions ouvertes

| # | Question | Bloque | Échéance |
| --- | --- | --- | --- |
| 1 | Nom de domaine | **Hors sujet jusqu'au feu vert.** Ne bloque rien : la maquette vit sur GitHub Pages. Le sujet s'ouvre après validation, pas avant | Après le lot 3 |
| 2 | Hébergeur mutualisé retenu | Lot 4 et suivants. Plus bloquant pour la recette : GitHub Pages la couvre | Début de phase 2 |
| 3 | Logo officiel : existe-t-il en vectoriel ou en haute définition ? | La palette du lot 0. Contourné par un logotype provisoire | Avant le lot 2 |
| 4 | Photos de chantiers disponibles, et combien par réalisation ? | Crédibilité du site. Contourné par des images libres | Avant le lot 2 |
| 5 | Liste des réalisations à publier, avec localisation et période | Lot 2 | Avant le lot 2 |
| 6 | Partenaires : accord écrit pour l'affichage des logos ? | Lot 2 | Avant le lot 2 |
| 7 | Adresse e-mail de réception des messages de contact | Lot 6 | Avant le lot 6 |
| 8 | Éléments administratifs : RCCM, NIF, attestations fiscales et sociales, agréments | Lot 0B et lot 2. **Premier filtre d'un marché public guinéen**, gros gain de crédibilité | Avant le lot 2 |
| 10 | Quatre chiffres vérifiables : années, marchés exécutés, régions couvertes, effectif | Section chiffres clés, aujourd'hui vide à dessein | Avant le lot 2 |
| 11 | Régions et villes réellement couvertes par ECCOTA-EPF | Section zone d'intervention | Avant le lot 2 |
| 12 | Une citation d'un maître d'ouvrage sur un chantier livré | Enrichit les réalisations phares, facultatif | Avant le lot 2 |
| 9 | Le client a-t-il compris que l'administration arrive en phase 2 ? | Rien techniquement, tout commercialement | Au lot 3, à l'envoi du lien de recette |

## Risques

| Risque | Probabilité | Effet | Réponse |
| --- | --- | --- | --- |
| Contenus et photos client livrés en retard | Élevée | Décale toute la livraison | Fixtures au lot 1, liste écrite de ce qui manque envoyée en semaine 1 |
| Photos de mauvaise qualité ou absentes | Moyenne | Le site perd son argument principal | Prévoir une séance photo, ou un traitement graphique de repli |
| Contenus provisoires publiés en production | Moyenne | Information fausse dans un document commercial, perte de confiance | `CONTENUS_PROVISOIRES.md` bloquant au lot 8 ; le suivi est interne, aucune mention visible ne sert plus de garde-fou |
| Phase 2 repoussée puis oubliée | Moyenne | Prestation vendue non livrée, client non autonome | Phase 2 au planning et au suivi client dès le lot 3 |
| Le client prend la maquette pour le site fini | **Élevée** | Il croit son site livré alors qu'aucun de ses contenus n'y est, et que l'administration n'existe pas | Le site n'affiche aucun marqueur : c'est le message d'accompagnement du lot 3 qui porte l'information, par écrit |
| Feu vert obtenu oralement, jamais confirmé | Moyenne | Le périmètre validé devient contestable au moment de la facturation | Feu vert consigné par écrit dans `RECETTE_CLIENT.md` : date, personne, périmètre |
| Rendu générique « gabarit Bootstrap » | Moyenne | Dévalorise une entreprise qui vend sa solidité | Règles de personnalisation, `ARCHITECTURE.md` section 4, contrôlées au lot 0 |
| Logos partenaires sans autorisation | Moyenne | Risque juridique | Colonne `autorisation_logo`, affichage texte par défaut |
| Mails de contact classés en spam | Moyenne | Demandes commerciales perdues | Expéditeur sur le domaine, SPF/DKIM, visiteur en `Reply-To` seulement, stockage en base |
| Faille sur l'espace d'administration | Faible | Grave | Lot 6 dédié, non optionnel |
