# Site web ECCOTA-EPF

Site vitrine institutionnel d'ECCOTA-EPF, entreprise guinéenne créée le 03 novembre 2015,
active dans le BTP, les ouvrages de génie civil, les fournitures diverses, le transport et
les activités agropastorales.

Le projet suit le template Web/Mobile GassTech et se construit en deux phases.

| | Phase 1 | Phase 2 |
| --- | --- | --- |
| Contenu | Site public complet | Espace d'administration |
| Technologie | HTML + **Bootstrap 5.3** | PHP 8.1 + MySQL |
| Hébergement | GitHub Pages | Mutualisé cPanel |
| Lots | 0 à 3 | 4 à 8 |

Le rendu visuel ne change pas entre les deux phases : la phase 2 découpe le HTML de la
phase 1 en gabarits, elle ne le redessine pas.

## Dépôt

- GitHub : https://github.com/Gaslandie/eccotaepf.git
- Recette phase 1 (lot 3) : https://gaslandie.github.io/eccotaepf/

Le nom du dépôt est `eccotaepf` : GitHub Pages servira donc le site depuis le sous-chemin
`/eccotaepf/`. Tous les chemins doivent rester relatifs.

## Documents de référence

- Architecture : `docs/technique/ARCHITECTURE.md`
- Décisions : `docs/technique/ADR-001-pile-technique.md` et `ADR-002-bootstrap-statique.md`
- Modèle de données (phase 2) : `docs/technique/MODELE_DONNEES.md`
- Lots de travail : `docs/taches/`
- Contexte, décisions, risques : `docs/PROJECT_CONTEXT.md`

## Pile

Bootstrap **5.3.8**, copié dans `assets/vendor/bootstrap/`, jamais appelé depuis un CDN.
Version exacte : `5.3.8`, distribution officielle `bootstrap-5.3.8-dist.zip`.

Les polices **Figtree** (titres, graisses 600 et 700) et **Karla** (corps, graisses 400 à
700) sont auto-hébergées au format WOFF2 dans `assets/fonts/`. Elles sont distribuées sous
licence SIL Open Font License 1.1, dont une copie accompagne chaque famille. Sources :
https://fonts.google.com/specimen/Figtree et https://fonts.google.com/specimen/Karla.

Aucun gestionnaire de paquets, aucune étape de build, aucune bibliothèque supplémentaire.
Node n'est utilisé que pour deux scripts de vérification, sans dépendance.

## Commandes

```bash
# Installer
# Rien à installer.

# Lancer en local
python3 -m http.server 4173

# Vérifier les liens et les ressources locales
node scripts/verifier-liens.js

# Vérifier la syntaxe JavaScript
node --check assets/js/main.js

# Générer le sitemap
node scripts/generer-sitemap.js

# Builder
# Aucun build. Les fichiers écrits sont les fichiers publiés.
```

## Pages

| Fichier | URL en phase 2 |
| --- | --- |
| `index.html` | `/` |
| `a-propos.html` | `/a-propos` |
| `services.html` | `/services` |
| `realisations/index.html` | `/realisations` |
| `realisations/<slug>.html` | `/realisations/<slug>` |
| `partenaires.html` | `/partenaires` |
| `contact.html` | `/contact` |
| `mentions-legales.html` · `confidentialite.html` | pages légales |
| `404.html` | — |

## Avancement

| Lot | Sujet | État |
| --- | --- | --- |
| 0 | Socle Bootstrap, thème, accueil | Testé |
| 1 | Les 8 pages publiques restantes | **Fait** — correctif en cours |
| 2 | Images et référencement | **Fait** — testé |
| 2C | Interface et animations | **Fait** — testé |
| 2D | Hero calé sur Cougnaud, correction de la carte | **Fait** — testé |
| 3 | Publication de la maquette et validation client | À faire — **jalon bloquant** |
| 2B | Intégration des contenus réels | Bloqué — après le feu vert |
| 4 | Bascule PHP et base de données | À faire |
| 5 | Espace d'administration | À faire |
| 6 | Formulaire de contact serveur | À faire |
| 7 | Durcissement sécurité et sauvegardes | À faire |
| 8 | Mise en ligne, recette, formation | À faire |

## Règles à ne pas enfreindre

- **Chemins relatifs uniquement.** GitHub Pages sert le site depuis un sous-chemin ; tout
  `href="/…"` sera cassé.
- **En-tête et pied de page identiques sur toutes les pages.** Toute divergence se paiera au
  lot 4.
- **Aucune image sans ligne dans `docs/design-ux/SOURCES_IMAGES.md`.**
- **La mise en ligne est bloquée tant que `docs/design-ux/CONTENUS_PROVISOIRES.md` n'est pas
  vide.**
- Aucun CDN, aucun npm, aucune bibliothèque en plus de Bootstrap.
- Aucun secret dans le dépôt.
