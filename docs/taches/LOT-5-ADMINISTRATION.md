# Tâche — Lot 3 : espace d'administration

Références : `ARCHITECTURE.md` sections 3, 6 et 7, `MODELE_DONNEES.md`.
Dépend de : lot 4 terminé.

## Objectif

Livrer l'espace d'administration qui justifie à lui seul le choix technique du projet :
ECCOTA-EPF doit pouvoir ajouter une réalisation avec ses photos, la modifier et la
supprimer, sans nous appeler.

C'est le lot le plus long et le plus sensible. Il touche l'authentification, l'envoi de
fichiers et la suppression de données : les trois endroits où une erreur coûte cher.

## Périmètre inclus

### Authentification

1. `/admin/connexion` : e-mail et mot de passe, jeton CSRF, message d'erreur **identique**
   que l'e-mail existe ou non.
2. `password_verify()`, réhachage automatique si l'algorithme par défaut a changé.
3. Session régénérée à la connexion, expiration après 30 minutes d'inactivité, déconnexion
   détruisant la session côté serveur.
4. Toute route `/admin/*` sauf la connexion exige une session valide, vérifiée en un seul
   endroit — pas de contrôle recopié dans chaque contrôleur.
5. Enregistrement des tentatives dans `tentatives_connexion` et de l'événement dans
   `journal_admin`. Le blocage progressif est le lot 7 ; ce lot pose la trace.

### Gestion des contenus

6. **Réalisations** : liste avec recherche, filtre par domaine et par statut, pagination ;
   création, modification, suppression avec confirmation explicite ; brouillon et publié ;
   mise en avant ; réordonnancement.
7. **Photos** : envoi multiple, texte alternatif **obligatoire**, choix de la photo
   principale, réordonnancement, suppression unitaire.
8. **Services**, **partenaires** : même cycle, plus `autorisation_logo` sur les partenaires
   avec avertissement affiché tant qu'elle est à 0.
9. **Contenus** et **paramètres** : formulaires d'édition groupés, sans création de clé.
10. **Profil** : nom, e-mail, changement de mot de passe avec vérification du mot de passe
    actuel.
11. **Tableau de bord** : nombre de réalisations publiées et en brouillon, messages non lus,
    contenus encore marqués `[À COMPLÉTER]`.

### Traitement des images

12. `app/core/Upload.php` et `app/core/Image.php`, conformes à `ARCHITECTURE.md` section 6 :
    contrôle du type réel par `finfo`, rotation EXIF puis suppression des métadonnées,
    ré-encodage WebP en 480 / 960 / 1600 px, nom de fichier aléatoire, original non conservé.
13. Message d'erreur clair et exploitable si le fichier est trop lourd, d'un type refusé ou
    si GD échoue. Jamais de page blanche.

## Périmètre exclu

- limitation de débit et blocage progressif — lot 7 ;
- réinitialisation de mot de passe par e-mail : **hors périmètre**, le mot de passe est
  réinitialisé par nous en cas d'oubli. Un circuit de réinitialisation mal fait est une
  porte d'entrée, et il n'est pas au cahier des charges ;
- gestion de plusieurs comptes depuis l'interface — la table le permet, l'écran n'est pas
  demandé.

## Contraintes

- **Jeton CSRF sur tous les POST**, sans exception.
- Toute suppression demande une confirmation qui nomme l'élément supprimé.
- Supprimer une réalisation supprime ses fichiers **puis** ses lignes. Si un fichier ne peut
  pas être supprimé, la suppression continue et l'orphelin est noté au journal.
- `/admin` en `noindex` et `Disallow`.
- Aucun message d'erreur technique affiché à l'utilisateur ; les détails vont au journal.
- L'administration est utilisable sur téléphone : le client ajoutera des photos depuis son
  mobile, sur un chantier.

## Critères d'acceptation

1. Créer une réalisation avec 3 photos prises au téléphone, la publier, la voir en ligne
   avec sa galerie — sans jamais toucher au code.
2. Une photo de 6 Mo mal orientée est acceptée, redressée, et sert moins de 100 Ko en 480 px.
3. Un POST sans jeton CSRF valide est rejeté sur **chaque** formulaire.
4. Se connecter avec un e-mail inexistant et avec un mauvais mot de passe donne le **même**
   message et le même temps de réponse perceptible.
5. Après 30 minutes d'inactivité, une action en administration renvoie à la connexion sans
   perte de données silencieuse.
6. Un fichier `.php` renommé en `.jpg` est refusé.
7. Un fichier déposé dans `uploads/` et appelé directement en HTTP n'est jamais exécuté.
8. Modifier le titre d'une réalisation ne change pas son URL.
9. L'administration est utilisable à 360 px de large.

## Vérification attendue

```bash
find app -name "*.php" -print0 | xargs -0 -n1 php -l

# Tous les formulaires portent un jeton CSRF
grep -rLn "csrf" app/views/admin/*form* app/views/admin/*.php | head

# Aucun POST sans vérification CSRF côté contrôleur
grep -rn "POST" app/controllers/admin/ | grep -v "Csrf::" && echo "A RELIRE" || echo OK

# Fichier piégé refusé
cp exploit.php test.jpg   # doit être refusé à l'envoi

# Exécution impossible dans uploads
echo '<?php echo "EXEC"; ?>' > public/uploads/test.php
curl -s http://localhost:8000/uploads/test.php | grep -q EXEC && echo ECHEC || echo OK
rm public/uploads/test.php
```

Et manuellement, le parcours complet du client : connexion, ajout d'une réalisation avec
photos depuis un téléphone, modification, dépublication, suppression.

## Rapport de fin attendu

Comme `AGENTS.md`. Préciser explicitement quels contrôles de sécurité sont en place et
lesquels restent au lot 7.
