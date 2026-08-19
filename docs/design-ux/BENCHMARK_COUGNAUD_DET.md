# Benchmark UX/UI — Cougnaud et DET Ingénierie

Analysé le 2026-08-19. Sources :
[cougnaud.com](https://www.cougnaud.com/) et [det-ingenierie.com](https://det-ingenierie.com/).

## Pourquoi ces deux références

Elles ne jouent pas dans la même catégorie, et c'est utile.

**Cougnaud** est un groupe de 2 000 collaborateurs, 50 ans d'existence, 11 implantations. Il a
les moyens de prouver ce qu'il avance. On lui emprunte sa **mécanique de preuve** : chiffres,
citations clients, certifications, maillage territorial.

**DET Ingénierie** est une PME de maîtrise d'œuvre. C'est notre échelle réelle. On lui
emprunte sa **sobriété** : menu court, téléphone dans l'en-tête, cartes projet compactes,
page unique qui va à l'essentiel.

ECCOTA-EPF vend sa capacité à exécuter un marché. Tout ce qui suit est trié selon un seul
critère : **est-ce que ça aide un donneur d'ordre à se convaincre qu'on peut faire le
chantier ?**

## Ce qu'on a déjà et qui tient la comparaison

Le lot 0 est meilleur que ce que je craignais sur trois points où Bootstrap déçoit
habituellement :

- **Hero statique avec image de chantier réelle et bandeau de faits sous les boutons**
  (création, territoire, publics servis, approche). Cougnaud utilise un carrousel de slogans
  tournants : c'est plus faible, ça retarde l'affichage et ça ne dit rien de vérifiable. Ne
  pas le copier.
- **Palette et typographie personnalisées** — bleu-gris ardoise, accent ocre, Archivo en
  titrage. On ne reconnaît pas Bootstrap. C'est déjà plus caractérisé que DET.
- **Grille de domaines en cartes avec icônes**, comparable à la grille des 7 expertises de
  Cougnaud.

## P0 — à intégrer, fort effet, faible coût

### 1. Bandeau de contact direct sous le hero

**Cougnaud** place son numéro vert, ses horaires et son e-mail immédiatement sous le hero,
avant toute autre chose. **DET** met son téléphone dans le menu principal.

En Guinée, le canal réel de conversion est le téléphone et WhatsApp, pas un formulaire. Un
bouton flottant seul ne suffit pas : il est ignoré. Ajouter un bandeau plein écran juste
sous le hero — téléphone cliquable, WhatsApp, horaires, ville — et le numéro dans l'en-tête
sur ordinateur.

### 2. Métadonnées visibles sur les cartes de réalisation

**DET** affiche sur chaque carte : image, titre, **type de mission**, **année**, lien.
**Cougnaud** ajoute la **surface** et la **durée**.

Nos cartes actuelles portent le domaine et un titre. Il leur manque la localisation, l'année
et un chiffre. C'est précisément ce qu'un donneur d'ordre lit pour juger la comparabilité
d'une référence. Ajouter systématiquement : **domaine · localisation · année**, et quand
l'information existe, une donnée chiffrée — surface, linéaire, capacité, durée.

### 3. Zone d'intervention

**Cougnaud** consacre une section à son maillage territorial, avec une carte de France.

Pour une entreprise qui répond à des appels d'offres publics, la question « intervenez-vous
à Kankan ? » est éliminatoire. Une section listant les régions couvertes, avec les villes où
des chantiers ont été exécutés, répond à une objection réelle. Pas besoin de carte
interactive : une liste de régions et une carte statique suffisent.

### 4. Conformité administrative en évidence

**Cougnaud** affiche un bandeau de certifications (CSTB, RE2020). **DET** affiche HQE et
CERTIVEA.

Nos équivalents guinéens sont **RCCM, NIF, attestations fiscales et sociales, agréments**.
Dans une procédure de marché public en Guinée, c'est le premier filtre administratif. Les
afficher — en pied de page et sur une bande dédiée en bas de l'accueil — transforme une page
de communication en dossier de candidature. C'est le point où on gagne le plus de crédibilité
pour le moins d'effort.

À demander au client : voir la question ouverte n° 8 de `PROJECT_CONTEXT.md`.

### 5. Pied de page riche

Cougnaud utilise 5 colonnes, DET 4. Notre pied de page en a 3 et reste maigre. Passer à 4 :
domaines, réalisations par secteur, entreprise et informations légales, contact et
coordonnées administratives.

## P1 — à intégrer si le contenu client suit

### 6. Citation client sur les réalisations phares

C'est le meilleur élément de Cougnaud : chaque référence porte une citation nominative — nom,
fonction, entreprise — du type « bâtiment sur-mesure, construit en 6 mois, dans l'enveloppe
budgétaire ». Une référence sans témoignage est une photo ; avec témoignage, c'est une preuve.

**Conséquence sur le modèle de données** : ajout des champs `temoignage`, `temoignage_auteur`,
`temoignage_fonction` et `chiffre_cle` à la table `realisations`. Voir `MODELE_DONNEES.md`.

Le champ reste facultatif : une réalisation sans citation s'affiche normalement. Mais
demander une phrase au maître d'ouvrage à la réception d'un chantier devient une habitude à
installer chez le client.

### 7. Chiffres clés vérifiés

Cougnaud : 72 000 modules, 2 000 collaborateurs, 11 implantations. DET affiche des compteurs
animés — mais qui s'affichent à « 0+ » quand le script ne part pas, ce qui donne une
impression désastreuse. **Ne pas animer les compteurs.**

Notre emplacement existe déjà et est vide, ce qui est le bon choix tant que rien n'est
confirmé. Demander à ECCOTA-EPF **quatre chiffres qu'elle peut prouver** : années
d'existence, nombre de marchés exécutés, régions couvertes, effectif. Un chiffre inventé se
retourne contre l'entreprise devant un donneur d'ordre qui vérifie.

### 8. Section méthode ou engagements

Cougnaud construit 4 piliers illustrés, chacun avec un chiffre et un objectif. Adapté à
ECCOTA-EPF, sans donnée client : **sécurité sur chantier, respect des délais, conformité aux
cahiers des charges, suivi et entretien après livraison**. Quatre engagements, quatre courtes
descriptions. Cela remplit une section sans rien inventer de factuel.

### 9. FAQ courte

Cougnaud en propose 3. Pour ECCOTA-EPF, les vraies questions d'un donneur d'ordre : dans
quelles régions intervenez-vous, quelle taille de marché pouvez-vous porter, quels documents
administratifs pouvez-vous fournir, quels sont vos délais habituels. Bon pour le
référencement, et cela désamorce des objections avant l'appel.

### 10. Grille de 6 réalisations puis « Voir tous nos projets »

DET affiche 6 projets sur l'accueil, puis renvoie au catalogue. Notre accueil en montre 3.
Passer à 6 dès que le client aura fourni la matière.

## P2 — plus tard, ou à ne pas prendre

| Élément | Décision |
| --- | --- |
| Carrousel de slogans en hero (Cougnaud) | **Refusé.** Retarde l'affichage, ne dit rien de vérifiable, et notre hero statique est plus fort |
| Compteurs animés (DET) | **Refusé.** Se dégradent mal, et « 0+ » à l'écran est pire que pas de chiffre |
| Newsletter (DET) | **Refusé.** Aucun contenu éditorial à envoyer |
| Section recrutement (Cougnaud) | Hors périmètre |
| Menus déroulants à plusieurs niveaux (Cougnaud) | Inutile à 7 rubriques. Le menu court de DET est le bon modèle |
| Logos clients en bandeau (DET) | **Reporté** au lot 2, et seulement avec autorisation écrite — voir `autorisation_logo` |
| Actualités / presse | Hors périmètre, déjà tranché |

## Deux corrections urgentes du lot 0

Sans rapport avec le benchmark, mais bloquantes avant le lot 1, parce que l'en-tête et le
pied de page vont être recopiés sur 9 pages.

### A. Le site n'a aucun accent

`grep -c "é\|è\|à\|ê" index.html` renvoie **0**. Le site affiche « genie civil », « maitres
d'ouvrage », « Guinee », « Creation confirmee », « References », « execution ».

Sur un site institutionnel français destiné à des donneurs d'ordre, l'absence totale
d'accents se lit immédiatement comme un travail bâclé. C'est le défaut le plus visible du
lot 0 et le moins coûteux à corriger.

La convention sans accents vient des documents internes du template GassTech, écrits ainsi
pour éviter les problèmes d'encodage entre outils. **Elle ne s'applique pas au contenu
publié.** Les fichiers HTML sont en UTF-8 : le texte visible par le visiteur doit être en
français correct. Les slugs, noms de fichiers et identifiants restent sans accent.

### B. Les titres parlent du projet, pas au visiteur

Titres actuellement en ligne :

> « Trois emplacements pour montrer le niveau d'exécution attendu. »
> « Un langage institutionnel, prêt pour les références validées. »
> « Des indicateurs sans chiffre inventé. »
> « Cette présentation résume les domaines connus d'ECCOTA-EPF en attendant les fiches de
> services détaillées du lot 1. »

Ce sont des notes de production affichées au visiteur. La discipline du contenu provisoire a
été correctement appliquée — tout est marqué `data-provisoire` — mais elle a débordé dans la
couche visible.

**Règle** : un contenu provisoire doit être un texte client **plausible**, marqué
`data-provisoire` dans le code et listé dans `CONTENUS_PROVISOIRES.md`. Jamais un commentaire
sur l'état d'avancement du projet. Le client va regarder cette page ; il doit y voir son
entreprise, pas notre plan de travail.

Corollaire tranché le 2026-08-19 : les marqueurs de contenu manquant sont conservés, mais
conditionnés au **mode recette** (`<body data-mode="recette">`). Ils servent de relance client
en situation ; sans l'attribut, la règle « vide = masqué » s'applique et le site se présente
comme fini. Voir `ARCHITECTURE.md` section 6.
