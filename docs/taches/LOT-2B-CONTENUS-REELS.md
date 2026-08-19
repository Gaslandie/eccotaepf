# Tâche — Lot 2B : intégration des contenus réels

Références : `docs/cadrage/ELEMENTS_A_FOURNIR.md`, `docs/design-ux/CONTENUS_PROVISOIRES.md`.
Dépend de : **le feu vert du client au lot 3**, puis de la réception effective des éléments.

Ne pas démarrer avant la validation de la maquette : intégrer de vrais contenus dans une
maquette qui peut encore être refondue serait du travail à refaire.

## Objectif

Remplacer les contenus de démonstration par ceux d'ECCOTA-EPF. C'est le lot qui transforme
une maquette convaincante en site publiable.

**Ce lot ne démarre pas tant que les éléments ne sont pas arrivés.** Il peut se faire par
vagues, dans l'ordre où le client livre — c'est même le mode normal.

## Périmètre inclus

1. **Logo officiel** en remplacement du logotype provisoire, dans les deux versions et le
   favicon. Ajuster la palette si le logo l'impose.
2. **Coordonnées réelles** : téléphone, WhatsApp, e-mail, horaires, adresse. Vérifier que
   chaque `tel:` et chaque lien WhatsApp fonctionne.
3. **Réalisations réelles** en remplacement des 6 fiches de démonstration : intitulé, domaine,
   localisation, période, description, photos, maître d'ouvrage si autorisé, chiffre clé et
   témoignage si fournis.
4. **Photos d'ECCOTA-EPF** en remplacement des images libres, aux trois largeurs WebP, avec
   textes alternatifs décrivant l'ouvrage.
5. **Pièces administratives** : RCCM, NIF, attestations, agréments. La section conformité,
   masquée jusqu'ici, est alors rendue — en traitement ocre pleine largeur.
6. **Chiffres vérifiés** dans le bloc repères, uniquement ceux que le client confirme.
7. **Zone d'intervention** : régions et villes réellement couvertes.
8. **Partenaires** : noms, et logos uniquement pour ceux dont l'autorisation écrite est
   reçue — colonne `autorisation_logo` du modèle de données.
9. **Textes institutionnels** : historique, vision, valeurs, direction.
10. **Pages légales** : RCCM, NIF, siège, directeur de publication, hébergeur réel.
11. Mise à jour de `CONTENUS_PROVISOIRES.md`, `ELEMENTS_A_FOURNIR.md` et `SOURCES_IMAGES.md`
    à chaque remplacement.

## Périmètre exclu

- toute refonte visuelle : le design est validé, on remplit ;
- toute création de contenu à la place du client. Si une information manque, elle **reste**
  provisoire et suivie ; on ne comble pas un trou en inventant.

## Contraintes

- **Les slugs de démonstration doivent être renommés ici**, pour correspondre aux vraies
  réalisations. C'est le bon moment et le dernier : la publication du lot 3 est en `noindex` et
  ne circule qu'auprès du client, mais après la mise en ligne du lot 8 un slug est figé et tout
  changement exige une redirection 301.
  Nommer d'après le chantier réel : ouvrage, puis ville. `construction-ecole-primaire-kindia`,
  pas `realisation-3`.
- Aucun chiffre non confirmé par écrit.
- Aucun logo de partenaire sans autorisation écrite.
- Un bloc dont le contenu réel manque encore reste masqué, il ne redevient pas une étiquette.

## Critères d'acceptation

1. Chaque élément livré par le client est intégré et retiré de `CONTENUS_PROVISOIRES.md`.
2. `SOURCES_IMAGES.md` distingue les images remplacées des images encore provisoires.
3. Aucune image libre ne subsiste sur une page de réalisation présentée comme un chantier
   d'ECCOTA-EPF.
4. Les liens `tel:` et WhatsApp pointent vers les numéros réels et fonctionnent sur mobile.
5. Les pages légales nomment l'éditeur, le directeur de publication et l'hébergeur réel.
6. Aucune régression : liens, accents, empreintes d'en-tête et de pied de page, 320 px.

## Vérification attendue

```bash
node scripts/verifier-liens.js
node scripts/generer-sitemap.js && xmllint --noout sitemap.xml

# Ce qu'il reste de provisoire
grep -rc "data-provisoire" *.html realisations/*.html
grep -c "À remplacer\|À compléter\|À confirmer" docs/design-ux/CONTENUS_PROVISOIRES.md

# Coordonnées réelles en place
grep -oE 'href="tel:[^"]*"' *.html | sort -u
grep -oE 'https://wa\.me/[0-9]+' *.html | sort -u
```

## Rapport de fin attendu

Comme `AGENTS.md`, avec la liste de ce qui a été intégré et de ce qui reste attendu du client.
