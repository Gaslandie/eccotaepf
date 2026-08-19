# Recette client

## Informations

- Projet : ECCOTA-EPF — maquette de recette phase 1
- Version : commit `c6cb3b0` (`main`)
- URL de recette prévue : https://gaslandie.github.io/eccotaepf/
- Date : 2026-08-19
- Validateur : Mohamed, après publication effective
- Statut : publication bloquée côté GitHub Pages sur dépôt privé

## Scenarios

| ID | Scenario | Etapes | Resultat attendu | Statut |
| --- | --- | --- | --- | --- |
| R-001 | État du dépôt distant avant publication | `git ls-remote https://github.com/Gaslandie/eccotaepf.git` avant initialisation locale | Aucun contenu existant à écraser | OK — dépôt distant vide |
| R-002 | Dépôt privé | `gh repo view Gaslandie/eccotaepf --json isPrivate,defaultBranchRef` après correction de visibilité | Dépôt privé, branche `main` | OK — `isPrivate: true`, `main` |
| R-003 | Première publication Git | `git push --progress --porcelain -u origin main` | Push non forcé vers `origin/main` | OK — commit `c6cb3b0` publié |
| R-004 | Activation GitHub Pages | `gh api --method POST repos/Gaslandie/eccotaepf/pages -f source[branch]=main -f source[path]=/` | Pages actif sur `main`, racine du dépôt | Bloqué — GitHub répond `Your current plan does not support GitHub Pages for this repository.` |
| R-005 | Sitemap public | `curl -s -o /tmp/eccota_sitemap_public.txt -w "%{http_code}\n" https://gaslandie.github.io/eccotaepf/sitemap.xml` | `200`, puis toutes les URLs du sitemap en `200` | Non passant — `404 Site not found` tant que Pages n'est pas activé |
| R-006 | 404 publique | `curl -s -o /dev/null -w "%{http_code}\n" https://gaslandie.github.io/eccotaepf/inexistant` | `404` servie par le site ECCOTA-EPF | Non passant — `404 Site not found` GitHub Pages, site non publié |
| R-007 | Noindex local | Contrôle des 15 fichiers HTML et lecture de `robots.txt` | 15 pages avec `<meta name="robots" content="noindex">`, `Disallow: /` | OK local — 15/15, `robots.txt` conforme |
| R-008 | Domaine et liens locaux | `node scripts/verifier-domaine.js && node scripts/verifier-liens.js` | Domaine unique et liens internes valides | OK local |
| R-009 | Téléphone réel, tablette et ordinateur | Parcours sur Chrome et Firefox depuis l'URL publique | Les 15 pages s'affichent sans ressource cassée | Non réalisé — impossible sans site Pages en ligne |
| R-010 | Liens `tel:` et WhatsApp sur téléphone | Ouverture depuis téléphone réel | Les applications téléphone/WhatsApp s'ouvrent | Non réalisé — impossible sans recette en ligne accessible |

## Captures

Aucune capture de recette en ligne n'a été produite : GitHub Pages n'a pas pu être activé
sur le dépôt privé avec le plan GitHub actuel. Les captures devront être ajoutées après
déblocage de l'hébergement de recette.

## Retours

| ID | Retour | Priorite | Decision | Statut |
| --- | --- | --- | --- | --- |
| B-001 | GitHub Pages refuse l'activation sur le dépôt privé avec le plan actuel | Bloquant | Choisir entre un plan GitHub compatible Pages privées, une recette temporairement publique en `noindex`, ou un autre hébergement de recette privé | À décider |

## Validation

- Accepte : non
- Accepte avec reserves : non
- Refuse : non
- Commentaire : le site est poussé sur le dépôt GitHub privé, mais il n'est pas en ligne.
  Le jalon lot 3 reste bloqué tant que GitHub Pages ne peut pas être activé ou qu'une option
  de publication de recette équivalente n'est pas validée.
