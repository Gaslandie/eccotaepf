# Architecture — Site vitrine ECCOTA-EPF

Document de référence technique. Toute décision structurante est reportée ici ou dans un ADR.

Statut : arrêté le 2026-08-19, modifié le 2026-08-19 par `ADR-002`.
Voir `ADR-001` (pile serveur) et `ADR-002` (Bootstrap et livraison statique en phase 1).

## 1. Les deux phases

| | Phase 1 — statique | Phase 2 — dynamique |
| --- | --- | --- |
| Objectif | Site public complet, validable par le client | Autonomie du client |
| Technologie | HTML + Bootstrap 5.3 + CSS et JS maison | PHP 8.1 + MySQL |
| Contenus | Écrits en dur, provisoires puis réels | En base, éditables |
| Hébergement | GitHub Pages | Mutualisé cPanel |
| Contient | Les 10 pages publiques, le design, le SEO | Administration, formulaire serveur, base de données |
| Lots | 0 à 3 | 4 à 8 |

**Le rendu visuel ne change pas entre les deux phases.** La phase 2 découpe le HTML de la
phase 1 en gabarits, elle ne le redessine pas. Un test de non-régression HTML garantit ce
point au lot 4.

Le modèle de données de `MODELE_DONNEES.md` reste la référence : il décrit la phase 2 et
détermine dès la phase 1 quels champs doivent exister sur chaque page.

## 2. Pile de la phase 1

| Sujet | Choix |
| --- | --- |
| Balisage | HTML5 écrit à la main, une page par URL |
| CSS | **Bootstrap 5.3** copié dans le dépôt, plus une surcouche `styles.css` |
| JavaScript | `bootstrap.bundle.min.js` + un `main.js` maison |
| Build | Aucun. Pas de npm, pas de Sass, pas de gestionnaire de paquets |
| Polices | `woff2` auto-hébergées |
| Images | WebP, sources libres documentées, remplacées par les photos client |
| Hébergement | GitHub Pages, puis mutualisé en phase 2 |

**Bootstrap est copié dans `assets/vendor/bootstrap/`, jamais appelé depuis un CDN.** Trois
raisons : le site reste fonctionnel si le CDN tombe ou est bloqué, la politique de sécurité
du contenu reste simple, et la version est figée dans le dépôt. Noter la version exacte
utilisée dans le `README.md`.

## 3. Arborescence

```text
eccota-epf/
  index.html
  a-propos.html
  services.html
  partenaires.html
  contact.html
  mentions-legales.html
  confidentialite.html
  404.html
  realisations/
    index.html
    <slug>.html            <- une page par réalisation
  assets/
    vendor/bootstrap/      bootstrap.min.css  bootstrap.bundle.min.js
    css/    styles.css     <- surcouche unique, thème et composants maison
    js/     main.js
    img/
      logo/                logo provisoire, favicon
      theme/               images de mise en page
      realisations/        photos, une par réalisation, en 3 largeurs
      partenaires/
    fonts/
  docs/
  scripts/
    verifier-liens.js      contrôle des liens et des ressources locales
    generer-sitemap.js     sitemap.xml depuis les fichiers HTML présents
  robots.txt
  sitemap.xml              généré
```

Structure plate à la racine, comme sur `Groupe-babia` : c'est ce que GitHub Pages sert le
plus simplement. Seules les réalisations ont un sous-dossier, parce que leurs URLs doivent
rester `/realisations/<slug>` en phase 2.

**Chemins relatifs obligatoires.** GitHub Pages servira le site depuis un sous-chemin de type
`/eccotaepf/`, pas depuis la racine d'un domaine. Toute URL commençant par `/` sera cassée.
Depuis `realisations/`, les ressources sont en `../assets/…`. C'est le piège le plus probable
de la phase 1 et il est contrôlé par `scripts/verifier-liens.js`.

## 4. Utilisation de Bootstrap — règles

Un Bootstrap laissé par défaut se reconnaît au premier coup d'œil. Pour une entreprise dont
l'argument est la solidité et l'ancienneté, un site qui ressemble à un gabarit gratuit
travaille contre l'objectif. Ces règles ne sont pas des préférences.

1. **Redéfinir le thème par les variables CSS de Bootstrap** dans `styles.css` :
   `--bs-primary`, `--bs-body-font-family`, `--bs-border-radius`, `--bs-body-color`… Pas de
   recompilation Sass, donc pas de npm.
2. **Aucune couleur Bootstrap d'origine visible.** Le bleu `#0d6efd` et le gris de `.btn-secondary`
   ne doivent apparaître nulle part. Palette dérivée du logo ; en attendant le logo, une
   palette sobre de type BTP — un bleu-gris foncé dominant, un accent chaud pour les appels
   à l'action, du blanc cassé pour les fonds.
3. **Aucune police système par défaut.** Une police de titre affirmée, une police de texte
   lisible, auto-hébergées.
4. **Pas de composant décoratif gratuit.** Pas de carrousel de témoignages vide, pas de
   compteur animé sans chiffre vérifié, pas d'accordéon là où une liste suffit.
5. **Utiliser la grille et les utilitaires** plutôt que réécrire du CSS. Le `styles.css`
   maison sert au thème et à ce que Bootstrap ne fait pas : cartes de réalisation, galerie,
   en-tête de page, ruban de partenaires.
6. **Ne pas surcharger le balisage.** Une carte qui accumule dix classes utilitaires devient
   impossible à convertir en gabarit à la phase 2 : au-delà de trois répétitions du même
   bloc, créer une classe maison.
7. **Composants JavaScript retenus** : `offcanvas` pour le menu mobile, `modal` pour la
   galerie photo, `collapse` pour les filtres sur mobile. Rien d'autre sans raison écrite.

## 5. Pages

| Fichier | URL en phase 2 | Contenu |
| --- | --- | --- |
| `index.html` | `/` | Présentation, domaines d'intervention, réalisations mises en avant, chiffres clés, appel au contact |
| `a-propos.html` | `/a-propos` | Historique depuis le 03/11/2015, vision, valeurs, direction |
| `services.html` | `/services` | Les 7 domaines d'intervention, chacun avec son ancre |
| `realisations/index.html` | `/realisations` | Liste filtrable par domaine |
| `realisations/<slug>.html` | `/realisations/<slug>` | Titre, description, galerie, localisation, période, domaine |
| `partenaires.html` | `/partenaires` | Partenaires, institutions et références |
| `contact.html` | `/contact` | Coordonnées, WhatsApp, carte, formulaire |
| `mentions-legales.html` | `/mentions-legales` | Obligation légale d'éditeur |
| `confidentialite.html` | `/confidentialite` | Traitement des messages |
| `404.html` | — | Page d'erreur, reconnue par GitHub Pages |

En phase 1, les pages de service détaillées ne sont pas des fichiers séparés : `services.html`
porte une section par domaine, avec une ancre. La phase 2 les transformera en pages si le
référencement le justifie.

### Filtre des réalisations

En phase 1, le filtre est en JavaScript côté navigateur, sur des attributs `data-domaine`.
**Sans JavaScript, toutes les réalisations restent visibles** — jamais une liste vide. En
phase 2, le filtre passera en paramètre d'URL côté serveur.

### Formulaire de contact

En phase 1, il n'y a pas de serveur : le formulaire ne peut pas traiter un envoi. Il est
donc câblé en **`mailto:` avec repli WhatsApp**, avec validation JavaScript et messages
d'erreur complets, exactement comme sur `Groupe-babia`. Le vrai traitement serveur est le
lot 6.

Le bouton WhatsApp flottant, lui, fonctionne dès la phase 1 : c'est le canal réel du client.

## 6. Images et contenus provisoires

Les photos réelles d'ECCOTA-EPF ne sont pas encore disponibles. La phase 1 utilise des
images libres de droits, ce qui permet d'avancer sans attendre — mais crée un risque précis
qu'il faut traiter tout de suite.

**Règles**

1. Uniquement des sources **libres d'usage commercial** : Unsplash, Pexels, Pixabay. Pas
   d'image trouvée par une recherche d'images généraliste.
2. **Chaque image est enregistrée dans `docs/design-ux/SOURCES_IMAGES.md`** : fichier, source,
   URL, auteur, licence, date. Sans exception. C'est une règle du template GassTech, et c'est
   ce qui permettra de savoir quoi remplacer.
3. Les images sont converties en **WebP**, en trois largeurs (480 / 960 / 1600), avec
   `srcset`, `width`, `height` et `loading="lazy"` sauf la première image de l'accueil.
4. **Le logo n'est pas pris sur Internet.** Reprendre le logo d'une autre entreprise est un
   usage de marque. En attendant le logo officiel d'ECCOTA-EPF, produire un logotype
   typographique provisoire en SVG, sobre, clairement identifié comme provisoire.
5. Toute image et tout texte provisoires portent l'attribut `data-provisoire` et sont listés
   dans `docs/design-ux/CONTENUS_PROVISOIRES.md`. **Cet attribut ne produit aucun rendu** :
   il sert uniquement au suivi interne et au contrôle avant mise en ligne.

### Aucune mention de provisoire en production

Le site doit se présenter comme un site fini dès qu'il sort du cercle de la recette. Le client
le montrera autour de lui, et un donneur d'ordre peut tomber dessus.

Sont donc **interdits dans le rendu de production** : « Photo d'illustration »,
« À compléter », « [À COMPLÉTER] », « en attente de », « emplacement réservé », et toute
formulation qui signale un travail en cours. En mode recette, ces marqueurs sont au contraire
attendus — voir plus bas.

**Règle de production : vide = masqué.** Un bloc sans contenu réel n'est pas affiché avec une
étiquette, il n'est pas affiché du tout. Les marqueurs destinés au client existent, mais sont
conditionnés au mode recette décrit plus bas.

| Situation | Comportement |
| --- | --- |
| Un chiffre clé de réalisation n'est pas connu | La ligne n'apparaît pas sur la carte |
| Aucune pièce administrative n'est fournie | La section conformité n'est pas rendue |
| Aucun chiffre d'entreprise n'est confirmé | Le bloc repères affiche des faits qualitatifs vérifiables, ou n'est pas rendu |
| Une réalisation n'a pas de témoignage | Aucun encadré de citation |
| Une valeur légale manque | Le champ n'est pas affiché ; la page reste cohérente |

Le contenu provisoire réellement affiché — textes de démonstration, photos libres — doit être
**plausible et fini**. Un texte provisoire se reconnaît dans le code, jamais à l'écran.

### Le mode recette — décidé, **non implémenté**

Décidé le 2026-08-19, après un aller-retour utile. **Reporté** le 2026-08-19 : le lot 1 a été
livré sans, et le comportement en vigueur est « vide = masqué ». Ce qui suit décrit la cible
si le besoin revient, pas l'état du code.

Les marqueurs de contenu manquant ont une vraie valeur : ils disent au client, **en situation
et à l'endroit exact**, ce qu'il doit fournir. C'est un bien meilleur support de relance
qu'une liste dans un tableau, parce que le client voit l'emplacement et comprend à quoi sert
l'information qu'on lui demande.

Ils ont aussi un vrai coût : un site couvert d'« à compléter » ne peut être montré à personne
d'autre qu'au client, et le jour de la mise en ligne, il suffit d'en oublier un.

Les deux besoins sont réels, et ils ne se contredisent pas : **ils ne s'adressent pas au même
public**. On les sépare par un interrupteur unique.

```html
<body data-mode="recette">   <!-- marqueurs visibles -->
<body>                       <!-- production : rien -->
```

| | `data-mode="recette"` | Production |
| --- | --- | --- |
| Chiffre clé absent | « À compléter — surface ou durée » | La ligne n'est pas rendue |
| Section conformité vide | Affichée, chaque champ en « À fournir » | Non rendue |
| Photo provisoire | Pastille « Photo d'illustration » | Aucune pastille |
| Réalisation de démonstration | Bandeau « Exemple — à remplacer par une référence réelle » | Non rendue |
| Bandeau de tête | « Version de recette — contenus en cours de collecte » | Absent |

Règles de mise en œuvre :

1. **Un seul interrupteur.** L'attribut sur `<body>`, et rien d'autre. Aucun marqueur codé en
   dur dans le contenu : tous sont produits par le CSS ou par un gabarit conditionnel, à
   partir de `data-provisoire`.
2. **Le mode recette n'invente rien.** Il ne fait qu'afficher ce qui manque. Le contenu
   provisoire réellement présent — textes, photos — reste plausible et fini.
3. **Les marqueurs sont soignés.** Discrets, dans la palette du site, jamais plus visibles que
   le contenu réel. Une pastille, pas une bannière rouge. Le client doit voir une entreprise
   dont le dossier se complète, pas un chantier.
4. **La production est le comportement par défaut.** Sans l'attribut, la règle « vide =
   masqué » s'applique intégralement. Un oubli produit un site propre, jamais un site marqué.
5. **Le lot 8 vérifie que l'attribut est absent** avant mise en ligne sur le domaine définitif,
   en plus du contrôle de `CONTENUS_PROVISOIRES.md`.

Le sens de l'interrupteur n'est pas neutre : c'est le mode recette qui doit être demandé
explicitement, jamais la production. L'oubli le plus probable est de laisser un réglage en
place, pas de l'ajouter par accident.

### Le pendant côté client

Les marqueurs à l'écran servent la conversation ; ils ne remplacent pas une demande écrite.
`docs/cadrage/ELEMENTS_A_FOURNIR.md` est la liste envoyable au client, tenue à jour depuis
`CONTENUS_PROVISOIRES.md`. Les deux disent la même chose, à deux moments différents.

Un blocage subsiste, interne : la mise en ligne sur le domaine définitif est refusée tant que
`CONTENUS_PROVISOIRES.md` n'est pas vide et que `data-mode` n'a pas disparu (lot 8).

## 7. Référencement

Traité dès la phase 1, parce que refaire les métadonnées après coup coûte plus cher.

- `title` et `meta description` uniques par page ;
- un `<h1>` par page, hiérarchie de titres cohérente ;
- `link rel="canonical"` ;
- Open Graph et Twitter Card — **WhatsApp sera le premier canal de partage**, la vignette
  doit être correcte ;
- JSON-LD : `Organization` sur tout le site, `BreadcrumbList` sur les pages internes,
  `CreativeWork` sur chaque réalisation ;
- `sitemap.xml` généré par `scripts/generer-sitemap.js` à partir des fichiers présents ;
- `robots.txt` ;
- texte alternatif sur toutes les images, décrivant l'ouvrage, pas le fichier ;
- URLs en minuscules, sans accent, avec tirets. **Un slug de réalisation devient définitif à
  la mise en ligne sur le domaine, au lot 8** : c'est à partir de là qu'il devient un lien
  envoyé dans un dossier d'appel d'offres.

  Jusque-là, il reste renommable. La publication du lot 3 sur GitHub Pages est en `noindex`,
  le lien ne circule qu'auprès du client : renommer un slug de démonstration au lot 2B, quand
  les vraies réalisations arrivent, ne casse rien. Après le lot 8, tout changement de slug
  exige une redirection 301, que le statique ne sait pas faire proprement.

## 8. Performance et accessibilité

Objectif : page complète sous **250 Ko hors images**, Bootstrap compris, et affichage utile
en moins de 2,5 secondes sur une connexion mobile guinéenne.

- Bootstrap CSS et JS locaux, minifiés, servis avec un cache long.
- Aucune bibliothèque supplémentaire : ni jQuery, ni AOS, ni bibliothèque d'icônes complète.
  Les icônes utilisées sont copiées une par une en SVG en ligne.
- Aucune police distante bloquante.
- Le site reste utilisable sans JavaScript : navigation, contenus et liens fonctionnent ;
  seuls le filtre, la galerie et le menu mobile se dégradent proprement.
- Accessibilité : lien d'évitement, contrastes AA, navigation clavier complète, `aria-current`
  sur l'entrée de menu active, cibles tactiles de 44 px, focus visible non supprimé.

## 9. Phase 2 — ce qui est décalé, pas abandonné

L'espace d'administration est au devis et reste dû. Sont reportés en phase 2 :

- PHP 8.1 rendu serveur, MySQL, hébergement mutualisé cPanel (`ADR-001`) ;
- les 9 tables et le contrat des dépôts (`MODELE_DONNEES.md`) ;
- l'authentification, le CRUD des réalisations, l'envoi et le traitement des photos ;
- le formulaire de contact traité côté serveur, avec stockage en base ;
- le durcissement sécurité, les sauvegardes et la journalisation.

**À dire au client sans détour** : ce qu'il verra dans quelques jours est le site public ;
la capacité à le mettre à jour lui-même arrive après. Laisser croire l'inverse produirait une
mauvaise surprise à la livraison.

## 10. Ce que le projet ne fait pas

- pas de version anglaise ;
- pas de boutique, de panier, de paiement ni de devis en ligne ;
- pas de compte visiteur ;
- pas de blog ni d'actualités ;
- pas d'application mobile ;
- pas de npm, pas de Sass, pas de framework JavaScript, pas de CDN.
