# Tâche — Lot 0 : socle Bootstrap et thème

Références : `docs/technique/ARCHITECTURE.md` sections 2 à 4, `ADR-002`.
Dépend de : rien. Premier lot.

## Objectif

Poser l'ossature du site statique : arborescence, Bootstrap copié dans le dépôt, thème
personnalisé, en-tête et pied de page définitifs, et **la page d'accueil complète** comme
preuve que le thème tient.

À la fin de ce lot, on doit pouvoir montrer l'accueil et dire si la direction visuelle est
la bonne. C'est le lot qui décide de l'apparence du site.

## Périmètre inclus

1. Arborescence de `ARCHITECTURE.md` section 3, dossiers vides compris avec `.gitkeep`.
2. **Bootstrap 5.3** téléchargé depuis la distribution officielle et copié dans
   `assets/vendor/bootstrap/` : `bootstrap.min.css` et `bootstrap.bundle.min.js` uniquement.
   Noter la version exacte dans le `README.md`. Aucun CDN, aucun npm.
3. `assets/css/styles.css` : le thème, par redéfinition des variables CSS de Bootstrap —
   couleurs, typographie, rayons, ombres, échelle d'espacement. Suivre les 7 règles de
   `ARCHITECTURE.md` section 4.
4. Polices en `woff2` dans `assets/fonts/`, avec `font-display: swap`. Une police de titre,
   une police de texte.
5. **Logotype provisoire** en SVG : typographique, sobre, deux versions (fond clair, fond
   foncé) plus un favicon. Ne pas reprendre le logo d'une autre entreprise.
6. **En-tête** : logo, navigation, bouton d'appel à l'action, menu mobile en `offcanvas`,
   `aria-current` sur l'entrée active, lien d'évitement.
7. **Pied de page** : coordonnées, domaines d'intervention, liens légaux, WhatsApp.
   Identique sur toutes les pages, sans variante.
8. **Bouton WhatsApp flottant**, fonctionnel dès maintenant, cible tactile de 44 px.
9. **`index.html` complet** : section d'ouverture, domaines d'intervention, réalisations
   mises en avant, chiffres clés, bandeau partenaires, appel au contact.
10. `assets/js/main.js` : menu mobile, année automatique du pied de page, et rien d'autre à
    ce stade.
11. `scripts/verifier-liens.js` : contrôle que tous les `href` et `src` locaux pointent vers
    un fichier existant, sur tous les fichiers HTML. Sans dépendance, en Node pur.
12. `404.html` reprenant l'en-tête et le pied de page.

## Périmètre exclu

- les autres pages — lot 1 ;
- les contenus définitifs, le sourçage des images, le SEO fin — lot 2 ;
- la publication GitHub Pages — lot 3 ;
- tout ce qui touche à PHP, à une base de données ou à l'administration — phase 2.

## Contraintes

- **Aucune couleur Bootstrap d'origine visible.** Le bleu `#0d6efd` ne doit apparaître nulle
  part dans le rendu.
- Aucune police système par défaut.
- Aucune bibliothèque en plus de Bootstrap : ni jQuery, ni AOS, ni jeu d'icônes complet. Les
  icônes sont copiées une par une en SVG en ligne.
- **Chemins relatifs uniquement.** Aucun `href="/…"` ni `src="/…"`.
- Mobile d'abord : le rendu est validé à 320 px avant d'être regardé sur ordinateur.
- Toute image utilisée est enregistrée dans `docs/design-ux/SOURCES_IMAGES.md` et marquée
  dans `docs/design-ux/CONTENUS_PROVISOIRES.md`.

## Critères d'acceptation

1. `index.html` et `404.html` s'affichent correctement de 320 px à 1920 px, sans débordement
   horizontal.
2. Le site ne ressemble pas à un gabarit Bootstrap : palette, typographie et composants sont
   personnalisés.
3. `scripts/verifier-liens.js` ne signale aucun lien cassé.
4. Aucune requête réseau vers un domaine externe au chargement de l'accueil.
5. JavaScript désactivé : la page reste lisible et la navigation reste utilisable.
6. Navigation clavier complète, focus visible, lien d'évitement fonctionnel.
7. `index.html` pèse moins de 250 Ko hors images, Bootstrap compris.

## Vérification attendue

```bash
node scripts/verifier-liens.js
node --check assets/js/main.js

# Aucun appel distant
grep -rnE "https?://(cdn|unpkg|cdnjs|fonts\.googleapis|maxcdn)" *.html assets/ \
  && echo ECHEC || echo OK

# Aucun chemin absolu
grep -rnE '(href|src)="/' *.html realisations/ && echo ECHEC || echo OK

# Aucune couleur Bootstrap d'origine
grep -rni "0d6efd\|6c757d" assets/css/styles.css *.html && echo "A JUSTIFIER" || echo OK

# Poids
python3 -m http.server 4173 & sleep 1
curl -s http://localhost:4173/index.html | wc -c
```

Et manuellement : rendu à 320, 768 et 1440 px ; tabulation complète sur l'accueil ; ouverture
et fermeture du menu mobile au clavier.

## Rapport de fin attendu

Conformément à `AGENTS.md` : résumé, fichiers touchés, commandes lancées, vérification
réelle, limites, prochaine étape, 3 questions de gestion de projet. Joindre des captures
mobile et bureau de l'accueil, et indiquer le niveau atteint.
