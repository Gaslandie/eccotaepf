# Système d'animation et d'interface

Décidé le 2026-08-19. Inspiration assumée : [cougnaud.com](https://www.cougnaud.com/).

Le site est jugé trop statique. Ce document définit **un vocabulaire de mouvement unique**,
pas une collection d'effets. Une page où chaque bloc s'anime différemment donne l'impression
d'un site bricolé ; une page où tout obéit à la même grammaire donne l'impression d'un site
cher.

## 1. Les cinq règles qui encadrent tout

1. **`transform` et `opacity` uniquement.** Jamais `top`, `left`, `width`, `height` ni
   `margin` en animation : ce sont les seules propriétés que le navigateur compose sans
   recalculer la mise en page. Sur un téléphone d'entrée de gamme, la différence est visible.
2. **Le contenu ne dépend jamais du mouvement.** Sans JavaScript, tout est lisible, à sa
   place, dans son état final. Une animation qui laisse un bloc invisible quand le script
   échoue est un bug, pas un effet.
3. **`prefers-reduced-motion` est respecté partout.** Un utilisateur qui l'a activé voit le
   site complet, sans transition. Ce n'est pas une option : le mouvement peut déclencher des
   troubles vestibulaires réels.
4. **Aucun décalage de mise en page.** Toute animation qui pourrait faire bouger le contenu
   autour d'elle réserve sa place à l'avance. Le mot qui tourne dans le hero est le cas
   d'école, traité en section 3.
5. **Aucune bibliothèque.** Ni GSAP, ni AOS, ni Lenis. `IntersectionObserver`, transitions
   et keyframes CSS suffisent à tout ce qui suit, pour zéro kilo-octet supplémentaire.

## 2. Le vocabulaire

Trois valeurs, déclarées en variables CSS et utilisées partout.

```css
--duree-courte:  180ms;   /* survol, focus, bascule */
--duree-moyenne: 420ms;   /* apparition d'un bloc */
--duree-longue:  700ms;   /* hero, grands mouvements */
--sortie: cubic-bezier(.16, 1, .3, 1);   /* décélération franche */
--doux:   cubic-bezier(.4, 0, .2, 1);    /* aller-retour */
```

**Distance d'apparition : 16 px, jamais plus.** Au-delà, le mouvement se remarque plus que le
contenu. Cougnaud reste discret, c'est ce qui le fait paraître solide plutôt que gadget.

## 3. Le mot qui tourne dans le hero

L'élément demandé. Chez Cougnaud, le dernier adjectif d'une phrase change tout seul.

**Adaptation retenue** : ne pas faire tourner des adjectifs, faire tourner des **preuves**.
Cougnaud fait défiler « responsable, personnalisé, singulier, innovant » — du marketing.
ECCOTA-EPF peut faire défiler ses domaines réellement exécutés, chacun adossé à un marché
livré. Même effet visuel, mais chaque mot affiché est vrai.

```text
Depuis 2015, ECCOTA-EPF construit en Guinée
  des écoles.
  des centres de santé.
  des ouvrages d'art.
  des aménagements hydro-agricoles.
  des bâtiments administratifs.
```

Mise en œuvre :

- la phrase complète et **le premier terme sont dans le HTML**, pas injectés par le script :
  c'est l'élément LCP de la page, il doit s'afficher immédiatement ;
- les termes suivants sont dans un `data-` ou des `<span>` masqués ;
- **réservation de largeur obligatoire** : le conteneur du mot prend la largeur du terme le
  plus long, sinon chaque changement décale la ligne et dégrade le CLS. Sur mobile, où la
  phrase passe sur plusieurs lignes, réserver la **hauteur** plutôt que la largeur ;
- transition : sortie `translateY(-8px)` + `opacity 0` en 180 ms, entrée `translateY(8px)` →
  0 en 420 ms ;
- cadence : **2,8 s** par terme. Plus rapide, on ne lit pas ; plus lent, on croit que c'est figé ;
- **pause au survol** et à la prise de focus clavier ;
- accessibilité : le conteneur animé est `aria-hidden="true"`, et une phrase complète et
  statique est fournie aux lecteurs d'écran. Un `aria-live` qui annonce un mot toutes les
  trois secondes rendrait la page inutilisable ;
- `prefers-reduced-motion` : le premier terme reste affiché, sans rotation.

## 4. Apparition au défilement

Le mouvement principal du site. Un seul comportement, appliqué partout.

- `IntersectionObserver`, seuil **0,15**, marge basse `-40px` ;
- état initial `opacity: 0; transform: translateY(16px)`, état final neutre, `--duree-moyenne`
  avec `--sortie` ;
- **une seule fois** : l'observateur se désabonne après déclenchement. Un bloc qui réapparaît
  à chaque passage devient agaçant au deuxième défilement ;
- **décalage en cascade de 60 ms** entre les éléments d'une même grille, plafonné au 6e
  élément. Au-delà, l'attente se voit ;
- **jamais sur le contenu du premier écran.** Ce qui est visible au chargement est déjà là ;
  animer le hero retarderait le LCP pour rien ;
- l'état initial est posé par le script, pas par le CSS : sans JavaScript, aucun bloc ne
  reste invisible. C'est la règle 2, et c'est le piège le plus courant de ce mécanisme.

## 5. En-tête au défilement

- au-delà de 40 px : hauteur réduite, fond opaque, ombre portée légère. Transition
  `--duree-courte` ;
- masquage en descente et réapparition en montée **au-delà de 400 px seulement**, pour rendre
  de la hauteur utile sur mobile ;
- l'état est piloté par une classe sur `<body>`, jamais par des styles en ligne.

## 6. Compteurs

Le client veut du mouvement, et les chiffres s'y prêtent. Mais DET Ingénierie montre le
contre-exemple : ses compteurs affichent « 0+ » quand le script ne part pas.

**Règle : la valeur finale est écrite dans le HTML.** Le script part de zéro et remonte
jusqu'à elle. Si le script échoue, ne se déclenche jamais ou si l'utilisateur a désactivé le
mouvement, **le vrai chiffre est affiché**. Ce sont les seules conditions qui rendent un
compteur animé acceptable.

Durée 1,2 s, décélération, déclenchement à l'entrée dans le champ, une seule fois. Les
chiffres à animer sont ceux du bloc repères : 2015, 13 marchés, 12 attestations,
8 préfectures.

## 7. Cartes et images

- **survol d'une carte** : `translateY(-4px)`, ombre renforcée, `--duree-courte` ;
- **image dans une carte** : `scale(1.04)` au survol, conteneur en `overflow: hidden`,
  `--duree-moyenne`. C'est le mouvement le plus rentable du site — il donne de la vie sans
  rien déplacer ;
- **au clavier** : le même traitement s'applique à `:focus-visible`, sinon l'effet n'existe
  que pour ceux qui utilisent une souris ;
- **image du hero** : zoom très lent, `scale(1)` → `scale(1.06)` sur 20 s, alternance douce.
  Perceptible sans être remarquable.

## 8. Filtre des réalisations

Aujourd'hui, les cartes disparaissent d'un coup. À la place : sortie en `opacity 0` +
`scale(.98)` sur 180 ms, puis entrée des cartes retenues en cascade de 40 ms. Le compteur de
résultats se met à jour à la fin de la sortie, pas avant.

Le filtre reste piloté par le paramètre d'URL côté serveur. L'animation n'est qu'une couche.

## 9. Bandeau de partenaires

Défilement horizontal continu et lent, façon Cougnaud. Pause au survol et au focus,
`prefers-reduced-motion` le fige en grille statique. Duplication du contenu pour la boucle,
avec `aria-hidden` sur la copie afin qu'un lecteur d'écran ne lise pas deux fois la liste.

## 10. Ce qu'on ne fait pas

| Effet | Raison |
| --- | --- |
| Défilement contrôlé par script (« smooth scroll » réécrit) | Casse le défilement natif, la molette, le trackpad et l'accessibilité |
| Parallaxe sur plusieurs couches | Coûteux, saccadé sur mobile d'entrée de gamme, apporte peu |
| Animation d'entrée sur le hero | Retarde l'élément LCP, seul indicateur de performance qui compte ici |
| Curseur personnalisé | Gadget, casse les habitudes, invisible sur mobile |
| Apparition rejouée à chaque passage | Agaçante dès la deuxième lecture |
| Compteur dont la valeur n'existe que dans le script | Affiche « 0 » quand il échoue, ce qui est pire que pas de chiffre |
| Bibliothèque d'animation | Interdite par le socle, et inutile ici |

## 11. Budget

L'ensemble tient en **moins de 4 Ko de JavaScript** et environ 2 Ko de CSS. Les objectifs de
performance ne bougent pas : Lighthouse mobile **performance ≥ 90**, et surtout **CLS < 0,05**
— c'est l'indicateur que ce lot met en danger, à cause du mot qui tourne.

Si un score décroche après ce lot, la cause est presque certainement la réservation de
largeur du hero ou un état initial d'apparition posé en CSS au lieu du script.
