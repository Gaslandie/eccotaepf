# Tâche — Lot 6 : durcissement, sauvegardes et journalisation

Références : `ARCHITECTURE.md` section 7, `docs/qualite-securite/`.
Dépend de : lots 5 et 6 terminés.

## Objectif

Fermer ce qui reste ouvert. Sans framework, aucune protection n'existe par défaut : c'est ce
lot qui la crée. Il n'est pas optionnel et ne se négocie pas contre du délai.

## Périmètre inclus

1. **Blocage progressif de la connexion** depuis `tentatives_connexion` : au-delà de 5
   échecs pour un même compte ou une même IP en 15 minutes, délai croissant puis blocage
   temporaire. Message identique dans tous les cas.
2. **Limitation du formulaire de contact** : au plus 3 envois par IP hachée et par heure.
3. **En-têtes de sécurité** dans `public/.htaccess` :
   `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimale, et une
   **CSP sans `unsafe-inline`** — ce qui suppose de sortir tout script et tout style en ligne
   des vues.
4. **Cookies de session** : `httponly`, `secure`, `samesite=Lax`, nom personnalisé.
5. **Journal applicatif** hors document root, avec rotation. `display_errors=Off` et
   `log_errors=On` en production.
6. **Purge automatique** : `tentatives_connexion` au-delà de 24 h, messages traités au-delà
   de 24 mois — annoncé dans la politique de confidentialité.
7. **Sauvegardes** : script `scripts/sauvegarde.sh` produisant un `mysqldump` compressé et
   une archive de `public/uploads/`, planifié par tâche cron hebdomadaire chez l'hébergeur,
   avec conservation des 8 dernières.
8. **Restauration testée une fois**, sur la base de recette, et la procédure écrite dans
   `docs/livraison-maintenance/LIVRAISON_PRODUCTION.md`.
9. **Revue complète** des deux checklists de `docs/qualite-securite/`, chaque ligne
   explicitement cochée ou justifiée.
10. Vérification que `app/`, `database/`, `docs/` et `scripts/` ne répondent pas en HTTP.

## Périmètre exclu

- pare-feu applicatif payant, service anti-DDoS ;
- authentification à deux facteurs — à proposer si le client la souhaite ;
- audit de sécurité par un tiers.

## Contraintes

- Une CSP qui casse le site est pire qu'une CSP absente : elle sera désactivée en urgence et
  jamais remise. Sortir les scripts en ligne **avant** de l'activer.
- La sauvegarde ne doit jamais écrire dans un dossier servi en HTTP.
- Une sauvegarde jamais restaurée n'est pas une sauvegarde : le point 8 n'est pas facultatif.

## Critères d'acceptation

1. 6 tentatives de connexion échouées déclenchent le blocage temporaire ; le compte
   redevient utilisable après le délai.
2. La CSP est active et **aucune erreur de console** n'apparaît sur les 11 pages ni dans
   l'administration.
3. `curl` sur `/app/config.php`, `/database/schema.sql`, `/docs/` et `/scripts/` renvoie 403
   ou 404.
4. Aucune erreur PHP n'est affichée en production ; toutes sont dans le journal.
5. `scripts/sauvegarde.sh` produit une archive restaurable, et la restauration a été
   réellement effectuée une fois.
6. Les deux checklists de `docs/qualite-securite/` sont complétées et signées dans le dépôt.

## Vérification attendue

```bash
# Rien de sensible accessible
for u in /app/config.php /app/ /database/schema.sql /docs/ /scripts/sauvegarde.sh /.git/config; do
  echo -n "$u "; curl -s -o /dev/null -w "%{http_code}\n" "https://<domaine>$u"
done   # attendu : 403 ou 404 partout

# En-têtes présents
curl -sI https://<domaine>/ | grep -iE "strict-transport|content-security|x-content-type|referrer"

# Blocage après échecs répétés
for i in $(seq 1 6); do
  curl -s -o /dev/null -X POST https://<domaine>/admin/connexion \
    -d "email=admin@exemple.com&mot_de_passe=faux&csrf=<jeton>"
done   # le 6e doit être bloqué

# Sauvegarde et restauration
bash scripts/sauvegarde.sh
mysql -u <user> -p <base_recette> < sauvegardes/dernier.sql   # doit se rejouer
```

## Rapport de fin attendu

Comme `AGENTS.md`, avec les deux checklists complétées et le résultat du test de
restauration.
