# Tâche — Lot 2D : hero, carte, rythme vertical et icônes

Références : capture de cougnaud.com fournie le 2026-08-19, `SYSTEME_ANIMATION.md`.
Dépend de : lot 2C terminé.

## Objectif

Quatre sujets de finition, réunis parce qu'ils touchent tous à la perception de qualité.

1. Aligner la section hero sur celle de cougnaud.com, typographie comprise.
2. Corriger la carte de la zone d'intervention, qui ne représente rien de reconnaissable.
3. Rétablir le rythme vertical : deux sections se touchent sans respiration.
4. Corriger les icônes : celle de WhatsApp est une approximation, et les sept icônes de
   domaines sont identiques.

## A. La section hero

### Anatomie de la cible

Relevé sur la capture fournie :

| Élément | Cougnaud | Chez nous aujourd'hui |
| --- | --- | --- |
| En-tête | Barre blanche opaque, compacte, logo à gauche dans un bloc, navigation à droite, un seul bouton d'action coloré | Comparable — à conserver |
| Photo | Plein cadre, **pleine hauteur de fenêtre** sous l'en-tête | Hauteur réduite |
| Voile sombre | Léger, localisé à gauche. La photo reste lisible | Voile lourd sur toute l'image |
| Titre | Blanc, très grand, **3 lignes**, interlignage serré ≈ 1,05 | Correct mais moins imposant |
| Sous-titre | **Deux lignes courtes**, graisse légère, largeur limitée | Un paragraphe de 60 mots |
| Action | **Un seul bouton** plein, forme pilule | Deux boutons qui se concurrencent |
| Bas de hero | Flèches de navigation discrètes | Bandeau de faits sur 4 colonnes |
| Alignement | Gauche, bloc centré verticalement | Aligné en bas |

### À faire

1. **Hauteur** : `min-height: calc(100svh - hauteur d'en-tête)`, plafonnée à 820 px sur grand
   écran. Utiliser `svh` et non `vh` : sur mobile, `vh` provoque un saut à l'apparition de la
   barre d'adresse.
2. **Contenu centré verticalement**, aligné à gauche, avec une marge gauche généreuse qui
   suit le conteneur.
3. **Alléger le voile** : dégradé de gauche à droite, opaque à gauche, transparent au tiers
   droit. La photo doit redevenir visible — c'est elle qui porte le message.
4. **Titre** : `clamp(2.4rem, 6vw, 4.5rem)`, interlignage 1,05, graisse 700. Trois lignes sur
   ordinateur. Le mot qui tourne du lot 2C reste en fin de phrase.
5. **Sous-titre réduit à deux lignes.** Le paragraphe actuel reprend la raison sociale
   complète et toute la liste des domaines — c'est illisible en hero. Proposition :
   *« Bâtiments, ouvrages de génie civil, infrastructures sanitaires et scolaires. Treize
   marchés exécutés en Guinée depuis 2015. »*
   La liste complète des domaines existe déjà plus bas dans la page, elle n'a pas à être là.
   Largeur limitée à 52 caractères environ, graisse 400, taille `clamp(1.05rem, 2vw, 1.35rem)`.
6. **Un seul bouton plein** — « Présenter un projet ». Le second devient un lien texte
   souligné, sans cadre, pour ne pas concurrencer le premier.
7. **Déplacer le bandeau de faits** hors du hero, juste sous le bandeau de contact direct. Il
   reste utile, mais il alourdit un hero qui doit respirer.

### La typographie

Le client veut la police de Cougnaud. **Ne pas deviner.**

1. Relever la `font-family` réellement calculée sur cougnaud.com, en navigateur sans
   interface, sur le `h1` et sur le corps de texte.
2. Si la police est sous licence commerciale — c'est le cas le plus probable — choisir
   l'équivalent libre le plus proche et **l'auto-héberger en woff2**. Aucune police distante,
   la règle ne change pas. Candidates sérieuses : Figtree, Plus Jakarta Sans, Manrope,
   Outfit, Poppins.
3. Comparer visuellement avant de trancher : hauteur d'x, forme du `a`, du `g` et du `t`,
   largeur des capitales. Justifier le choix en une phrase dans le rapport.
4. **Ce changement vaut pour tout le site**, pas seulement le hero : Archivo disparaît des
   titres. Vérifier ensuite tous les gabarits — c'est là que des débordements apparaissent,
   comme au lot 1 avec `.stat-value`.
5. Charger uniquement les graisses utilisées, en `woff2`, avec `font-display: swap`.
   Deux graisses de titre au maximum.

## B. La carte de la zone d'intervention

### Le problème

Le tracé actuel est un polygone dessiné à la main qui ne correspond à **aucune** frontière
réelle. Les traits qui relient les points suggèrent en plus des axes ou des routes qui
n'existent pas. Le résultat n'est reconnaissable ni comme la Guinée, ni comme autre chose.

Une carte fausse de son propre pays, sur le site d'une entreprise guinéenne, se repère
immédiatement par le premier visiteur guinéen. C'est un défaut de crédibilité, pas un détail
graphique.

### À faire — option retenue

1. Récupérer un **contour de la Guinée dans le domaine public** — Wikimedia Commons, Natural
   Earth, ou équivalent. Noter la source et la licence dans `SOURCES_IMAGES.md` comme pour
   toute autre ressource.
2. Le simplifier pour l'usage : quelques centaines de points suffisent, pas des milliers.
3. **Vérifier la forme** contre une carte de référence avant de l'intégrer. La Guinée a une
   silhouette caractéristique en croissant, ouverte vers l'ouest, avec la façade atlantique
   côté ouest et une pointe forestière au sud-est. Si la forme obtenue ne ressemble pas à
   cela, c'est qu'elle est fausse.
4. Placer les **8 préfectures** à leurs positions relatives réelles : Conakry, Coyah, Kindia,
   Télimélé, Tougué, Kankan, Mandiana, Beyla. Vérifier chacune sur une carte.
5. **Supprimer les traits de liaison.** Ils suggèrent un réseau qui n'existe pas. Des points,
   des étiquettes, rien d'autre.
6. Garder le libellé « Carte indicative », qui est honnête.

### Repli, si la forme ne peut pas être vérifiée

Ne pas livrer une carte approximative. Remplacer par un traitement typographique : les
8 préfectures en grille, avec pour chacune la ou les localités concernées. On perd l'effet
visuel, on ne perd aucune information, et rien n'est faux.

**Une carte inexacte est pire que pas de carte.** C'est le critère de décision.

## C. Rythme vertical

### Le problème

Sur l'accueil, la bande ocre « Conformité administrative » et la section « Partenaires » se
touchent : le titre des partenaires démarre à la limite exacte de la bande colorée. Le
contraste de fond rend le défaut très visible.

Cause : `<section class="section pt-0" id="partenaires">`. La classe utilitaire `pt-0` de
Bootstrap annule le `padding-block` de `.section`, qui vaut pourtant
`clamp(3rem, 7vw, 6rem)`.

### À faire

1. **Retirer `pt-0`** de la section partenaires.
2. **Interdire les utilitaires d'espacement nul sur les sections.** `pt-0`, `pb-0`, `my-0`
   appliqués à une `.section` cassent le rythme du site. S'il faut réduire un espacement,
   cela se fait par une classe de thème dans `styles.css`, jamais par un utilitaire posé au
   cas par cas.
3. **Deux sections de fond différent ne se touchent jamais.** Le passage d'un fond coloré à
   un fond clair exige au minimum l'espacement complet des deux côtés. C'est là que l'œil
   voit un défaut, pas au milieu d'une section.
4. **Vérifier les 22 pages**, pas seulement l'accueil.
5. **Bandeau de partenaires** : sur la capture, la première carte est coupée net par le bord
   gauche. Un défilement continu doit avoir un **masque de dégradé sur ses deux bords**, sans
   quoi les éléments sont tranchés à la limite du conteneur. À ajouter — `mask-image` en
   dégradé horizontal, quelques dizaines de pixels de chaque côté.

## D. Icônes

### WhatsApp

L'icône du bouton flottant est un dessin approximatif : une bulle tracée en `stroke` dont
l'amorce de queue s'arrête brutalement, plus un combiné en `fill`. Mélanger contour et
remplissage dans une même icône la fait paraître inachevée à petite taille — c'est ce que le
client a remarqué.

À faire :

1. Utiliser le **glyphe officiel de WhatsApp**, en un seul tracé rempli. Simple Icons le
   publie en CC0 ; noter la source dans `SOURCES_IMAGES.md`.
2. `fill="currentColor"`, pas de `stroke`.
3. Rendre le bouton **circulaire** — `border-radius: 50%`. Un bouton flottant WhatsApp est
   rond par convention ; le carré arrondi actuel participe à l'impression d'inachevé.
4. Vérifier le rendu à 54 px, taille réelle.

### Les sept icônes de domaines

**Les sept icônes de la grille « Domaines d'intervention » sont strictement identiques** —
même empreinte. Sept cartes, sept fois le même pictogramme. C'est la même répétition que
celle corrigée sur les images, transposée aux icônes.

À faire : une icône distincte et lisible par domaine — BTP et construction, ouvrages de génie
civil, infrastructures sanitaires et scolaires, rénovation et entretien, fournitures diverses,
transport, agriculture et élevage.

Contraintes : SVG en ligne, `viewBox="0 0 24 24"`, **un seul style graphique pour les sept**
— soit toutes en contour, soit toutes en aplat, jamais un mélange —, `stroke-width` identique,
et lisibles à 24 px. Une icône qu'on ne reconnaît pas à sa taille d'affichage ne sert à rien :
préférer un symbole simple à un dessin détaillé.

### Contrôle général

Passer en revue **toutes** les icônes du site avec le même œil : cohérence de style,
`viewBox` correct, aucun tracé tronqué, aucune icône répétée là où le sens diffère.

## Périmètre exclu

- la palette et les couleurs ;
- la structure des autres sections ;
- les contenus des réalisations ;
- le système d'animation du lot 2C, qui reste tel quel.

## Critères d'acceptation

1. Le hero occupe la hauteur de fenêtre sous l'en-tête, sans saut à l'apparition de la barre
   d'adresse sur mobile.
2. La photo du hero est lisible : le voile ne la noie plus.
3. Le sous-titre tient en deux lignes sur ordinateur.
4. Un seul bouton plein dans le hero.
5. La police de titre est auto-hébergée, en `woff2`, deux graisses au maximum, et le choix
   est justifié dans le rapport.
6. Aucun débordement de texte sur les 22 pages après changement de police, à 320, 768, 1024
   et 1440 px. **Contrôler particulièrement `.stat-value`**, qui a déjà débordé au lot 1.
7. La carte représente la Guinée de façon reconnaissable et les 8 préfectures sont à leur
   place — ou la carte est remplacée par la grille typographique.
8. Aucun trait de liaison entre les points.
9. Contour de carte sourcé et licencié dans `SOURCES_IMAGES.md`.
10. Aucune section ne touche la suivante sur les 22 pages, et aucun `pt-0` ni `pb-0` ne
    subsiste sur une `.section`.
11. Le bandeau de partenaires ne coupe plus ses éléments à ras bord.
12. L'icône WhatsApp est le glyphe officiel, en un seul tracé rempli, dans un bouton rond.
13. Les sept icônes de domaines sont **différentes** et de style homogène.
14. Pas de régression : **CLS < 0,05**, performance ≥ 90, liens et domaine OK.

## Vérification attendue

```bash
node scripts/verifier-liens.js && node scripts/verifier-domaine.js

# Plus aucune référence à l'ancienne police de titre
grep -rn "Archivo" assets/css/styles.css

# Polices auto-hébergées uniquement
grep -rn "fonts.googleapis\|fonts.gstatic" *.html realisations/ assets/ && echo ECHEC || echo OK
ls -la assets/fonts/

# Le hero n'utilise plus vh
grep -n "100vh" assets/css/styles.css && echo "utiliser svh" || echo OK

# Plus de traits de liaison sur la carte
grep -c "map-route" index.html    # attendu : 0

# Aucun utilitaire d'espacement nul sur une section
grep -rnE 'class="section[^"]*p[tb]-0' *.html realisations/ && echo ECHEC || echo OK

# Les sept icones de domaines sont distinctes
python3 - <<'EOF'
import re, hashlib
s = open("index.html", encoding="utf-8").read()
i, j = s.find('id="domaines"'), s.find('id="realisations"')
svgs = re.findall(r"<svg.*?</svg>", s[i:j], re.S)
h = {hashlib.md5(re.sub(r"\s+", " ", t).encode()).hexdigest() for t in svgs}
print("icones:", len(svgs), "| distinctes:", len(h), "->", "OK" if len(h) == len(svgs) else "ECHEC")
EOF
```

Et en navigateur : Lighthouse mobile avec **CLS relevé séparément**, rendu du hero à 320,
768, 1024 et 1440 px, et comparaison côte à côte avec la capture de cougnaud.com.

## Rapport de fin attendu

Comme `AGENTS.md`, avec : la police relevée sur cougnaud.com, celle retenue et pourquoi, une
capture du hero aux quatre largeurs, la source et la licence du contour de carte, et le CLS.
