# Tâche — Lot 2C : interface et animations

Références : `docs/design-ux/SYSTEME_ANIMATION.md`, `docs/design-ux/BENCHMARK_COUGNAUD_DET.md`.
Dépend de : lot 2B terminé, images distinctes en place.

## Objectif

Donner au site le niveau d'interface et de mouvement de cougnaud.com, en respectant les
contraintes du projet : aucune bibliothèque, aucune régression de performance, aucun contenu
qui dépende du mouvement.

Le site est aujourd'hui statique. Ce lot le met en mouvement **sans le rendre bavard**.

## Périmètre inclus

Tout est spécifié dans `SYSTEME_ANIMATION.md`. Ordre d'implémentation conseillé :

1. **Variables de mouvement** en CSS — durées, courbes — et la règle
   `prefers-reduced-motion` en tête de feuille, pas en fin.
2. **Apparition au défilement** (section 4) : `IntersectionObserver`, seuil 0,15, 16 px,
   cascade de 60 ms, une seule fois, **état initial posé par le script**.
3. **En-tête au défilement** (section 5) : condensation au-delà de 40 px, masquage et
   réapparition au-delà de 400 px.
4. **Mot qui tourne dans le hero** (section 3) : cinq domaines réellement exécutés, cadence
   2,8 s, réservation de largeur, pause au survol et au focus, `aria-hidden` sur l'animation
   et phrase statique pour les lecteurs d'écran.
5. **Compteurs** (section 6) : valeur finale écrite dans le HTML, le script ne fait que
   remonter jusqu'à elle.
6. **Cartes et images** (section 7) : élévation au survol, zoom d'image en `overflow: hidden`,
   même traitement sur `:focus-visible`, zoom lent du hero.
7. **Filtre des réalisations** (section 8) : sortie puis entrée en cascade, compteur mis à
   jour après la sortie.
8. **Bandeau de partenaires** (section 9) : défilement continu, pause au survol, figé si
   mouvement réduit, copie en `aria-hidden`.

## Périmètre exclu

Les sept effets listés en section 10 de `SYSTEME_ANIMATION.md`, en particulier le défilement
piloté par script, la parallaxe multicouche et toute bibliothèque d'animation.

Également hors périmètre : changer la palette, les polices, la structure des pages ou les
contenus. Ce lot ajoute une couche, il ne redessine rien.

## Contraintes

- `transform` et `opacity` uniquement en animation.
- Aucune bibliothèque. Budget : **moins de 4 Ko de JavaScript** ajoutés.
- Sans JavaScript, **tout le contenu reste visible et à sa place**. C'est le piège n° 1 de ce
  lot : un état initial `opacity: 0` posé en CSS laisse la page blanche quand le script
  échoue.
- `prefers-reduced-motion: reduce` désactive tout mouvement, sans rien masquer.
- Aucune animation sur le contenu du premier écran, hors rotation du mot et zoom du hero.
- L'en-tête et le pied de page conservent leur empreinte unique : les classes d'état sont
  posées sur `<body>`, pas dans le balisage des partials.

## Critères d'acceptation

1. **CLS < 0,05** sur l'accueil, mesuré avec le mot en rotation. C'est l'indicateur que ce lot
   met en danger.
2. Lighthouse mobile : performance ≥ 90, accessibilité ≥ 95, bonnes pratiques ≥ 95, SEO = 100
   sur l'accueil, `services.html` et une fiche de réalisation.
3. JavaScript désactivé : les 22 pages sont complètes, aucun bloc invisible, le hero affiche
   sa phrase avec son premier terme, les compteurs affichent leurs vrais chiffres.
4. `prefers-reduced-motion: reduce` : aucun mouvement, aucun contenu masqué, le bandeau de
   partenaires est figé en grille lisible.
5. Le mot du hero se met en pause au survol et à la prise de focus clavier.
6. Un lecteur d'écran lit une phrase complète et cohérente, jamais une suite de mots isolés.
7. Aucune animation ne se rejoue au second passage devant un bloc.
8. Le survol d'une carte produit le même effet que sa mise au focus clavier.
9. L'en-tête et le pied de page ont toujours **une seule empreinte** sur les 22 pages.

## Vérification attendue

```bash
node scripts/verifier-liens.js && node scripts/verifier-domaine.js
node --check assets/js/main.js
wc -c assets/js/main.js          # l'ajout doit rester sous 4 Ko

# Aucun état initial masquant posé en CSS
grep -nE "opacity:\s*0" assets/css/styles.css
# chaque occurrence doit être sous une classe posée par le script, ou sous :hover — à justifier ligne par ligne

# prefers-reduced-motion couvert
grep -c "prefers-reduced-motion" assets/css/styles.css   # au moins 1, en tête de feuille

# Les compteurs portent leur valeur réelle dans le HTML
grep -oE 'class="stat-value"[^>]*>[^<]*' index.html
```

Et en navigateur :

- Lighthouse mobile sur trois pages, en relevant **CLS séparément** ;
- JavaScript désactivé, parcours des 22 pages ;
- `prefers-reduced-motion` forcé dans les préférences de rendu, parcours de l'accueil ;
- tabulation complète sur l'accueil et sur la liste des réalisations ;
- rendu à 320, 768, 1024 et 1440 px.

## Rapport de fin attendu

Comme `AGENTS.md`, avec : le poids exact ajouté au JavaScript et au CSS, les trois scores
Lighthouse **dont le CLS**, et une capture ou une description du comportement sans
JavaScript et en mouvement réduit.
