# Modèle de données — ECCOTA-EPF

> **Ce document décrit la phase 2** (PHP + MySQL, lots 4 à 8). Il reste la référence dès la
> phase 1 : les champs décrits ici déterminent ce que chaque page statique doit afficher, et
> les slugs choisis au lot 1 deviennent les clés de la base au lot 4.

Référence unique du schéma et du contrat des dépôts. Toute modification de table passe par
une migration numérotée dans `database/migrations/`, jamais par une édition de `schema.sql`
déjà déployé.

Conventions : tables et colonnes en français, minuscules, `snake_case`. Encodage
`utf8mb4_unicode_ci` partout. Dates en `DATETIME`, horodatage `cree_le` / `maj_le` sur
toutes les tables modifiables depuis l'administration.

## 1. Tables

### `utilisateurs`

Comptes de l'espace d'administration. Un seul compte est créé à l'installation ; la table en
accepte plusieurs sans migration.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `nom` | VARCHAR(120) | affiché dans l'en-tête de l'administration |
| `email` | VARCHAR(190) UNIQUE | sert d'identifiant de connexion |
| `mot_de_passe` | VARCHAR(255) | `password_hash()`, `PASSWORD_DEFAULT` |
| `actif` | TINYINT(1) | un compte désactivé ne peut plus se connecter |
| `derniere_connexion` | DATETIME NULL | |
| `cree_le`, `maj_le` | DATETIME | |

Pas de colonne `role` : un seul niveau de droits. En ajouter une plus tard est une migration
triviale ; inventer aujourd'hui une hiérarchie de rôles que personne n'a demandée ne l'est
pas.

### `services`

Les domaines d'intervention. **Cette table sert aussi de taxonomie aux réalisations** — un
seul référentiel, pas de double saisie, et le filtre « réalisations par domaine » vient
gratuitement.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `slug` | VARCHAR(160) UNIQUE | figé après création |
| `titre` | VARCHAR(190) | |
| `resume` | VARCHAR(300) | affiché sur les cartes de l'accueil et de `/services` |
| `description` | TEXT | HTML restreint, page de détail |
| `icone` | VARCHAR(60) NULL | clé d'icône du jeu interne |
| `image` | VARCHAR(255) NULL | chemin dans `uploads/` |
| `image_alt` | VARCHAR(255) NULL | |
| `meta_titre`, `meta_description` | VARCHAR(190) / VARCHAR(300) NULL | vides = repli sur `titre` et `resume` |
| `ordre` | INT | ordre d'affichage, réglé par glisser-déposer |
| `statut` | ENUM('brouillon','publie') | |
| `cree_le`, `maj_le` | DATETIME | |

Contenus initiaux issus du cahier des charges : BTP et construction, ouvrages de génie
civil, rénovation et entretien, fournitures diverses, transport, agriculture et élevage,
prestations diverses.

### `realisations`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `slug` | VARCHAR(190) UNIQUE | figé après création |
| `titre` | VARCHAR(190) | |
| `resume` | VARCHAR(300) | |
| `description` | TEXT | HTML restreint |
| `service_id` | INT NULL FK → `services.id` | `ON DELETE SET NULL` |
| `localisation` | VARCHAR(190) NULL | ex. « Kindia, Guinée » |
| `maitre_ouvrage` | VARCHAR(190) NULL | client ou donneur d'ordre, si autorisé |
| `date_debut` | DATE NULL | |
| `date_fin` | DATE NULL | |
| `en_cours` | TINYINT(1) | si 1, `date_fin` est ignorée à l'affichage |
| `chiffre_cle` | VARCHAR(60) NULL | surface, linéaire, capacité, durée — affiché sur la carte |
| `temoignage` | VARCHAR(500) NULL | citation du maître d'ouvrage |
| `temoignage_auteur` | VARCHAR(120) NULL | nom de la personne citée |
| `temoignage_fonction` | VARCHAR(150) NULL | fonction et organisme |
| `mis_en_avant` | TINYINT(1) | remonte sur l'accueil |
| `ordre` | INT | |
| `statut` | ENUM('brouillon','publie') | |
| `meta_titre`, `meta_description` | VARCHAR NULL | |
| `cree_le`, `maj_le` | DATETIME | |

Index : `statut`, `service_id`, `mis_en_avant`, `date_debut`.

Les quatre champs `chiffre_cle` et `temoignage*` viennent du benchmark Cougnaud
(`docs/design-ux/BENCHMARK_COUGNAUD_DET.md`, point 6) : une référence sans citation ni chiffre
est une photo ; avec, c'est une preuve opposable à un donneur d'ordre. Ils sont **facultatifs**
— une réalisation sans témoignage s'affiche normalement, sans emplacement vide.

`ON DELETE SET NULL` sur `service_id` est délibéré : supprimer un service ne doit jamais
faire disparaître une réalisation. Une réalisation sans domaine reste affichée et signalée
dans l'administration.

### `realisation_photos`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `realisation_id` | INT FK → `realisations.id` | `ON DELETE CASCADE` |
| `fichier` | VARCHAR(255) | nom de base sans suffixe de largeur |
| `alt` | VARCHAR(255) | **obligatoire à l'envoi** |
| `ordre` | INT | |
| `principale` | TINYINT(1) | une seule par réalisation, garantie applicative |
| `cree_le` | DATETIME | |

Les trois largeurs (480, 960, 1600) sont déduites de `fichier` par convention de nommage.
Elles ne sont pas stockées en colonnes : une largeur ajoutée plus tard ne demanderait alors
aucune migration.

La suppression en cascade supprime les lignes, **pas les fichiers**. La suppression physique
est faite explicitement par le code avant la suppression en base ; en cas d'échec, le fichier
orphelin est noté au journal plutôt que la suppression annulée.

### `partenaires`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `nom` | VARCHAR(190) | |
| `type` | ENUM('institution','entreprise','projet','organisme') | |
| `logo` | VARCHAR(255) NULL | vide autorisé : voir ci-dessous |
| `logo_alt` | VARCHAR(255) NULL | |
| `url` | VARCHAR(255) NULL | lien externe, `rel="noopener"` |
| `description` | VARCHAR(500) NULL | |
| `autorisation_logo` | TINYINT(1) | 0 par défaut |
| `ordre` | INT | |
| `statut` | ENUM('brouillon','publie') | |
| `cree_le`, `maj_le` | DATETIME | |

`autorisation_logo` n'est pas une précaution excessive : un logo est une marque. Sans accord
écrit, le partenaire est affiché en texte. La colonne rend cette règle vérifiable au lieu de
reposer sur la mémoire de celui qui saisit.

### `contenus`

Blocs de texte éditables qui ne justifient pas une table à eux seuls.

| Colonne | Type | Notes |
| --- | --- | --- |
| `cle` | VARCHAR(120) PK | ex. `accueil.hero.titre`, `apropos.historique` |
| `groupe` | VARCHAR(60) | regroupement dans l'écran d'administration |
| `libelle` | VARCHAR(190) | intitulé lisible affiché à l'administrateur |
| `type` | ENUM('texte','texte_long','html') | détermine le champ de saisie |
| `valeur` | TEXT | |
| `maj_le` | DATETIME | |

Les clés sont créées par le `seed.sql`, pas par l'administration. L'administrateur modifie
des valeurs, il ne crée pas de clés — sinon une clé jamais lue par aucune vue apparaîtrait
sans que rien ne le signale.

### `parametres`

Même forme que `contenus`, séparée parce que la nature est différente : coordonnées,
identité, réseaux.

Clés prévues : `entreprise.nom`, `entreprise.rccm`, `entreprise.nif`, `contact.telephone`,
`contact.telephone_2`, `contact.whatsapp`, `contact.email`, `contact.adresse`,
`contact.horaires`, `contact.maps_embed`, `reseaux.facebook`, `reseaux.linkedin`,
`seo.titre_defaut`, `seo.description_defaut`, `seo.image_partage`.

### `messages_contact`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `nom` | VARCHAR(150) | |
| `email` | VARCHAR(190) | |
| `telephone` | VARCHAR(40) NULL | |
| `sujet` | VARCHAR(190) | |
| `message` | TEXT | |
| `ip_hash` | CHAR(64) | SHA-256 de l'IP + sel du site, jamais l'IP en clair |
| `envoi_mail` | ENUM('ok','echec','non_tente') | |
| `lu` | TINYINT(1) | |
| `traite` | TINYINT(1) | |
| `cree_le` | DATETIME | |

`ip_hash` permet de limiter le spam et de reconnaître un envoi répété sans conserver de
donnée personnelle en clair. La politique de confidentialité doit annoncer une durée de
conservation ; la purge des messages traités de plus de 24 mois est prévue au lot 6.

### `journal_admin`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `utilisateur_id` | INT NULL | NULL si le compte a été supprimé |
| `action` | VARCHAR(40) | `connexion`, `creation`, `modification`, `suppression`, `echec_connexion` |
| `entite` | VARCHAR(60) | `realisation`, `service`, … |
| `entite_id` | INT NULL | |
| `detail` | VARCHAR(255) NULL | jamais de mot de passe, jamais de contenu de message |
| `cree_le` | DATETIME | |

### `tentatives_connexion`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | INT AI PK | |
| `identifiant` | VARCHAR(190) | e-mail saisi |
| `ip_hash` | CHAR(64) | |
| `cree_le` | DATETIME | |

Purgée au-delà de 24 heures. Sert au blocage progressif du lot 7.

## 2. Contrat des dépôts

Ce contrat est **figé au lot 4**.
Il est écrit ici avant d'être implémenté : les contrôleurs et les vues du lot 4 sont écrits
contre ce contrat, pas l'inverse.

Règles générales :

- toute méthode renvoie un tableau associatif PHP ou un tableau de tableaux ;
- une méthode « un élément » renvoie `null` si rien n'est trouvé, jamais `false`, jamais un
  tableau vide ;
- les dépôts publics ne renvoient **que** les contenus `publie` ; les méthodes destinées à
  l'administration sont préfixées `admin` et voient aussi les brouillons ;
- aucun dépôt n'affiche, ne redirige ni ne lance d'exception d'affichage.

```php
// repositories/Realisations.php
listerPubliees(?int $serviceId, int $page, int $parPage): array  // ['items'=>[], 'total'=>int, 'pages'=>int]
listerMisesEnAvant(int $limite): array
trouverParSlug(string $slug): ?array                             // photos incluses
compterPubliees(?int $serviceId): int
adminLister(array $filtres, int $page, int $parPage): array
adminTrouver(int $id): ?array
creer(array $donnees): int
modifier(int $id, array $donnees): void
supprimer(int $id): void
reordonner(array $idsDansLOrdre): void

// repositories/Services.php
listerPublies(): array
trouverParSlug(string $slug): ?array
adminLister(): array ; adminTrouver(int $id): ?array
creer / modifier / supprimer / reordonner

// repositories/Partenaires.php
listerPublies(): array ; adminLister(): array ; adminTrouver(int $id): ?array
creer / modifier / supprimer / reordonner

// repositories/Contenus.php
tous(): array                        // ['cle' => 'valeur']
groupe(string $groupe): array
enregistrer(array $clesValeurs): void

// repositories/Parametres.php
tous(): array ; enregistrer(array $clesValeurs): void

// repositories/Messages.php
enregistrer(array $donnees): int
marquerEnvoi(int $id, string $etat): void
lister(array $filtres, int $page, int $parPage): array
trouver(int $id): ?array
marquerLu(int $id): void ; marquerTraite(int $id): void ; supprimer(int $id): void

// repositories/Utilisateurs.php
trouverParEmail(string $email): ?array
enregistrerConnexion(int $id): void
modifierProfil(int $id, array $donnees): void
modifierMotDePasse(int $id, string $hash): void
```

### Forme d'une réalisation renvoyée par `trouverParSlug`

```php
[
  'id' => 12,
  'slug' => 'construction-ecole-primaire-kindia',
  'titre' => "Construction d'une école primaire à Kindia",
  'resume' => '…',
  'description' => '<p>…</p>',
  'localisation' => 'Kindia, Guinée',
  'maitre_ouvrage' => null,
  'chiffre_cle' => '620 m²',
  'temoignage' => null,
  'temoignage_auteur' => null,
  'temoignage_fonction' => null,
  'date_debut' => '2023-03-01',
  'date_fin' => '2023-11-30',
  'en_cours' => false,
  'periode_affichee' => 'Mars 2023 – Novembre 2023',   // calculée par le dépôt
  'service' => ['id' => 1, 'slug' => 'btp-construction', 'titre' => 'BTP et construction'],
  'photos' => [
    ['fichier' => 'a3f9c1', 'alt' => 'Façade achevée', 'principale' => true],
  ],
  'meta_titre' => null,
  'meta_description' => null,
]
```

`periode_affichee` est calculée dans le dépôt et non dans la vue : la règle « si `en_cours`,
afficher *Depuis mars 2023* » est une règle métier, et elle doit produire le même texte sur
la liste, la page de détail et la fiche d'accueil.

## 3. Contenus initiaux du `seed.sql`

- les 7 services du cahier des charges, publiés, dans l'ordre d'importance commerciale ;
- les clés de `contenus` et `parametres`, avec des valeurs provisoires explicitement
  reconnaissables (`[À COMPLÉTER]`) là où l'information client manque ;
- **aucune réalisation d'exemple en base de production.** Les réalisations de démonstration
  écrites en phase 1 sont remplacées par les réalisations réelles avant le lot 4 ; aucune ne
  doit survivre dans `seed.sql`.

Le compte administrateur n'est pas dans `seed.sql`. Il est créé par un script
d'installation à usage unique qui demande l'e-mail et le mot de passe, et refuse de
s'exécuter si un compte existe déjà. Un mot de passe en clair dans un fichier SQL versionné
finit toujours par rester en production.
