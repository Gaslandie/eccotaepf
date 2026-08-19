# Contenus provisoires

Tout ce qui est affiché sur le site sans venir du client. Cette liste est la garantie que
rien de faux ne part en production.

**Document interne.** Son pendant envoyable au client est
`docs/cadrage/ELEMENTS_A_FOURNIR.md` : les deux disent la même chose, l'un pour nous, l'autre
pour lui. Tenir les deux à jour ensemble.

Le suivi reste strictement interne. L'attribut `data-provisoire` ne produit aucun texte ni
marqueur visible. Un contenu provisoire affiché doit se lire comme un contenu client fini ;
un bloc sans contenu exploitable n'est pas rendu. Voir `docs/technique/ARCHITECTURE.md`
section 6.

**Règle bloquante : la mise en ligne sur le domaine définitif (lot 8) est refusée tant que
cette liste n'est pas vide.**

Chaque élément provisoire porte l'attribut `data-provisoire` dans le HTML, ce qui rend la
liste vérifiable automatiquement :

```bash
grep -rn "data-provisoire" *.html realisations/ | wc -l
```

## Images

| Fichier | Page | Ce qu'elle représente | Remplacée par | État |
| --- | --- | --- | --- | --- |
| `assets/img/logo/logo-provisoire-clair.svg` | Toutes les pages | Logotype typographique provisoire clair | Logo officiel ECCOTA-EPF | À remplacer |
| `assets/img/logo/logo-provisoire-fonce.svg` | Toutes les pages | Logotype typographique provisoire foncé | Logo officiel ECCOTA-EPF | À remplacer |
| `assets/img/logo/favicon.svg` | Toutes les pages | Favicon provisoire | Favicon officiel ECCOTA-EPF | À remplacer |
| `assets/img/theme/accueil-chantier-480.webp` | `index.html` | Équipe de chantier coulant une dalle, photo d'illustration | Photo réelle ECCOTA-EPF | À remplacer |
| `assets/img/theme/accueil-chantier-960.webp` | `index.html` | Équipe de chantier coulant une dalle, photo d'illustration | Photo réelle ECCOTA-EPF | À remplacer |
| `assets/img/theme/accueil-chantier-1600.webp` | `index.html` | Équipe de chantier coulant une dalle, photo d'illustration | Photo réelle ECCOTA-EPF | À remplacer |
| `assets/img/realisations/demo-genie-civil-480.webp` | `index.html` | Engin de chantier, photo d'illustration | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/demo-genie-civil-960.webp` | `index.html` | Engin de chantier, photo d'illustration | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/demo-genie-civil-1600.webp` | `index.html` | Engin de chantier, photo d'illustration | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/demo-batiment-public-480.webp` | `index.html` | Ouvriers autour d'un bâtiment en béton, photo d'illustration | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/demo-batiment-public-960.webp` | `index.html` | Ouvriers autour d'un bâtiment en béton, photo d'illustration | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/demo-batiment-public-1600.webp` | `index.html` | Ouvriers autour d'un bâtiment en béton, photo d'illustration | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/renovation-batiment-480.webp` | Accueil, services et réalisations | Rénovation d'un bâtiment | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/renovation-batiment-960.webp` | Accueil, services et réalisations | Rénovation d'un bâtiment | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/renovation-batiment-1600.webp` | Accueil, services et réalisations | Rénovation d'un bâtiment | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/travaux-voirie-480.webp` | Accueil, services et réalisations | Voirie urbaine | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/travaux-voirie-960.webp` | Accueil, services et réalisations | Voirie urbaine | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/travaux-voirie-1600.webp` | Accueil, services et réalisations | Voirie urbaine | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/base-logistique-480.webp` | Accueil, services et réalisations | Base de stockage et de manutention | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/base-logistique-960.webp` | Accueil, services et réalisations | Base de stockage et de manutention | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/base-logistique-1600.webp` | Accueil, services et réalisations | Base de stockage et de manutention | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/amenagement-agropastoral-480.webp` | Accueil, services et réalisations | Parcelle agricole irriguée | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/amenagement-agropastoral-960.webp` | Accueil, services et réalisations | Parcelle agricole irriguée | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/realisations/amenagement-agropastoral-1600.webp` | Accueil, services et réalisations | Parcelle agricole irriguée | Photo de réalisation ECCOTA-EPF | À remplacer |
| `assets/img/theme/equipe-chantier-480.webp` | `a-propos.html`, services et réalisations | Équipe réunie sur un chantier | Photo de l'équipe ECCOTA-EPF | À remplacer |
| `assets/img/theme/equipe-chantier-960.webp` | `a-propos.html`, services et réalisations | Équipe réunie sur un chantier | Photo de l'équipe ECCOTA-EPF | À remplacer |
| `assets/img/theme/equipe-chantier-1600.webp` | `a-propos.html`, services et réalisations | Équipe réunie sur un chantier | Photo de l'équipe ECCOTA-EPF | À remplacer |

## Textes

| Emplacement | Page | Contenu provisoire | Attendu du client | État |
| --- | --- | --- | --- | --- |
| Héros, paragraphe de présentation | `index.html` | Formulation institutionnelle de démonstration | Texte validé par ECCOTA-EPF | À valider |
| Introduction des domaines | `index.html` | Présentation générale de l'accompagnement des projets | Descriptions de services validées | À remplacer |
| Titre et introduction des réalisations | `index.html` | Formulation institutionnelle présentant une sélection de projets | Réalisations réelles et texte validé | À remplacer |
| Réalisations mises en avant | `index.html` | Six titres, descriptions, localisations et années de démonstration | Réalisations réelles, lieux, périodes et maîtres d'ouvrage | À remplacer |
| Introduction des repères | `index.html` | Texte sur la présence terrain et le suivi des travaux | Texte institutionnel validé | À valider |
| Bandeau partenaires | `index.html` | Catégories et texte génériques sans logo | Liste officielle et autorisations d'affichage | À remplacer |
| Téléphone dans l'en-tête | Toutes les pages | `+224 000 00 00 00` | Numéro officiel ECCOTA-EPF | À remplacer |
| Bandeau de contact direct | `index.html` | Téléphone, WhatsApp, horaires et ville | Coordonnées et horaires officiels | À remplacer |
| Zone d'intervention | `index.html` | Texte, régions, villes et carte statique indicatifs | Régions et villes réellement couvertes | À remplacer |
| Appel au contact | `index.html` | Texte d'invitation et coordonnées de contact | Texte et coordonnées validés | À valider |
| Conformité administrative | `index.html` | Composant ocre conservé dans le CSS, section HTML non rendue | RCCM, NIF, attestations et agréments valides | Masqué |
| Présentation, valeurs et direction | `a-propos.html` | Historique, vision, valeurs et texte de direction | Présentation et gouvernance validées | À remplacer |
| Méthode et engagements | `a-propos.html` | Quatre engagements opérationnels plausibles | Engagements validés par ECCOTA-EPF | À valider |
| Sept domaines | `services.html` | Descriptions, prestations et listes d'intervention | Contenus de services validés | À remplacer |
| Grille et filtres des réalisations | `realisations/index.html` | Six projets de démonstration classés par domaine | Réalisations réelles | À remplacer |
| Fiches de réalisation | `realisations/*.html` | Métadonnées, périodes, descriptions, périmètres, galeries et enchaînement | Fiches et photographies réelles | À remplacer |
| Types de partenaires | `partenaires.html` | Quatre catégories décrites en texte, sans logo | Noms des partenaires et autorisations écrites | À remplacer |
| Coordonnées, carte, formulaire et FAQ | `contact.html` | Adresse générique, coordonnées, horaires, carte, textes et questions-réponses | Coordonnées et réponses validées | À remplacer |
| Mentions légales | `mentions-legales.html` | Structure et formulations légales génériques | Identité juridique, direction de publication et validation | À remplacer |
| Confidentialité | `confidentialite.html` | Politique adaptée au formulaire statique actuel | Validation juridique et adaptation au traitement serveur | À valider |
| Coordonnées et mentions du pied de page | Toutes les pages | Conakry, e-mail, téléphone, WhatsApp, horaires et formulation légale | Coordonnées et informations officielles | À remplacer |

## Métadonnées SEO

| Emplacement | Page | Contenu provisoire | Attendu du client | État |
| --- | --- | --- | --- | --- |
| `title` et `meta description` | 15 pages HTML | Titres et descriptions rédigés à partir des contenus de démonstration | Titres et descriptions validés après réception des contenus réels | À remplacer |
| Open Graph et Twitter Card | 15 pages HTML | Titres, descriptions, URL de recette GitHub Pages et images de partage provisoires | Métadonnées alignées sur le domaine définitif, le logo officiel et les réalisations réelles | À remplacer |
| Image de partage par défaut | Pages institutionnelles | `assets/img/theme/accueil-chantier-1600.webp` ou `assets/img/theme/equipe-chantier-1600.webp` | Image institutionnelle ECCOTA-EPF ou visuel officiel | À remplacer |
| Image de partage des réalisations | `realisations/*.html` | Image principale de chaque réalisation de démonstration | Photo principale de la réalisation réelle publiée | À remplacer |
| JSON-LD `Organization` | 15 pages HTML | Organisation limitée aux faits confirmés et au périmètre sectoriel connu | Données enrichies avec domaine, logo officiel, coordonnées et informations juridiques validées | À compléter |
| JSON-LD `BreadcrumbList` | Pages internes | Fil d'Ariane construit depuis l'arborescence statique de démonstration | Fil d'Ariane ajusté aux slugs réels après lot 2B | À remplacer |
| JSON-LD `CreativeWork` | `realisations/*.html` | Données structurées des six réalisations de démonstration | Données structurées des réalisations réelles validées | À remplacer |

## Chiffres

Aucun chiffre non confirmé par ECCOTA-EPF ne doit apparaître sur le site. Un « 150 chantiers
livrés » inventé se retourne contre l'entreprise devant un donneur d'ordre qui vérifie.

| Chiffre affiché | Page | Confirmé par le client | État |
| --- | --- | --- | --- |
| `2015` et `03 novembre 2015` | `index.html`, `a-propos.html` | Oui, présent dans le contexte projet | Conservé |
| `2022`, `2023`, `2024` | Accueil et réalisations | Non, années associées aux projets de démonstration | À remplacer |
| `+224 000 00 00 00` | Toutes les pages | Non, format de téléphone provisoire | À remplacer |
| `8 h - 18 h` | Toutes les pages | Non, horaires de démonstration | À remplacer |

## Réalisations de démonstration

Les réalisations écrites pour la maquette ne décrivent pas des marchés réellement exécutés
par ECCOTA-EPF. Elles sont **toutes** à remplacer par les réalisations fournies par le
client.

| Slug | Titre provisoire | État |
| --- | --- | --- |
| `amenagement-ouvrage-technique-conakry` | Aménagement d'un ouvrage technique à Conakry | À remplacer |
| `infrastructure-scolaire-kindia` | Infrastructure scolaire à Kindia | À remplacer |
| `renovation-centre-sante-mamou` | Rénovation d'un centre de santé à Mamou | À remplacer |
| `travaux-voirie-kankan` | Travaux de voirie urbaine à Kankan | À remplacer |
| `base-logistique-boke` | Base logistique et approvisionnement à Boké | À remplacer |
| `amenagement-agropastoral-faranah` | Aménagement agropastoral à Faranah | À remplacer |

## Ce qui ne doit jamais apparaître à l'écran

« Photo d'illustration », « À compléter », « [À COMPLÉTER] », « en attente de »,
« emplacement réservé », « à fournir », ou toute autre formulation signalant un travail en
cours.

Un bloc dont le contenu réel manque n'est pas affiché avec une étiquette : il n'est pas
affiché du tout. Un contenu provisoire réellement visible doit être plausible et fini.

```bash
# Aucune mention de provisoire dans le rendu
grep -rniE "photo d.illustration|à complèt|a complet|\[À COMPLÉTER\]|en attente de|emplacement réservé|à fournir" \
  *.html realisations/ && echo ECHEC || echo OK
```
