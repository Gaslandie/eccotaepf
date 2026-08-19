# Tâche — Lot 2 : images et référencement

Références : `ARCHITECTURE.md` sections 6 et 7.
Dépend de : lot 1 terminé.

## Objectif

Rendre le site trouvable et rapide : métadonnées complètes, images optimisées et documentées,
données structurées, sitemap.

**Ce lot se fait entièrement sur les contenus provisoires.** Il ne dépend d'aucune livraison
client. L'intégration des contenus réels est le lot 2B, qui ne démarre qu'à réception des
éléments — voir `LOT-2B-CONTENUS-REELS.md`.

## Périmètre inclus

### Référencement

1. `title` et `meta description` **uniques** sur chaque page. Le `title` d'une réalisation
   nomme l'ouvrage et le lieu — c'est ainsi qu'on la cherchera.
2. `link rel="canonical"` sur toutes les pages.
3. Open Graph et Twitter Card, avec image de partage par défaut et image principale sur les
   pages de réalisation. **WhatsApp sera le premier canal de partage** : la vignette doit
   s'afficher correctement.
4. JSON-LD : `Organization` sur toutes les pages, `BreadcrumbList` sur les pages internes,
   `CreativeWork` sur chaque réalisation.
5. `scripts/generer-sitemap.js` : génère `sitemap.xml` depuis les fichiers HTML présents, en
   excluant `404.html`. Sans dépendance.
6. `robots.txt` renvoyant vers le sitemap.
7. Fil d'Ariane visible sur les pages internes, cohérent avec le JSON-LD.

### Images

8. Conversion de toutes les images en **WebP**, trois largeurs (480 / 960 / 1600), avec
   `srcset`, `sizes`, `width`, `height`, et `loading="lazy"` sauf la première image de
   l'accueil.
9. `docs/design-ux/SOURCES_IMAGES.md` complété : **une ligne par image**, avec source, URL,
   auteur, licence et date. Aucune image sans ligne.
10. Les images provisoires portent `data-provisoire` ; leur pastille « Photo d'illustration »
    n'apparaît qu'en mode recette. Mettre à jour `CONTENUS_PROVISOIRES.md` **et**
    `docs/cadrage/ELEMENTS_A_FOURNIR.md` à chaque remplacement.
11. Textes alternatifs décrivant l'ouvrage, pas le fichier : « Réhabilitation du centre de
    santé de Coyah, façade achevée », pas « photo 3 ».

### Suivi

12. `docs/design-ux/CONTENUS_PROVISOIRES.md` et `docs/cadrage/ELEMENTS_A_FOURNIR.md` tenus à
    jour et cohérents entre eux. Toute métadonnée provisoire ajoutée ici — `title`,
    `description`, image de partage — y est déclarée comme le reste.

## Périmètre exclu

- l'intégration des contenus réels — lot 2B ;
- publication en ligne — lot 3 ;
- outil d'analyse d'audience — à proposer séparément ;
- achat de liens ou publicité.

## Contraintes

- Aucune image sans ligne dans `SOURCES_IMAGES.md`. Aucune exception.
- Aucune page sans `title` ni `description`.
- Ne pas inventer de chiffre : un « 150 chantiers livrés » non vérifié se retourne contre
  l'entreprise devant un donneur d'ordre. Un chiffre non confirmé n'est pas affiché — ni en
  valeur, ni en « à compléter ».
- Les images optimisées sont commitées ; les originaux lourds ne le sont pas.

## Critères d'acceptation

1. Chaque page a un `title` unique, une `description` unique et un `canonical` correct.
2. `sitemap.xml` est un XML valide dont toutes les URLs répondent.
3. Le JSON-LD passe le validateur de données structurées sans erreur.
4. Le partage d'une page de réalisation sur WhatsApp affiche titre, description et image.
5. Aucune image de plus de 250 Ko servie à un téléphone.
6. `SOURCES_IMAGES.md` contient exactement autant de lignes que d'images dans
   `assets/img/`.
7. Lighthouse mobile sur l'accueil, `services.html` et une page de réalisation : performance
   ≥ 90, accessibilité ≥ 95, bonnes pratiques ≥ 95, SEO = 100.
8. Aucun contenu réel n'a été inventé au passage : les `title` et `description` provisoires
   restent déclarés dans `CONTENUS_PROVISOIRES.md`.

## Vérification attendue

```bash
node scripts/generer-sitemap.js
xmllint --noout sitemap.xml && echo "XML OK"

# Titres uniques
grep -h -o "<title>[^<]*</title>" $(find . -name "*.html" -not -path "./docs/*") \
  | sort | uniq -d && echo DOUBLONS || echo OK

# Toutes les pages ont une description et un canonical
for f in $(find . -name "*.html" -not -path "./docs/*" -not -name 404.html); do
  grep -q 'name="description"' "$f" || echo "MANQUE description : $f"
  grep -q 'rel="canonical"' "$f"    || echo "MANQUE canonical : $f"
done

# Autant de lignes de sources que d'images
find assets/img -type f \( -name "*.webp" -o -name "*.svg" \) | wc -l
grep -c "^|" docs/design-ux/SOURCES_IMAGES.md

# Poids des images
find assets/img -type f -size +250k -exec ls -lh {} \;   # attendu : rien
```

## Rapport de fin attendu

Comme `AGENTS.md`, avec les scores Lighthouse des trois pages testées et l'état de
`CONTENUS_PROVISOIRES.md`.
