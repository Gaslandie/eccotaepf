# Environnements

| Environnement | URL / cible | Usage | Données | Responsable |
| --- | --- | --- | --- | --- |
| Local | `php -S localhost:8000 -t public` + MySQL local | Développement | Fixtures puis jeu de test | GassTech |
| Recette | Sous-domaine du domaine définitif, protégé par mot de passe HTTP, `noindex` | Validation client | Contenus réels en cours de saisie | GassTech |
| Production | Domaine définitif — **arrêté après le feu vert client du lot 3** | Public | Réelles | ECCOTA-EPF |

L'environnement de recette vit sur le même hébergement mutualisé que la production, dans un
sous-domaine séparé avec sa propre base. C'est la solution la moins chère qui permette de
montrer un site PHP au client, GitHub Pages n'exécutant pas PHP.

Il est protégé par mot de passe HTTP et par `noindex` : un site de recette indexé par Google
crée du contenu dupliqué et peut se retrouver devant la production dans les résultats.

## Variables

Il n'y a pas de `.env` : la configuration vit dans `app/config.php`, hors dépôt Git. Le
fichier `app/config.example.php` en donne la structure, sans aucune valeur secrète.

| Clé | Rôle | Obligatoire | Exemple non secret |
| --- | --- | --- | --- |
| `SITE_URL` / `BASE_URL` | URL absolue du site, sans barre finale. **Une seule constante** : le domaine n'étant pas arrêté, elle changera au moins une fois | oui | `https://<domaine-a-definir>` |
| `ENVIRONNEMENT` | `local`, `recette` ou `production` | oui | `production` |
| `DB_HOST` | Hôte MySQL | oui | `localhost` |
| `DB_NAME` | Nom complet donné par cPanel | oui | `eccota_site` |
| `DB_USER` | Utilisateur dédié au site | oui | `eccota_app` |
| `DB_PASS` | Mot de passe | oui | — |
| `MAIL_FROM` | Expéditeur des mails, **sur le domaine** | oui | `contact@<domaine-a-definir>` |
| `MAIL_DEST` | Destinataire des messages de contact | oui | `direction@<domaine-a-definir>` |
| `SEL_HACHAGE` | Sel du hachage des IP | oui | chaîne aléatoire de 64 caractères |
| `AFFICHER_ERREURS` | `true` en local seulement | oui | `false` |

## Prérequis hébergement

À vérifier auprès de l'hébergeur **avant l'achat**, au lot 7 :

- PHP 8.1 ou plus, avec `pdo_mysql`, `gd`, `fileinfo`, `mbstring`, `openssl` ;
- possibilité de faire pointer le document root sur un sous-dossier (`public/`) ;
- `.htaccess` et `mod_rewrite` actifs ;
- certificat HTTPS inclus, avec redirection HTTP → HTTPS ;
- au moins une base MySQL et un compte FTP dédiés ;
- comptes e-mail sur le domaine, avec SPF et DKIM configurables ;
- sauvegardes automatiques, ou possibilité de tâches planifiées pour les faire nous-mêmes.

Un hébergeur qui ne permet pas de déplacer le document root reste utilisable — repli décrit
dans `ARCHITECTURE.md`, section 2 — mais c'est un point à trancher avant de payer.
