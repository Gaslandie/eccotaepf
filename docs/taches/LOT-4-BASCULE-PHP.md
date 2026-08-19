# Tâche — Lot 4 : bascule PHP et base de données

Références : `ADR-001`, `ADR-002`, `MODELE_DONNEES.md`, `ENVIRONNEMENTS.md`.
Dépend de : lot 3 terminé et site validé par le client. **Début de la phase 2.**

## Objectif

Transformer les pages HTML statiques en gabarits PHP alimentés par MySQL, **sans modifier le
rendu d'un seul pixel**. C'est une migration mécanique : elle déplace du code, elle n'en
change pas le résultat.

C'est le lot qui rend l'espace d'administration possible. Sans lui, il n'y a rien à
administrer.

## Périmètre inclus

1. Arborescence serveur : `public/` en document root, `app/` hors HTTP, `database/`.
   Détail dans `ADR-001` et dans la version phase 2 de l'architecture.
2. `app/config.example.php` avec les clés de `ENVIRONNEMENTS.md`. `config.php` hors dépôt.
3. `app/core/` : `Database.php` (PDO préparé, `utf8mb4`, exceptions), `Http.php`,
   `Validation.php`, plus le routeur et `helpers.php` — dont `e()`, `url()`, `asset()`.
4. **Extraction des parties dupliquées** en partials : `head.php`, `header.php`,
   `footer.php`, `fil-ariane.php`, `carte-realisation.php`, `carte-service.php`.
   `header.php` prend la **page courante en paramètre**, pour poser `aria-current="page"` et
   la classe d'état sur la bonne entrée. C'est la seule partie de l'en-tête qui varie d'une
   page à l'autre, et le test de non-régression doit la retrouver à l'identique.
5. Conversion des 10 pages en `app/views/pages/*.php` : le contenu principal uniquement.
6. `database/schema.sql` : les **9 tables** de `MODELE_DONNEES.md`, rejouable.
7. `app/repositories/*` : implémentation exacte du contrat de `MODELE_DONNEES.md` section 2,
   en PDO préparé.
8. `database/seed.sql` : les 7 services, les clés de `contenus` et `parametres`. **Aucune
   réalisation d'exemple.** Reprise des réalisations réelles validées au lot 3.
9. `scripts/creer-admin.php` : création du compte administrateur, refus si un compte existe.
10. Filtre des réalisations et pagination **côté serveur**, par paramètre d'URL. Le
    JavaScript du lot 1 ne fait plus qu'éviter le rechargement.
11. `sitemap.xml` généré depuis la base.
12. `.htaccess` : réécriture vers `index.php`, HTTPS, blocage de `app/` et `database/`.

## Périmètre exclu

- l'administration — lot 5 ;
- le formulaire serveur — lot 6 ;
- le durcissement sécurité — lot 7 ;
- **toute amélioration visuelle, de contenu ou d'accessibilité.** Toute amélioration
  introduite ici rend le test de non-régression inutilisable, et c'est lui qui garantit
  qu'aucun acquis de la phase 1 n'est perdu.

## Contraintes

- PHP **8.1**. Aucune dépendance, aucun Composer, aucun framework.
- Requêtes préparées uniquement. Aucune variable concaténée dans une requête, y compris pour
  un `ORDER BY` — liste blanche de colonnes.
- Toute sortie passe par `e()`.
- Les URLs publiques restent **exactement** celles de la phase 1 : `/realisations/<slug>`,
  et non `/realisations/<slug>.html`. Prévoir la redirection 301 des anciennes.
- `assets/` n'est pas touché : ni `styles.css`, ni `main.js`, ni les images.

## Critères d'acceptation — non négociable

**Le HTML généré doit être identique au HTML statique, aux espaces près, sur les 10 pages.**

```bash
php -S localhost:8000 -t public &
for p in index a-propos services partenaires contact mentions-legales confidentialite; do
  a=$(tr -s ' \n\t' ' ' < "statique/${p}.html"        | sed 's/> </></g')
  b=$(curl -s "http://localhost:8000/${p}" | tr -s ' \n\t' ' ' | sed 's/> </></g')
  if [ "$a" = "$b" ]; then echo "OK   ${p}"; else echo "DIFF ${p}"; fi
done
```

Tant que ce test ne passe pas sur les 10 pages, le lot n'est pas terminé. Les fichiers
statiques d'origine sont conservés dans `statique/` pendant ce lot : ils servent de référence
et maintiennent le lien de recette client en ligne.

Autres critères :

1. `git diff --stat assets/` est vide.
2. Les 9 tables existent, `schema.sql` se rejoue deux fois sans erreur.
3. Une réalisation en `brouillon` renvoie une 404 en accès direct.
4. Supprimer un service ne fait disparaître aucune réalisation.
5. `scripts/creer-admin.php` refuse sa seconde exécution.
6. Aucun fichier de `app/` n'est accessible en HTTP.

## Rapport de fin attendu

Comme `AGENTS.md`, avec le résultat du test de non-régression sur les 10 pages.
