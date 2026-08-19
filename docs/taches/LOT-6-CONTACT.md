# Tâche — Lot 4 : formulaire de contact et WhatsApp

Références : `ARCHITECTURE.md` section 7, `MODELE_DONNEES.md` table `messages_contact`.
Dépend de : lot 4. Peut être mené en parallèle du lot 5.

## Objectif

Rendre le formulaire de contact réellement fonctionnel. C'est le seul endroit du site qui
produit directement du chiffre d'affaires : une demande perdue est un marché perdu.

## Périmètre inclus

1. Traitement POST en **POST-redirect-GET** : un rafraîchissement après envoi ne renvoie pas
   le message une seconde fois.
2. Validation serveur complète, indépendante de la validation HTML : nom, e-mail, téléphone
   optionnel, sujet, message. Longueurs minimales et maximales. En cas d'erreur, la page est
   réaffichée **avec les valeurs saisies conservées** et les messages d'erreur au bon champ.
3. Jeton CSRF.
4. Anti-spam sans service externe : champ leurre masqué en CSS, et contrôle de la durée de
   remplissage — un envoi en moins de 3 secondes est rejeté silencieusement.
5. **Enregistrement en base avant la tentative d'envoi**, puis mise à jour de `envoi_mail`
   selon le résultat.
6. Envoi du courriel : `From` = adresse du domaine, visiteur en **`Reply-To` uniquement**,
   suppression de `\r` et `\n` dans tout champ repris en en-tête.
7. Message de succès explicite, avec repli WhatsApp proposé.
8. Lien WhatsApp avec message prérempli, construit depuis `parametres`.
9. Écran `/admin/messages` : liste, lecture, marquage lu et traité, suppression, et signal
   visible quand `envoi_mail = 'echec'`.

## Périmètre exclu

- notification par SMS ;
- réponse automatique au visiteur ;
- pièces jointes dans le formulaire.

## Contraintes

- **Ne jamais mettre l'adresse du visiteur en `From`** : rejet SPF/DKIM et passage en spam
  garantis.
- **Supprimer `\r` et `\n` de tout champ repris en en-tête** : sans cela, le formulaire
  devient un relais à spam ouvert.
- Un échec d'envoi ne doit **jamais** afficher une erreur au visiteur : le message est
  enregistré, donc reçu. Le problème est le nôtre, pas le sien.
- L'IP n'est stockée que hachée avec le sel du site.

## Critères d'acceptation

1. Un envoi valide enregistre une ligne en base **et** déclenche le mail.
2. Le SMTP coupé, l'envoi affiche toujours un succès au visiteur et la ligne est en base
   avec `envoi_mail = 'echec'`, visible dans l'administration.
3. Un rafraîchissement après envoi ne crée pas de doublon.
4. Une saisie invalide réaffiche le formulaire avec les valeurs conservées.
5. Un `Bcc:` injecté dans le champ nom n'apparaît dans aucun en-tête du mail produit.
6. Le champ leurre rempli fait échouer l'envoi sans message d'erreur explicite.
7. Le site sans JavaScript envoie correctement le formulaire.

## Vérification attendue

```bash
# Injection d'en-tête
curl -s -X POST http://localhost:8000/contact \
  -d "nom=Test%0ABcc:pirate@exemple.com" -d "email=a@b.com" \
  -d "sujet=Test" -d "message=Message de test suffisamment long" -d "csrf=<jeton>"
# puis inspecter le mail produit : aucun Bcc

# Double soumission
# envoyer, puis F5 : une seule ligne en base
mysql -e "SELECT COUNT(*) FROM messages_contact WHERE sujet='Test';"

# Aucun \r \n non filtré
grep -rn "mail(" app/core/Mailer.php   # vérifier le filtrage des en-têtes
```

## Rapport de fin attendu

Comme `AGENTS.md`, en précisant l'adresse d'expédition et l'adresse de réception utilisées,
et l'état de la configuration SPF/DKIM.
