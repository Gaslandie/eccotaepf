# Tâche — Lot 7 : mise en ligne, recette, formation

Références : `docs/livraison-maintenance/`, `ARCHITECTURE.md` section 10.
Dépend de : tous les lots précédents.

## Objectif

Mettre le site en production, le faire valider par ECCOTA-EPF, et rendre le client autonome.
Le projet n'est pas terminé quand le code fonctionne : il est terminé quand le client sait
s'en servir.

## Périmètre inclus

### Infrastructure

1. Choix et achat du **nom de domaine**, avec accompagnement du client — question ouverte
   n° 1 de `PROJECT_CONTEXT.md`.
2. Achat de l'hébergement mutualisé, après vérification des prérequis de
   `docs/technique/ENVIRONNEMENTS.md`. À déclencher **dès le début de la phase 2**, pas à ce
   lot : la recette de la phase 1 vit sur GitHub Pages, mais la phase 2 exige un serveur PHP
   dès le lot 4.
3. **Bascule de `SITE_URL`** vers le domaine définitif, dans `scripts/config.js`, suivie
   d'une régénération complète. Un seul endroit à modifier — c'est l'objet du correctif du
   2026-08-19. Puis `node scripts/verifier-domaine.js`, qui doit passer : il échoue s'il
   subsiste une URL pointant vers l'ancien hôte, notamment dans un canonical ou un `@id` de
   JSON-LD. Un canonical resté sur le site de recette pointerait vers une page en `noindex`.
4. Certificat HTTPS et redirection HTTP → HTTPS.
5. Document root pointé sur `public/`, et vérification que `app/` ne répond pas.
   Le site est servi **à la racine du domaine**, pas dans un sous-chemin : la contrainte de
   sous-chemin ne venait que de GitHub Pages. Les chemins relatifs restent valides tels
   quels, il n'y a rien à reprendre.
6. Base MySQL et utilisateur dédiés, `config.php` déposé hors dépôt.
7. Boîtes e-mail professionnelles sur le domaine, avec **SPF et DKIM** configurés.
8. Déploiement par FTPS depuis GitHub Actions, **excluant `app/config.php` et
   `public/uploads/`**. Les deux exclusions sont vérifiées avant le premier déploiement réel.
9. Tâche cron de sauvegarde hebdomadaire.

### Recette et livraison

9. Remplissage de `docs/livraison-maintenance/RECETTE_CLIENT.md` : scénarios testés,
   résultats, captures.
10. Recette avec le client sur le lien de recette, corrections, puis bascule en production.
    Retrait du `noindex` et du `Disallow: /` posés au lot 3.
11. Soumission du sitemap à Google Search Console et demande d'indexation.
12. Remplissage de `LIVRAISON_PRODUCTION.md` : version livrée, procédure de retour arrière,
    contacts, accès remis au client.

### Autonomie du client

13. **`ADMINISTRATION.md`** : guide d'administration rédigé pour le client, pas pour un
    développeur. Comment ajouter une réalisation, envoyer des photos, publier, dépublier,
    modifier les coordonnées, relever les messages. Avec captures.
14. **Formation** : une séance avec la personne qui gérera le site, en lui faisant faire les
    manipulations elle-même — pas une démonstration.
15. Remise des accès : administration, hébergement, domaine, boîtes e-mail. Consignés dans
    un document remis en main propre, **jamais dans le dépôt**.
16. Assistance technique 1 mois, avec un canal et un délai de réponse annoncés.

## Contraintes

- Aucun identifiant, aucun mot de passe, aucune clé FTP dans le dépôt Git, à aucun moment.
- Le site de recette doit être dépublié ou reprotégé après la mise en production, GitHub
  Pages compris : deux versions du site indexées se feraient concurrence.
- **`docs/design-ux/CONTENUS_PROVISOIRES.md` doit être vide.** Aucune image d'illustration ni
  aucun texte provisoire ne part en production. C'est bloquant.
- Les mentions légales doivent nommer l'hébergeur réel.
- Le premier déploiement se fait avec une sauvegarde préalable, même si la base est vide.

## Critères d'acceptation

1. Le site répond en HTTPS sur le domaine définitif, sans avertissement de certificat.
2. `http://` et la variante `www` redirigent vers l'URL canonique en 301.
3. Un déploiement ne supprime ni `config.php` ni les photos ajoutées par le client — vérifié
   en envoyant une photo depuis l'administration **puis** en redéployant.
4. Un message envoyé depuis le formulaire arrive dans la boîte du client et n'est pas classé
   en spam.
5. Le client réalise seul, devant nous : ajouter une réalisation avec photos, la publier, la
   modifier, la supprimer.
6. `ADMINISTRATION.md` est remis et le client l'a ouvert au moins une fois pendant la
   formation.
7. Le sitemap est soumis et au moins une page est indexée.
8. La sauvegarde automatique a produit au moins une archive.
9. `CONTENUS_PROVISOIRES.md` est vide, et **l'attribut `data-mode="recette"` a disparu** de
   toutes les pages : plus aucun marqueur ni contenu provisoire en ligne.

```bash
node scripts/verifier-domaine.js        # aucun reste de l'URL de recette
grep -rn 'data-mode' . --include="*.php" --include="*.html" && echo ECHEC || echo OK
```

## Vérification attendue

```bash
# HTTPS et redirections
curl -sI http://<domaine>/ | head -1            # 301
curl -sI https://www.<domaine>/ | head -1       # 301 vers l'URL canonique
curl -sI https://<domaine>/ | head -1           # 200

# Le déploiement ne détruit rien
# 1. envoyer une photo depuis /admin  2. déclencher le déploiement  3. recharger la page
curl -s https://<domaine>/realisations/<slug> | grep -c "uploads/"

# app/ inaccessible
curl -s -o /dev/null -w "%{http_code}\n" https://<domaine>/app/config.php   # 403 ou 404

# SPF et DKIM
dig +short TXT <domaine> | grep spf
```

## Rapport de fin attendu

Comme `AGENTS.md`, avec : URL de production, date de mise en ligne, version livrée,
procédure de retour arrière, liste des accès remis, date de la formation, et date de fin de
l'assistance gratuite.
