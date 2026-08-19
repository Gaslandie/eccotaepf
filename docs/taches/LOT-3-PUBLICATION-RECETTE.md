# Tâche — Lot 3 : publication de la maquette et validation client

Références : `docs/livraison-maintenance/RECETTE_CLIENT.md`.
Dépend de : lot 2 terminé.

## Objectif

Mettre la maquette en ligne sur GitHub Pages et obtenir l'accord d'ECCOTA-EPF. **C'est le
jalon bloquant du projet** : rien ne continue sans ce feu vert.

Ce que le client valide ici : le design, la structure des rubriques, la manière dont ses
réalisations seront présentées, et le ton. Ce qu'il ne valide pas : les contenus, qui sont
tous provisoires et qu'il fournira ensuite.

Aucun achat de domaine ni d'hébergement n'est nécessaire à ce stade — c'est tout l'intérêt
d'ADR-002. Le domaine est choisi **après** la validation.

## Périmètre inclus

1. Dépôt GitHub **privé**, avec `.gitignore` propre et aucun secret.
2. Activation de GitHub Pages sur la branche principale, racine du dépôt.
3. Vérification que le sous-chemin `/eccotaepf/` ne casse aucune ressource — c'est le piège
   principal de cette publication.
4. `404.html` reconnu par GitHub Pages.
5. **Le site n'est pas indexable à ce stade** : `robots.txt` en `Disallow: /` et
   `<meta name="robots" content="noindex">` sur toutes les pages, retirés à la mise en
   production réelle. Un site de recette indexé crée du contenu dupliqué qui pénalisera le
   site définitif.
6. Recette interne complète avant de montrer quoi que ce soit au client : les 10 pages sur
   téléphone réel, tablette et ordinateur, sur Chrome et Firefox au minimum.
7. `docs/livraison-maintenance/RECETTE_CLIENT.md` rempli : scénarios, résultats, captures.
8. Envoi du lien au client avec une note écrite précisant :
   - qu'il s'agit d'une **maquette**, et que ce qu'il valide est le design et la structure ;
   - que **tous** les contenus sont provisoires — textes, photos, coordonnées, réalisations,
     données administratives — et seront remplacés par les siens ;
   - que les photos de chantier ne sont pas des réalisations d'ECCOTA-EPF ;
   - que l'espace d'administration n'existe pas encore et arrive en phase 2 ;
   - ce qu'on attend de lui : un accord, ou une liste de corrections.

   Le site n'affiche aucun marqueur de provisoire : c'est donc **ce message** qui porte
   toute l'information. Il est écrit, pas dit au téléphone.
9. Joindre `docs/cadrage/ELEMENTS_A_FOURNIR.md` au même envoi : le client peut commencer à
   rassembler ses éléments pendant qu'il examine la maquette. C'est du temps gagné sur le
   chemin critique.
10. Collecte des retours client, classés par priorité, dans `docs/WORKLOG.md`.
11. Corrections issues de la validation.
12. **Consigner le feu vert par écrit** — date, personne, périmètre validé — dans
    `docs/livraison-maintenance/RECETTE_CLIENT.md`. C'est ce qui autorise le lot 2B, l'achat
    du domaine et le démarrage de la phase 2.

## Périmètre exclu

- nom de domaine et hébergement mutualisé — lot 8 ;
- espace d'administration — lot 5 ;
- indexation par Google — après la mise en production réelle.

## Contraintes

- **Dire explicitement au client que l'espace d'administration n'est pas encore là.** Il
  arrive en phase 2, il est au devis, il est dû. Le laisser croire que le site est terminé
  crée une mauvaise surprise à la facturation.
- Ne pas retirer le `noindex` avant la mise en production sur le domaine définitif.
- Aucun retour client n'est traité sans être d'abord écrit dans le worklog.

## Critères d'acceptation

1. Le site répond sur son URL GitHub Pages, en HTTPS.
2. Les 10 pages s'affichent, aucune ressource cassée, y compris depuis `/realisations/`.
3. La page 404 fonctionne.
4. `robots.txt` interdit l'indexation et le `noindex` est présent sur toutes les pages.
5. `RECETTE_CLIENT.md` est rempli avec des résultats réels, pas des cases cochées d'avance.
6. Les retours client sont consignés et priorisés.
7. Le feu vert est consigné par écrit, ou la liste des corrections à faire est établie.

## Vérification attendue

```bash
# Toutes les pages du sitemap répondent en ligne
curl -s https://gaslandie.github.io/eccotaepf/sitemap.xml \
  | grep -o "<loc>[^<]*" | cut -c6- \
  | while read u; do echo -n "$u "; curl -s -o /dev/null -w "%{http_code}\n" "$u"; done

# Aucune ressource cassée depuis une page de réalisation
curl -s https://gaslandie.github.io/eccotaepf/realisations/<slug>.html \
  | grep -oE '(href|src)="[^"]+"' | grep -v "^.*http" | head -30

# 404 réelle
curl -s -o /dev/null -w "%{http_code}\n" https://gaslandie.github.io/eccotaepf/inexistant

# Noindex bien en place
curl -s https://gaslandie.github.io/eccotaepf/ | grep noindex
curl -s https://gaslandie.github.io/eccotaepf/robots.txt
```

## Rapport de fin attendu

Comme `AGENTS.md`, avec l'URL de recette, la date d'envoi au client, et la liste priorisée
des retours reçus.
