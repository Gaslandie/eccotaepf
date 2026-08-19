# Checklist securite et confidentialite

## Secrets

- Aucun `.env` reel dans Git.
- Aucun token, mot de passe, cle API ou keystore dans le depot.
- `.env.example` existe si des variables sont necessaires.

## Donnees

- Pas de logs avec donnees personnelles.
- Les donnees sensibles sont masquees quand possible.
- Les suppressions sont confirmees ou recuperables si le risque est fort.
- Les migrations de donnees sont sauvegardees et testees.

## Web

- Formulaires proteges contre les entrees invalides.
- Erreurs serveur non exposees brutes a l'utilisateur.
- Headers / configuration d'hebergement verifies si applicable.

## Mobile

- Stockage local justifie.
- Donnees sensibles chiffrees ou evitees.
- Sauvegarde/restauration pensee avant changement de schema.

